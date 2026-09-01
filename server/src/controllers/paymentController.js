import axios from "axios";
import crypto from "crypto";

import prisma from "../config/prisma.js";
import { notifyUser, notifyAdmins } from "../utils/notify.js";

const FLW_BASE_URL = "https://api.flutterwave.com/v3";
const PAYMENT_CURRENCY = "GBP";

/* =========================================================
   INITIATE PAYMENT
   Creates a Flutterwave hosted checkout link for a booking
   that hasn't been paid for yet.
========================================================= */

export const initiatePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "bookingId is required",
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true, user: true },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pay for this booking",
      });
    }

    if (!booking.payment) {
      return res.status(404).json({
        success: false,
        message: "No payment record found for this booking",
      });
    }

    if (booking.payment.status === "PAID") {
      return res.status(409).json({
        success: false,
        message: "This booking has already been paid for",
      });
    }

    if (booking.payment.method === "PAY_ON_DELIVERY") {
      return res.status(400).json({
        success: false,
        message: "This booking is set to pay on delivery",
      });
    }

    if (!process.env.FLW_SECRET_KEY) {
      console.error("FLW_SECRET_KEY is not set");

      return res.status(500).json({
        success: false,
        message: "Payment provider is not configured",
      });
    }

    if (!process.env.FRONTEND_URL) {
      console.error("FRONTEND_URL is not set");

      return res.status(500).json({
        success: false,
        message: "Payment provider is not configured",
      });
    }

    const txRef = `LT-${booking.bookingId}-${Date.now()}`;

    const flwResponse = await axios.post(
      `${FLW_BASE_URL}/payments`,
      {
        tx_ref: txRef,
        amount: booking.payment.amount,
        currency: PAYMENT_CURRENCY,
        redirect_url: `${process.env.FRONTEND_URL}/payment/callback`,
        payment_options:
          booking.payment.method === "BANK_TRANSFER" ? "banktransfer" : "card",
        customer: {
          email: booking.senderEmail || booking.user.email,
          name: booking.senderName,
          phonenumber: booking.senderPhone || undefined,
        },
        customizations: {
          title: "LordTaylor Cargo",
          description: `Payment for shipment ${booking.bookingId}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );

    const paymentLink = flwResponse.data?.data?.link;

    if (flwResponse.data?.status !== "success" || !paymentLink) {
      throw new Error("Flutterwave did not return a payment link");
    }

    await prisma.payment.update({
      where: { id: booking.payment.id },
      data: { txRef },
    });

    return res.status(200).json({
      success: true,
      link: paymentLink,
    });
  } catch (error) {
    console.error(
      "Initiate payment error:",
      error?.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to initiate payment",
    });
  }
};

/* =========================================================
   SHARED — CONFIRM TRANSACTION
   The single source of truth for marking a payment PAID.
   Called from both the redirect-verify endpoint and the
   webhook handler, so either path (or both) can safely
   confirm the same payment without double-processing it.
========================================================= */

const confirmTransaction = async (flwTransactionId) => {
  const verifyResponse = await axios.get(
    `${FLW_BASE_URL}/transactions/${flwTransactionId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
      timeout: 15000,
    },
  );

  const txData = verifyResponse.data?.data;

  if (!txData || !txData.tx_ref) {
    return { success: false, reason: "No transaction data returned" };
  }

  const payment = await prisma.payment.findUnique({
    where: { txRef: txData.tx_ref },
  });

  if (!payment) {
    return {
      success: false,
      reason: "No matching payment found for this transaction",
    };
  }

  /* ---------------------------------------------------
     IDEMPOTENCY
     Webhooks can arrive more than once, and the redirect
     path can race with the webhook. If this payment is
     already marked PAID, don't process it again.
  --------------------------------------------------- */

  if (payment.status === "PAID") {
    return { success: true, alreadyProcessed: true, payment };
  }

  const isValid =
    txData.status === "successful" &&
    Number(txData.amount) >= Number(payment.amount) &&
    txData.currency === PAYMENT_CURRENCY &&
    txData.tx_ref === payment.txRef;

  if (!isValid) {
    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        transactionId: String(txData.id),
      },
      include: { booking: true },
    });

    if (updated.booking) {
      await notifyUser(
        updated.booking.userId,
        "Payment Failed",
        `Payment for ${updated.booking.bookingId} could not be completed.`,
        { link: "/history" },
      );
    }

    return {
      success: false,
      reason: "Verification checks failed",
      payment: updated,
    };
  }

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "PAID",
      transactionId: String(txData.id),
    },
    include: { booking: true },
  });

  if (updated.booking) {
    await notifyUser(
      updated.booking.userId,
      "Payment Received",
      `Payment confirmed for ${updated.booking.bookingId} — £${updated.amount.toFixed(2)}.`,
      { link: "/history" },
    );

    await notifyAdmins(
      "Payment Received",
      `Payment confirmed for ${updated.booking.bookingId} — £${updated.amount.toFixed(2)}.`,
      { link: "/admin/payments" },
    );
  }

  return { success: true, payment: updated };
};

/* =========================================================
   VERIFY PAYMENT
   Hit by the frontend after the customer is redirected back
   from Flutterwave's checkout.
========================================================= */

export const verifyPayment = async (req, res) => {
  try {
    const { transaction_id, status } = req.query;

    if (status === "cancelled") {
      return res.status(200).json({
        success: false,
        message: "Payment was cancelled",
      });
    }

    if (!transaction_id) {
      return res.status(400).json({
        success: false,
        message: "transaction_id is required",
      });
    }

    const result = await confirmTransaction(transaction_id);

    if (!result.success) {
      return res.status(200).json({
        success: false,
        message: "Payment could not be verified",
      });
    }

    return res.status(200).json({
      success: true,
      message: result.alreadyProcessed
        ? "Payment already confirmed"
        : "Payment confirmed",
      payment: result.payment,
    });
  } catch (error) {
    console.error(
      "Verify payment error:",
      error?.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};

/* =========================================================
   WEBHOOK
   Called directly by Flutterwave. This is the resilient
   confirmation path — it works even if the customer closes
   their browser before the redirect completes.
========================================================= */

const isValidSignature = (req) => {
  const secretHash = process.env.FLW_SECRET_HASH;

  if (!secretHash) {
    console.error("FLW_SECRET_HASH is not set");
    return false;
  }

  // Classic v3 Standard Checkout style — direct match
  const verifHash = req.headers["verif-hash"];

  if (verifHash) {
    return verifHash === secretHash;
  }

  // Newer HMAC-SHA256 style, if Flutterwave sends this instead
  const flwSignature = req.headers["flutterwave-signature"];

  if (flwSignature && Buffer.isBuffer(req.body)) {
    const computed = crypto
      .createHmac("sha256", secretHash)
      .update(req.body)
      .digest("base64");

    return computed === flwSignature;
  }

  return false;
};

export const handleWebhook = async (req, res) => {
  try {
    if (!isValidSignature(req)) {
      return res.status(401).end();
    }

    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString("utf-8")
      : JSON.stringify(req.body);

    const payload = JSON.parse(rawBody);

    // Acknowledge immediately per Flutterwave's best practice —
    // do the actual confirmation work after responding.
    res.status(200).end();

    const flwTransactionId = payload?.data?.id;

    if (payload?.data?.status === "successful" && flwTransactionId) {
      await confirmTransaction(flwTransactionId);
    }
  } catch (error) {
    console.error("Webhook error:", error.message);

    if (!res.headersSent) {
      res.status(200).end();
    }
  }
};

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCircleCheck, FaCircleXmark, FaRotate } from "react-icons/fa6";

import "../styles/paymentCallback.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const transactionId = searchParams.get("transaction_id");
        const flwStatus = searchParams.get("status");

        const token = localStorage.getItem("lordtaylor-token");

        if (!token) {
          setStatus("failed");
          setMessage("You are not logged in.");
          return;
        }

        if (flwStatus === "cancelled") {
          setStatus("failed");
          setMessage("Payment was cancelled.");
          return;
        }

        if (!transactionId) {
          setStatus("failed");
          setMessage("No transaction reference was returned.");
          return;
        }

        const response = await fetch(
          `${API_URL}/payments/verify?transaction_id=${encodeURIComponent(transactionId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage("Your payment was confirmed successfully.");
        } else {
          setStatus("failed");
          setMessage(data.message || "We couldn't confirm your payment.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setMessage("Something went wrong while confirming your payment.");
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="payment-callback-page">
      <div className="payment-callback-card">
        {status === "verifying" && (
          <>
            <div className="payment-callback-icon verifying">
              <FaRotate className="refresh-spinning" />
            </div>

            <h1>Confirming your payment...</h1>

            <p>Hold on while we verify your transaction with Flutterwave.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="payment-callback-icon success">
              <FaCircleCheck />
            </div>

            <h1>Payment Successful</h1>

            <p>{message}</p>

            <button
              type="button"
              className="payment-callback-button"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="payment-callback-icon failed">
              <FaCircleXmark />
            </div>

            <h1>Payment Not Confirmed</h1>

            <p>{message}</p>

            <button
              type="button"
              className="payment-callback-button"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default PaymentCallback;

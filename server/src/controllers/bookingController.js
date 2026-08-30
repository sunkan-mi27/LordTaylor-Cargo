import crypto from "crypto";
import prisma from "../config/prisma.js";
import { notifyUser, notifyAdmins } from "../utils/notify.js";

/* =========================================================
   CONSTANTS
========================================================= */

const VALID_SERVICES = ["Standard", "Express", "Economy"];

const VALID_PAYMENT_METHODS = ["PAY_ON_DELIVERY", "CARD", "BANK_TRANSFER"];

const VALID_STATUSES = [
  "BOOKED",
  "PROCESSING",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_PROGRESS = {
  BOOKED: 0,
  PROCESSING: 33,
  IN_TRANSIT: 66,
  DELIVERED: 100,
  CANCELLED: 0,
};

const STATUS_EVENT_TITLES = {
  BOOKED: "Booking Confirmed",
  PROCESSING: "Shipment Processing",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Shipment Cancelled",
};

const STATUS_ORDER = ["BOOKED", "PROCESSING", "IN_TRANSIT", "DELIVERED"];

/* =========================================================
   ID GENERATORS
========================================================= */

const generateBookingId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();

  const random = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `LT-${timestamp}-${random}`;
};

const generateTrackingNumber = () => {
  const random = crypto.randomBytes(5).toString("hex").toUpperCase();

  return `LT${random}`;
};

/* =========================================================
   DELIVERY CALCULATION
========================================================= */

const calculateEstimatedDelivery = (pickupDate, service) => {
  const startDate = pickupDate ? new Date(pickupDate) : new Date();

  const deliveryDays = {
    Express: 1,
    Standard: 3,
    Economy: 5,
  };

  const days = deliveryDays[service] ?? 3;

  const estimatedDate = new Date(startDate);

  estimatedDate.setDate(estimatedDate.getDate() + days);

  return estimatedDate;
};

/* =========================================================
   HELPERS
========================================================= */

const cleanString = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const isValidDate = (value) => {
  if (!value) {
    return true;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
};

const isValidPositiveNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) && number > 0;
};

const isValidNonNegativeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) && number >= 0;
};

const isStatusTransitionAllowed = (currentStatus, nextStatus) => {
  if (currentStatus === nextStatus) {
    return true;
  }

  // Delivered shipments cannot move backwards.
  if (currentStatus === "DELIVERED") {
    return false;
  }

  // Cancelled shipments are terminal.
  if (currentStatus === "CANCELLED") {
    return false;
  }

  // Cancellation is allowed before delivery.
  if (nextStatus === "CANCELLED") {
    return true;
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  const nextIndex = STATUS_ORDER.indexOf(nextStatus);

  if (currentIndex === -1 || nextIndex === -1) {
    return false;
  }

  // Shipment status should move forward only.
  return nextIndex >= currentIndex;
};

/* =========================================================
   CREATE BOOKING
========================================================= */

export const createBooking = async (req, res) => {
  try {
    const {
      senderName,
      senderPhone,
      senderEmail,
      receiverName,
      receiverPhone,
      pickup,
      destination,
      packageType,
      weight,
      pickupDate,
      service,
      paymentMethod,
      estimatedCost,
    } = req.body;

    /* -------------------------------------------------------
       AUTHENTICATION
    ------------------------------------------------------- */

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    /* -------------------------------------------------------
       CLEAN INPUT
    ------------------------------------------------------- */

    const cleanSenderName = cleanString(senderName);
    const cleanSenderPhone = cleanString(senderPhone);
    const cleanSenderEmail = cleanString(senderEmail);
    const cleanReceiverName = cleanString(receiverName);
    const cleanReceiverPhone = cleanString(receiverPhone);
    const cleanPickup = cleanString(pickup);
    const cleanDestination = cleanString(destination);
    const cleanPackageType = cleanString(packageType);
    const cleanService = cleanString(service);
    const cleanPaymentMethod = cleanString(paymentMethod);

    /* -------------------------------------------------------
       REQUIRED FIELDS
    ------------------------------------------------------- */

    if (
      !cleanSenderName ||
      !cleanReceiverName ||
      !cleanPickup ||
      !cleanDestination ||
      !cleanPackageType ||
      !cleanService ||
      !cleanPaymentMethod ||
      estimatedCost === undefined ||
      estimatedCost === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required booking information",
      });
    }

    /* -------------------------------------------------------
       VALIDATE WEIGHT
    ------------------------------------------------------- */

    if (!isValidPositiveNumber(weight)) {
      return res.status(400).json({
        success: false,
        message: "Shipment weight must be greater than zero",
      });
    }

    /* -------------------------------------------------------
       VALIDATE COST
    ------------------------------------------------------- */

    if (!isValidNonNegativeNumber(estimatedCost)) {
      return res.status(400).json({
        success: false,
        message: "Estimated cost must be a valid amount",
      });
    }

    /* -------------------------------------------------------
       VALIDATE SERVICE
    ------------------------------------------------------- */

    if (!VALID_SERVICES.includes(cleanService)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping service",
      });
    }

    /* -------------------------------------------------------
       VALIDATE PAYMENT METHOD
    ------------------------------------------------------- */

    if (!VALID_PAYMENT_METHODS.includes(cleanPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    /* -------------------------------------------------------
       VALIDATE PICKUP DATE
    ------------------------------------------------------- */

    if (!isValidDate(pickupDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup date",
      });
    }

    const parsedPickupDate = pickupDate ? new Date(pickupDate) : null;

    /* -------------------------------------------------------
       GENERATE IDS
    ------------------------------------------------------- */

    const bookingId = generateBookingId();
    const trackingNumber = generateTrackingNumber();

    const estimatedDelivery = calculateEstimatedDelivery(
      parsedPickupDate,
      cleanService,
    );

    const now = new Date();

    /* -------------------------------------------------------
       ATOMIC TRANSACTION
    ------------------------------------------------------- */

    const booking = await prisma.$transaction(async (transaction) => {
      const createdBooking = await transaction.booking.create({
        data: {
          bookingId,

          userId: req.user.id,

          senderName: cleanSenderName,
          senderPhone: cleanSenderPhone || null,
          senderEmail: cleanSenderEmail || null,

          receiverName: cleanReceiverName,
          receiverPhone: cleanReceiverPhone || null,

          pickup: cleanPickup,
          destination: cleanDestination,

          packageType: cleanPackageType,

          weight: Number(weight),

          pickupDate: parsedPickupDate,

          service: cleanService,

          paymentMethod: cleanPaymentMethod,

          estimatedCost: Number(estimatedCost),

          status: "BOOKED",

          shipment: {
            create: {
              trackingNumber,

              status: "BOOKED",

              origin: cleanPickup,

              destination: cleanDestination,

              estimatedDelivery,

              lastUpdate: now.toISOString(),

              progress: 0,

              trackingEvents: {
                create: [
                  {
                    title: "Booking Confirmed",

                    location: cleanPickup,

                    description: "Your shipment booking has been confirmed.",

                    eventDate: now,

                    completed: true,
                  },

                  {
                    title: "Shipment Processing",

                    location: cleanPickup,

                    description:
                      "Your shipment is being prepared for dispatch.",

                    eventDate: now,

                    completed: false,
                  },

                  {
                    title: "In Transit",

                    location: cleanDestination,

                    description:
                      "Your shipment will move toward its destination.",

                    eventDate: now,

                    completed: false,
                  },

                  {
                    title: "Delivered",

                    location: cleanDestination,

                    description: "Shipment delivered successfully.",

                    eventDate: now,

                    completed: false,
                  },

                  {
                    title: "Shipment Cancelled",

                    location: cleanPickup,

                    description: "This shipment has been cancelled.",

                    eventDate: now,

                    completed: false,
                  },
                ],
              },
            },
          },

          payment: {
            create: {
              amount: Number(estimatedCost),

              method: cleanPaymentMethod,

              status: "PENDING",
            },
          },
        },

        include: {
          shipment: {
            include: {
              trackingEvents: {
                orderBy: {
                  eventDate: "asc",
                },
              },
            },
          },

          payment: true,
        },
      });

      return createdBooking;
    });

    await notifyUser(
      booking.userId,
      "Booking Confirmed",
      `Your shipment ${booking.bookingId} has been booked successfully.`,
      { link: "/history" },
    );

    await notifyAdmins(
      "New Booking",
      `New booking ${booking.bookingId} from ${booking.senderName}.`,
      { link: "/admin/bookings" },
    );

    /* -------------------------------------------------------
       RESPONSE
    ------------------------------------------------------- */

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    /* -------------------------------------------------------
       PRISMA UNIQUE CONSTRAINT
    ------------------------------------------------------- */

    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A booking identifier conflict occurred. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating your booking",
    });
  }
};

/* =========================================================
   TRACK SHIPMENT
========================================================= */

export const trackShipment = async (req, res) => {
  try {
    const trackingNumber = cleanString(req.params.trackingNumber);

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        message: "Tracking number is required",
      });
    }

    const shipment = await prisma.shipment.findUnique({
      where: {
        trackingNumber,
      },

      include: {
        trackingEvents: {
          orderBy: {
            eventDate: "asc",
          },
        },

        booking: {
          select: {
            bookingId: true,
            senderName: true,
            receiverName: true,
            pickup: true,
            destination: true,
            packageType: true,
            weight: true,
            service: true,
            status: true,
            createdAt: true,
            estimatedCost: true,
          },
        },
      },
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    return res.status(200).json({
      success: true,
      shipment,
    });
  } catch (error) {
    console.error("Track shipment error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while tracking the shipment",
    });
  }
};

/* =========================================================
   UPDATE SHIPMENT STATUS
========================================================= */

export const updateShipmentStatus = async (req, res) => {
  try {
    /* -------------------------------------------------------
       ADMIN AUTHORIZATION
    ------------------------------------------------------- */

    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can update shipment status",
      });
    }

    const trackingNumber = cleanString(req.params.trackingNumber);

    const status = cleanString(req.body.status).toUpperCase();

    if (!trackingNumber || !status) {
      return res.status(400).json({
        success: false,
        message: "Tracking number and status are required",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipment status",
      });
    }

    /* -------------------------------------------------------
       FIND SHIPMENT
    ------------------------------------------------------- */

    const shipment = await prisma.shipment.findUnique({
      where: {
        trackingNumber,
      },

      include: {
        booking: true,
      },
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    /* -------------------------------------------------------
       CHECK TRANSITION
    ------------------------------------------------------- */

    if (!isStatusTransitionAllowed(shipment.status, status)) {
      return res.status(409).json({
        success: false,
        message: `Shipment cannot move from ${shipment.status} to ${status}`,
      });
    }

    /* -------------------------------------------------------
       NO-OP
    ------------------------------------------------------- */

    if (shipment.status === status) {
      const currentShipment = await prisma.shipment.findUnique({
        where: {
          trackingNumber,
        },

        include: {
          trackingEvents: {
            orderBy: {
              eventDate: "asc",
            },
          },

          booking: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Shipment is already at this status",
        shipment: currentShipment,
      });
    }

    const now = new Date();

    /* -------------------------------------------------------
       TRANSACTION
    ------------------------------------------------------- */

    const finalShipment = await prisma.$transaction(async (transaction) => {
      await transaction.shipment.update({
        where: {
          trackingNumber,
        },

        data: {
          status,

          progress: STATUS_PROGRESS[status],

          lastUpdate: now.toISOString(),
        },
      });

      await transaction.booking.update({
        where: {
          id: shipment.bookingId,
        },

        data: {
          status,
        },
      });

      /* -----------------------------------------------
             COMPLETE PREVIOUS EVENTS
          ----------------------------------------------- */

      if (status !== "CANCELLED") {
        const currentIndex = STATUS_ORDER.indexOf(status);

        if (currentIndex >= 0) {
          for (let i = 0; i <= currentIndex; i++) {
            const eventTitle = STATUS_EVENT_TITLES[STATUS_ORDER[i]];

            await transaction.trackingEvent.updateMany({
              where: {
                shipmentId: shipment.id,

                title: eventTitle,
              },

              data: {
                completed: true,
              },
            });
          }
        }
      }

      /* -----------------------------------------------
             CANCELLED
          ----------------------------------------------- */

      if (status === "CANCELLED") {
        await transaction.trackingEvent.updateMany({
          where: {
            shipmentId: shipment.id,

            title: "Shipment Cancelled",
          },

          data: {
            completed: true,
            eventDate: now,
          },
        });
      }

      /* -----------------------------------------------
             CURRENT EVENT
          ----------------------------------------------- */

      const currentEventTitle = STATUS_EVENT_TITLES[status];

      if (currentEventTitle && status !== "CANCELLED") {
        await transaction.trackingEvent.updateMany({
          where: {
            shipmentId: shipment.id,

            title: currentEventTitle,
          },

          data: {
            completed: true,
            eventDate: now,
          },
        });
      }

      /* -----------------------------------------------
             RETURN UPDATED SHIPMENT
          ----------------------------------------------- */

      return transaction.shipment.findUnique({
        where: {
          trackingNumber,
        },

        include: {
          trackingEvents: {
            orderBy: {
              eventDate: "asc",
            },
          },

          booking: true,
        },
      });
    });

    return res.status(200).json({
      success: true,
      message: `Shipment status updated to ${status}`,

      shipment: finalShipment,
    });
  } catch (error) {
    console.error("Update shipment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating shipment status",
    });
  }
};

/* =========================================================
   BOOKING HISTORY
========================================================= */

export const getBookingHistory = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        shipment: {
          include: {
            trackingEvents: {
              orderBy: {
                eventDate: "asc",
              },
            },
          },
        },

        payment: {
          select: {
            amount: true,
            method: true,
            status: true,
            transactionId: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get booking history error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while loading booking history",
    });
  }
};

/* =========================================================
   CUSTOMER DASHBOARD DATA
========================================================= */

export const getDashboardData = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },

      include: {
        shipment: {
          include: {
            trackingEvents: {
              orderBy: {
                eventDate: "desc",
              },
            },
          },
        },

        payment: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    /* -------------------------------------------------------
       STATS
    ------------------------------------------------------- */

    const stats = {
      total: bookings.length,

      booked: bookings.filter((booking) => booking.status === "BOOKED").length,

      processing: bookings.filter((booking) => booking.status === "PROCESSING")
        .length,

      inTransit: bookings.filter((booking) => booking.status === "IN_TRANSIT")
        .length,

      delivered: bookings.filter((booking) => booking.status === "DELIVERED")
        .length,

      cancelled: bookings.filter((booking) => booking.status === "CANCELLED")
        .length,

      totalSpent: bookings.reduce(
        (total, booking) => total + Number(booking.estimatedCost || 0),

        0,
      ),
    };

    /* -------------------------------------------------------
       RECENT SHIPMENTS
    ------------------------------------------------------- */

    const recentShipments = bookings.slice(0, 5).map((booking) => ({
      id: booking.id,

      bookingId: booking.bookingId,

      trackingNumber: booking.shipment?.trackingNumber || null,

      senderName: booking.senderName,

      receiverName: booking.receiverName,

      pickup: booking.pickup,

      destination: booking.destination,

      status: booking.status,

      estimatedCost: booking.estimatedCost,

      createdAt: booking.createdAt,

      progress: booking.shipment?.progress ?? 0,
    }));

    /* -------------------------------------------------------
       ACTIVITY
    ------------------------------------------------------- */

    const activity = bookings
      .flatMap((booking) =>
        (booking.shipment?.trackingEvents || []).map((event) => ({
          id: event.id,

          title: event.title,

          description: event.description,

          location: event.location,

          eventDate: event.eventDate,

          trackingNumber: booking.shipment?.trackingNumber || null,
        })),
      )
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate))
      .slice(0, 8);

    return res.status(200).json({
      success: true,
      stats,
      recentShipments,
      activity,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

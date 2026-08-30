import prisma from "../config/prisma.js";
import { notifyUser } from "../utils/notify.js";
/* =========================================================
   ADMIN — CUSTOMERS
========================================================= */

export const getAdminCustomers = async (req, res) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100,
    );
    const skip = (page - 1) * limit;

    const search = String(req.query.search || "").trim();

    const where = {
      role: "CUSTOMER",
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { profile: { firstName: { contains: search, mode: "insensitive" } } },
          { profile: { lastName: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    const [totalCount, customers] = await Promise.all([
      prisma.user.count({ where }),

      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          profile: true,
          _count: {
            select: { bookings: true },
          },
          bookings: {
            select: {
              payment: {
                select: { amount: true, status: true },
              },
            },
          },
        },
      }),
    ]);

    const formattedCustomers = customers.map((customer) => {
      const totalSpent = customer.bookings.reduce((sum, booking) => {
        if (booking.payment?.status === "PAID") {
          return sum + (booking.payment.amount || 0);
        }
        return sum;
      }, 0);

      return {
        id: customer.id,
        email: customer.email,
        firstName: customer.profile?.firstName || null,
        lastName: customer.profile?.lastName || null,
        phone: customer.profile?.phone || null,
        city: customer.profile?.city || null,
        country: customer.profile?.country || null,
        totalBookings: customer._count.bookings,
        totalSpent,
        createdAt: customer.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedCustomers.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      customers: formattedCustomers,
    });
  } catch (error) {
    console.error("Admin customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load customers",
    });
  }
};

/* =========================================================
   ADMIN — BOOKINGS
========================================================= */

export const getAdminBookings = async (req, res) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100,
    );
    const skip = (page - 1) * limit;

    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "")
      .trim()
      .toUpperCase();

    const where = {
      ...(status && status !== "ALL" && { status }),
      ...(search && {
        OR: [
          { bookingId: { contains: search, mode: "insensitive" } },
          { senderName: { contains: search, mode: "insensitive" } },
          { receiverName: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [totalCount, bookings] = await Promise.all([
      prisma.booking.count({ where }),

      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: { email: true },
          },
          payment: {
            select: { status: true, amount: true },
          },
          shipment: {
            select: { trackingNumber: true, status: true },
          },
        },
      }),
    ]);

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      bookingId: booking.bookingId,
      customerEmail: booking.user?.email || null,
      senderName: booking.senderName,
      receiverName: booking.receiverName,
      pickup: booking.pickup,
      destination: booking.destination,
      packageType: booking.packageType,
      weight: booking.weight,
      service: booking.service,
      estimatedCost: booking.estimatedCost,
      status: booking.status,
      paymentStatus: booking.payment?.status || null,
      trackingNumber: booking.shipment?.trackingNumber || null,
      createdAt: booking.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: formattedBookings.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("Admin bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load bookings",
    });
  }
};

/* =========================================================
   ADMIN — PAYMENTS
========================================================= */

export const getAdminPayments = async (req, res) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100,
    );
    const skip = (page - 1) * limit;

    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "")
      .trim()
      .toUpperCase();

    const where = {
      ...(status && status !== "ALL" && { status }),
      ...(search && {
        OR: [
          { transactionId: { contains: search, mode: "insensitive" } },
          { booking: { bookingId: { contains: search, mode: "insensitive" } } },
          {
            booking: { senderName: { contains: search, mode: "insensitive" } },
          },
        ],
      }),
    };

    const [totalCount, payments] = await Promise.all([
      prisma.payment.count({ where }),

      prisma.payment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          booking: {
            select: {
              bookingId: true,
              senderName: true,
              receiverName: true,
              user: {
                select: { email: true },
              },
            },
          },
        },
      }),
    ]);

    const formattedPayments = payments.map((payment) => ({
      id: payment.id,
      bookingId: payment.booking?.bookingId || null,
      customerEmail: payment.booking?.user?.email || null,
      senderName: payment.booking?.senderName || null,
      receiverName: payment.booking?.receiverName || null,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: formattedPayments.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      payments: formattedPayments,
    });
  } catch (error) {
    console.error("Admin payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load payments",
    });
  }
};
/* =========================================================
   ADMIN — DASHBOARD OVERVIEW
========================================================= */

export const getAdminDashboard = async (req, res) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const [
      totalShipments,
      totalCustomers,
      booked,
      processing,
      inTransit,
      delivered,
      cancelled,
      paymentSum,
      paymentCount,
      bookingSum,
      recentShipments,
    ] = await Promise.all([
      prisma.shipment.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.shipment.count({ where: { status: "BOOKED" } }),
      prisma.shipment.count({ where: { status: "PROCESSING" } }),
      prisma.shipment.count({ where: { status: "IN_TRANSIT" } }),
      prisma.shipment.count({ where: { status: "DELIVERED" } }),
      prisma.shipment.count({ where: { status: "CANCELLED" } }),
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.payment.count(),
      prisma.booking.aggregate({
        _sum: { estimatedCost: true },
      }),
      prisma.shipment.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          booking: {
            select: { senderName: true },
          },
        },
      }),
    ]);

    const formattedRecent = recentShipments.map((shipment) => ({
      id: shipment.id,
      trackingNumber: shipment.trackingNumber,
      senderName: shipment.booking?.senderName || null,
      pickup: shipment.origin,
      destination: shipment.destination,
      status: shipment.status,
      progress: shipment.progress,
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalShipments,
        totalCustomers,
        booked,
        processing,
        inTransit,
        delivered,
        cancelled,
        totalPaymentValue: paymentSum._sum.amount || 0,
        paymentCount,
        totalBookingValue: bookingSum._sum.estimatedCost || 0,
      },
      recentShipments: formattedRecent,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};

/* =========================================================
   ADMIN — GET ALL SHIPMENTS
========================================================= */

export const getAdminShipments = async (req, res) => {
  try {
    /* -------------------------------------------------------
       ADMIN AUTHORIZATION
    ------------------------------------------------------- */

    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    /* -------------------------------------------------------
       GET SHIPMENTS
    ------------------------------------------------------- */

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100,
    );
    const skip = (page - 1) * limit;

    const [totalCount, shipments] = await Promise.all([
      prisma.shipment.count(),

      prisma.shipment.findMany({
        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: limit,

        include: {
          booking: {
            select: {
              id: true,
              bookingId: true,

              userId: true,

              senderName: true,
              senderPhone: true,
              senderEmail: true,

              receiverName: true,
              receiverPhone: true,

              pickup: true,
              destination: true,

              packageType: true,
              weight: true,

              pickupDate: true,
              service: true,

              paymentMethod: true,
              estimatedCost: true,

              status: true,
              createdAt: true,

              payment: {
                select: {
                  status: true,
                  amount: true,
                  method: true,
                  transactionId: true,
                },
              },
            },
          },

          trackingEvents: {
            orderBy: {
              eventDate: "asc",
            },
          },
        },
      }),
    ]);

    /* -------------------------------------------------------
       FORMAT FOR ADMIN FRONTEND
    ------------------------------------------------------- */

    const formattedShipments = shipments.map((shipment) => ({
      id: shipment.id,

      trackingNumber: shipment.trackingNumber,

      status: shipment.status,

      origin: shipment.origin,

      destination: shipment.destination,

      estimatedDelivery: shipment.estimatedDelivery,

      lastUpdate: shipment.lastUpdate,

      progress: shipment.progress,

      senderName: shipment.booking?.senderName || null,

      senderPhone: shipment.booking?.senderPhone || null,

      senderEmail: shipment.booking?.senderEmail || null,

      receiverName: shipment.booking?.receiverName || null,

      receiverPhone: shipment.booking?.receiverPhone || null,

      pickup: shipment.booking?.pickup || shipment.origin,

      packageType: shipment.booking?.packageType || null,

      weight: shipment.booking?.weight || 0,

      service: shipment.booking?.service || null,

      estimatedCost: shipment.booking?.estimatedCost || 0,

      paymentStatus: shipment.booking?.payment?.status || null,

      bookingId: shipment.booking?.bookingId || null,

      userId: shipment.booking?.userId || null,

      trackingEvents: shipment.trackingEvents || [],

      createdAt: shipment.createdAt,

      updatedAt: shipment.updatedAt,
    }));

    /* -------------------------------------------------------
       RESPONSE
    ------------------------------------------------------- */

    return res.status(200).json({
      success: true,
      count: formattedShipments.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      shipments: formattedShipments,
    });
  } catch (error) {
    console.error("Admin shipments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin shipments",
    });
  }
};

/* =========================================================
   ADMIN — GET SINGLE SHIPMENT
========================================================= */

export const getAdminShipment = async (req, res) => {
  try {
    /* -------------------------------------------------------
       ADMIN AUTHORIZATION
    ------------------------------------------------------- */

    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { trackingNumber } = req.params;

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        message: "Tracking number is required",
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
        booking: {
          include: {
            payment: true,
          },
        },

        trackingEvents: {
          orderBy: {
            eventDate: "asc",
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
    console.error("Admin shipment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load shipment",
    });
  }
};

/* =========================================================
   ADMIN — UPDATE SHIPMENT STATUS
========================================================= */

export const updateAdminShipmentStatus = async (req, res) => {
  try {
    /* -------------------------------------------------------
       ADMIN AUTHORIZATION
    ------------------------------------------------------- */

    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { trackingNumber } = req.params;

    const status = String(req.body.status || "")
      .trim()
      .toUpperCase();

    if (!trackingNumber || !status) {
      return res.status(400).json({
        success: false,
        message: "Tracking number and status are required",
      });
    }

    /* -------------------------------------------------------
       USE EXISTING SHIPMENT LIFECYCLE LOGIC
    ------------------------------------------------------- */

    const VALID_STATUSES = [
      "BOOKED",
      "PROCESSING",
      "IN_TRANSIT",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipment status",
      });
    }

    const shipment = await prisma.shipment.findUnique({
      where: {
        trackingNumber,
      },
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const STATUS_ORDER = ["BOOKED", "PROCESSING", "IN_TRANSIT", "DELIVERED"];

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

    /* -------------------------------------------------------
       PREVENT INVALID TRANSITIONS
    ------------------------------------------------------- */

    if (shipment.status === "DELIVERED") {
      return res.status(409).json({
        success: false,
        message: "Delivered shipments cannot move backwards",
      });
    }

    if (shipment.status === "CANCELLED") {
      return res.status(409).json({
        success: false,
        message: "Cancelled shipments cannot be updated",
      });
    }

    if (shipment.status !== status && status !== "CANCELLED") {
      const currentIndex = STATUS_ORDER.indexOf(shipment.status);
      const nextIndex = STATUS_ORDER.indexOf(status);

      if (currentIndex === -1 || nextIndex === -1 || nextIndex < currentIndex) {
        return res.status(409).json({
          success: false,
          message: `Shipment cannot move from ${shipment.status} to ${status}`,
        });
      }
    }

    /* -------------------------------------------------------
       NO CHANGE
    ------------------------------------------------------- */

    if (shipment.status === status) {
      return res.status(200).json({
        success: true,
        message: "Shipment is already at this status",
        shipment,
      });
    }

    const now = new Date();

    /* -------------------------------------------------------
       TRANSACTION
    ------------------------------------------------------- */

    const updatedShipment = await prisma.$transaction(async (transaction) => {
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

      /* ---------------------------------------------------
           UPDATE BOOKING STATUS
        --------------------------------------------------- */

      await transaction.booking.update({
        where: {
          id: shipment.bookingId,
        },

        data: {
          status,
        },
      });

      /* ---------------------------------------------------
           COMPLETE TRACKING EVENTS
        --------------------------------------------------- */

      if (status !== "CANCELLED") {
        const currentIndex = STATUS_ORDER.indexOf(status);

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

        await transaction.trackingEvent.updateMany({
          where: {
            shipmentId: shipment.id,
            title: STATUS_EVENT_TITLES[status],
          },

          data: {
            completed: true,
            eventDate: now,
          },
        });
      }

      /* ---------------------------------------------------
           CANCELLED EVENT
        --------------------------------------------------- */

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

      /* ---------------------------------------------------
           RETURN UPDATED SHIPMENT
        --------------------------------------------------- */

      return transaction.shipment.findUnique({
        where: {
          trackingNumber,
        },

        include: {
          booking: true,

          trackingEvents: {
            orderBy: {
              eventDate: "asc",
            },
          },
        },
      });
    });

    if (updatedShipment?.booking) {
      const label = STATUS_EVENT_TITLES[status] || status;

      await notifyUser(
        updatedShipment.booking.userId,
        "Shipment Update",
        `Your shipment ${trackingNumber} status changed to ${label}.`,
        { link: "/history" },
      );
    }

    return res.status(200).json({
      success: true,
      message: `Shipment status updated to ${status}`,
      shipment: updatedShipment,
    });
  } catch (error) {
    console.error("Admin update shipment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update shipment status",
    });
  }
};

import prisma from "../config/prisma.js";

const generateBookingId = () => {
  return `LT-${Date.now().toString().slice(-8)}`;
};

const generateTrackingNumber = () => {
  const random = Math.floor(100000000 + Math.random() * 900000000);
  return `LT${random}`;
};

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

    // Validate required fields
    if (
      !senderName ||
      !receiverName ||
      !pickup ||
      !destination ||
      !packageType ||
      !weight ||
      !service ||
      !paymentMethod ||
      estimatedCost === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required booking information",
      });
    }

    const bookingId = generateBookingId();
    const trackingNumber = generateTrackingNumber();
    const estimatedDelivery = calculateEstimatedDelivery(pickupDate, service);

    const booking = await prisma.booking.create({
      data: {
        bookingId,
        userId: req.user.id,

        senderName,
        senderPhone,
        senderEmail,

        receiverName,
        receiverPhone,

        pickup,
        destination,

        packageType,
        weight: Number(weight),
        pickupDate: pickupDate ? new Date(pickupDate) : null,
        service,
        paymentMethod,
        estimatedCost: Number(estimatedCost),

        shipment: {
          create: {
            trackingNumber,
            origin: pickup,
            destination,
            status: "BOOKED",
            progress: 0,
            estimatedDelivery,
            trackingEvents: {
              create: [
                {
                  title: "Booking Confirmed",
                  location: pickup,
                  description: "Your shipment booking has been confirmed.",
                  eventDate: new Date(),
                  completed: true,
                },
                {
                  title: "Shipment Processing",
                  location: pickup,
                  description: "Your shipment is being prepared for dispatch.",
                  eventDate: new Date(),
                  completed: false,
                },
                {
                  title: "In Transit",
                  location: destination,
                  description:
                    "Your shipment will move toward its destination.",
                  eventDate: new Date(),
                  completed: false,
                },
                {
                  title: "Delivered",
                  location: destination,
                  description: "Shipment delivered successfully.",
                  eventDate: new Date(),
                  completed: false,
                },
              ],
            },
          },
        },

        payment: {
          create: {
            amount: Number(estimatedCost),
            method: paymentMethod,
            status: paymentMethod === "PAY_ON_DELIVERY" ? "PENDING" : "PENDING",
          },
        },
      },

      include: {
        shipment: {
          include: {
            trackingEvents: true,
          },
        },
        payment: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating your booking",
    });
  }
};
export const trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

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
        booking: true,
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

export const updateShipmentStatus = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { status } = req.body;

    const progressMap = {
      BOOKED: 0,
      PROCESSING: 33,
      IN_TRANSIT: 66,
      DELIVERED: 100,
      CANCELLED: 0,
    };

    const eventMap = {
      BOOKED: "Booking Confirmed",
      PROCESSING: "Shipment Processing",
      IN_TRANSIT: "In Transit",
      DELIVERED: "Delivered",
    };

    if (!trackingNumber || !status) {
      return res.status(400).json({
        success: false,
        message: "Tracking number and status are required",
      });
    }

    if (!(status in progressMap)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipment status",
      });
    }

    const shipment = await prisma.shipment.findUnique({
      where: {
        trackingNumber,
      },
      include: {
        trackingEvents: true,
      },
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const updatedShipment = await prisma.shipment.update({
      where: {
        trackingNumber,
      },
      data: {
        status,
        progress: progressMap[status],
        lastUpdate: new Date().toISOString(),
      },
    });

    await prisma.booking.update({
      where: {
        id: shipment.bookingId,
      },
      data: {
        status,
      },
    });

    const statusOrder = ["BOOKED", "PROCESSING", "IN_TRANSIT", "DELIVERED"];

    const currentIndex = statusOrder.indexOf(status);

    // Mark every stage up to the current stage as completed
    for (let i = 0; i <= currentIndex; i++) {
      const eventTitle = eventMap[statusOrder[i]];

      await prisma.trackingEvent.updateMany({
        where: {
          shipmentId: shipment.id,
          title: eventTitle,
        },
        data: {
          completed: true,
        },
      });
    }

    // Update the current event timestamp
    const currentEventTitle = eventMap[status];

    if (currentEventTitle) {
      await prisma.trackingEvent.updateMany({
        where: {
          shipmentId: shipment.id,
          title: currentEventTitle,
        },
        data: {
          completed: true,
          eventDate: new Date(),
        },
      });
    }

    const finalShipment = await prisma.shipment.findUnique({
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
      message: `Shipment status updated to ${status}`,
      shipment: finalShipment,
    });
  } catch (error) {
    console.error("Update shipment status error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while updating shipment status",
    });
  }
};

export const getBookingHistory = async (req, res) => {
  try {
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

export const getDashboardData = async (req, res) => {
  try {
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
      progress: booking.shipment?.progress || 0,
    }));

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

    return res.json({
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

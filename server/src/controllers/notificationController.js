import prisma from "../config/prisma.js";

/* =========================================================
   GET MY NOTIFICATIONS
   Works identically for customers and admins — always
   scoped to the logged-in user via req.user.id.
========================================================= */

export const getMyNotifications = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100,
    );

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, read: false },
    });

    return res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load notifications",
    });
  }
};

/* =========================================================
   MARK ONE AS READ
========================================================= */

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return res.status(200).json({
      success: true,
      notification: updated,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

/* =========================================================
   MARK ALL AS READ
========================================================= */

export const markAllNotificationsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
};

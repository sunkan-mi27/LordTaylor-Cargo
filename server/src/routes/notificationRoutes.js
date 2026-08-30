import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMyNotifications);

router.patch("/read-all", markAllNotificationsRead);

router.patch("/:id/read", markNotificationRead);

export default router;

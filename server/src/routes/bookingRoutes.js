import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createBooking,
  trackShipment,
  updateShipmentStatus,
  getBookingHistory,
  getDashboardData,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/history", authMiddleware, getBookingHistory);
router.get("/track/:trackingNumber", trackShipment);
router.get("/dashboard", authMiddleware, getDashboardData);

export default router;

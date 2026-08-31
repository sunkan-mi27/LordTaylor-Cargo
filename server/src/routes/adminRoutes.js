import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  getAdminDashboard,
  getAdminShipments,
  getAdminShipment,
  updateAdminShipmentStatus,
  getAdminCustomers,
  deleteCustomer,
  getAdminBookings,
  getAdminPayments,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", getAdminDashboard);

/* =========================
   SHIPMENTS
========================= */

router.get("/shipments", getAdminShipments);

router.get("/shipments/:trackingNumber", getAdminShipment);

router.patch("/shipments/:trackingNumber/status", updateAdminShipmentStatus);

/* =========================
   CUSTOMERS
========================= */

router.get("/customers", getAdminCustomers);

router.delete("/customers/:id", deleteCustomer);

/* =========================
   BOOKINGS
========================= */

router.get("/bookings", getAdminBookings);

/* =========================
   PAYMENTS
========================= */

router.get("/payments", getAdminPayments);

export default router;

import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  initiatePayment,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/initiate", initiatePayment);

router.get("/verify", verifyPayment);

export default router;

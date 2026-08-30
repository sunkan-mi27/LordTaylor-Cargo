import express from "express";

import {
  getMySettings,
  updateMySettings,
} from "../controllers/settingsController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMySettings);

router.put("/me", authMiddleware, updateMySettings);

export default router;

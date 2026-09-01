import express from "express";
import {
  register,
  login,
  registerAdmin,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin-register", registerAdmin);

router.get("/me", authMiddleware, getCurrentUser);

export default router;

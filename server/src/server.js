import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import { handleWebhook } from "./controllers/paymentController.js";

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================================
   PROCESS-LEVEL SAFETY NETS
   Without these, one unexpected error anywhere in the app
   can silently kill the whole server for every user.
========================================================= */

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Exit deliberately so a process manager (pm2, systemd, Docker) restarts
  // the process cleanly, instead of continuing in a possibly broken state.
  process.exit(1);
});

/* =========================================================
   SECURITY & PERFORMANCE MIDDLEWARE
========================================================= */

app.use(helmet());
app.use(compression());

/* =========================================================
   PAYMENT WEBHOOK — RAW BODY, MOUNTED BEFORE express.json()
   Flutterwave's signature verification needs the exact raw
   request bytes. This must be defined here, before the
   global JSON parser below, or the signature check breaks.
   It fully handles the request and never calls next(), so
   it's safe to sit ahead of everything else.
========================================================= */

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook,
);

app.use(express.json());

const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:5173,http://localhost:5174,http://localhost:5175"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (curl, Postman) with no origin
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

/* =========================================================
   RATE LIMITING
   General limiter on all API routes, plus a much stricter
   one on auth routes to block brute-force / credential
   stuffing attempts.
========================================================= */

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again later.",
  },
});

app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);

/* =========================================================
   ROUTES
========================================================= */

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "LordTaylor Cargo API is running",
  });
});

app.use("/api/profile", profileRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

/* =========================================================
   404 HANDLER
   Ensures unknown routes return JSON, not an HTML page
   (this is what was breaking the dashboard earlier).
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================================================
   CENTRALIZED ERROR HANDLER
   Must be defined LAST. Catches anything that falls through
   (including async errors, which Express 5 forwards here
   automatically) so a single bad request can never crash
   the whole server.
========================================================= */

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong. Please try again.",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 LordTaylor Cargo API running on port ${PORT}`);
});

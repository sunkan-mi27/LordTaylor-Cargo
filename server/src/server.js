import "dotenv/config";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "LordTaylor Cargo API is running",
  });
});
app.use("/api/profile", profileRoutes);
app.use("/api/bookings", bookingRoutes);
app.listen(PORT, () => {
  console.log(`🚀 LordTaylor Cargo API running on port ${PORT}`);
});

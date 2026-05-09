import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || "4000", 10),

  // Database
  mongoUri:
    process.env.MONGO_URI || "mongodb://localhost:27017/turf_rental",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "dev-secret-key",



  // CORS
  corsOrigins: [
    ...new Set([
      // Always allow the production frontend
      "https://turfgear-turf.vercel.app",
      // Parse additional origins from env (defaults to localhost for dev)
      ...(process.env.CORS_ORIGINS || "http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ]),
  ],
  
  sessionTimeout: 5 * 60 * 1000, // 5 minutes in ms

  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
  },
};
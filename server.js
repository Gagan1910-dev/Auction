import dotenv from "dotenv";
import cloudinary from "cloudinary";
import express from "express";
import app from "./app.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// ✅ Load environment variables and log JWT key
dotenv.config({ path: "./config/config.env" });

if (!process.env.JWT_SECRET_KEY) {
  console.error("❌ JWT_SECRET_KEY is missing in environment variables.");
  process.exit(1); // Exit to prevent server from running without config
} else {
  console.log("✅ JWT_SECRET_KEY loaded successfully.");
}

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Use CORS Middleware **before** routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Set frontend URL in .env
    credentials: true, // Allow cookies in CORS requests
  })
);

// ✅ Use cookie-parser for handling cookies
app.use(cookieParser());

// ✅ JSON and URL Encoded Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Define routes **before** starting server
app.get("/", (req, res) => {
  res.send("Auction Platform API is Running...");
});

// ✅ Start the server after everything is set up
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});

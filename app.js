import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";


const app = express(); 

// ✅ Load environment variables
config({ path: "./config/config.env" });

// ✅ Log FRONTEND_URL to confirm it's set
console.log("✅ Frontend URL:", process.env.FRONTEND_URL || "Not Defined");

// ✅ Improved CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ CORS Error - Blocked Origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Parse JSON and URL-encoded data
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ File Upload Settings
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    abortOnLimit: true,
  })
);

// ✅ Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`➡️ [${req.method}] ${req.url}`);
  console.log("🔎 Headers:", req.headers);
  console.log("📦 Body:", req.body);
  next();
});

// ✅ Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);

// ✅ Start background cron jobs
endedAuctionCron();
verifyCommissionCron();

// ✅ Error Handling Middleware
app.use(errorMiddleware);

// ✅ Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

// ✅ Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1);
});

// ✅ Start Database Connection
connection();

export default app;

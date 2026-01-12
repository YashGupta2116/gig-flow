import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";

// router
import authRouter from "./routes/authRoutes";
import gigRouter from "./routes/gigRoutes";
import bidRouter from "./routes/bidRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/gigs", gigRouter);
app.use("/api/bids", bidRouter);

app.listen(PORT, async () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});

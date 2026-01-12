import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
// router
import authRouter from "./routes/authRoutes.js";
import gigRouter from "./routes/gigRoutes.js";
import bidRouter from "./routes/bidRoutes.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("user connected :", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

app.set("io", io);

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/gigs", gigRouter);
app.use("/api/bids", bidRouter);

server.listen(PORT, async () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import meetingRoutes from "./routes/meetings.js";
import documentRoutes from "./routes/documents.js";
import paymentRoutes from "./routes/paymentRoutes.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// --- Socket.IO: simple WebRTC signaling ---
io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("signal", ({ roomId, data }) => {
    socket.to(roomId).emit("signal", { id: socket.id, data });
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", socket.id);
  });

  socket.on("disconnect", () => console.log("socket disconnected:", socket.id));
});

// --- Express ---
app.use(cors());
app.use(express.json({ limit: "10mb" })); // for base64 signatures, etc.

app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/payment", paymentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
    server.listen(process.env.PORT || 5000, () =>
      console.log("Server on", process.env.PORT || 5000)
    );
  })
  .catch(console.error);

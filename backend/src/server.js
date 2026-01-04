import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/auth.route.js"; 
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messages.route.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// production static
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ✅ Create HTTP server for Socket.IO
const server = http.createServer(app);

// ✅ Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

// ✅ Socket events
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // Example: listen for a custom event
  socket.on("message", (msg) => {
    console.log("Message received:", msg);
    io.emit("message", msg); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  connectDB();
});

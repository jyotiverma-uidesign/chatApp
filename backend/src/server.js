import express from "express";
import dotenv from "dotenv";
import Path from "path";
import authRoutes from "./routes/auth.route.js"; // your auth routes
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();

// Routes
app.use("/api/auth", authRoutes);

// Optional: test route
app.get("/", (req, res) => {
  res.send("API is running");
});

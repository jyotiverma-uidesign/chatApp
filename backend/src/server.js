import express from "express";
import dotenv from "dotenv";
import authRoutes from "../src/routes/auth.route.js";
import messagesRoutes from "../src/routes/messages.route.js";
import Path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = Path.resolve();

app.use(express.json()); // ✅ good practice

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(Path.join(__dirname, "../frontend/dist")));

  // ✅ FIXED catch-all route
  app.use((req, res) => {
    res.sendFile(Path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});

import express from "express";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllContacts,
  getMessageByUserId,
  sendMessage,
  getChatPatners
} from "../controllers/message.controller.js";

const router = express.Router();
router.use(arcjetProtection,protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPatners);

// get messages with a specific user
router.get("/:id", getMessageByUserId);

// send message to user
router.post("/send/:id",sendMessage);

export default router;

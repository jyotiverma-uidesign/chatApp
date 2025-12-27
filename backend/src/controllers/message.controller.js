import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";


// ✅ get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("error in getAllContacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ get messages by user id
export const getMessageByUserId = async (req, res) => {
  try {
    const myId = req.user._id.toString();
    const otherUserId = req.params.id;

    // Debug only
    console.log("myId:", myId);
    console.log("otherUserId:", otherUserId);

    // Fetch only messages between these two users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    // Optional: debug what was found
    console.log("Filtered Messages:", messages);

    res.status(200).json(messages);
  } catch (error) {
    console.log("GET MESSAGE ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





// ✅ send message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params; // ✅ FIXED NAME
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId, // ✅ MATCHES SCHEMA
      text,
      image: imageUrl
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getChatPatners = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    const partnerIds = new Set();

    messages.forEach(msg => {
      if (msg.senderId.toString() !== userId.toString()) {
        partnerIds.add(msg.senderId.toString());
      }
      if (msg.receiverId.toString() !== userId.toString()) {
        partnerIds.add(msg.receiverId.toString());
      }
    });

    const partners = await User.find({
      _id: { $in: Array.from(partnerIds) }
    }).select("-password");

    res.status(200).json(partners);
  } catch (error) {
    console.log("error in getChatPatners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

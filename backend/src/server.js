//const express = require("express");
import express from "express";
import dotenv from "dotenv";
import authRoutes from "../src/routes/auth.route.js";
import messagesRoutes from "../src/routes/messages.route.js";

dotenv.config();

const app=express();
const PORT=process.env.PORT || 3000;

app.use("/api/auth",authRoutes);
app.use("/api/messages",messagesRoutes);
app.listen(PORT,()=>{
    console.log("Server is running on port:"+PORT);
});
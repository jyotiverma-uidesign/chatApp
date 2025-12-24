import mongoose from "mongoose";
import { ENV } from "./env";
export const connectDB = async ()=>{
  try{
    const {MONGO_URI}=ENV;
    if(!MONGO_URI) throw new Error("mongo uri is not defined");
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log("mongoDB connected",conn.connection.host);
  }
  catch(error){
    console.error("eror connecting to mongoDB",error)
    process.exit(1);
  }
  }

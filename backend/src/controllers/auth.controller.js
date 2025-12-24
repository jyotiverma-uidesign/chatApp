import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { genrateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    console.log(req.body); // Debug: check what frontend is sending

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(password), salt); // ✅ fix

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      genrateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilepic: newUser.profilepic,
      });
      try{
        await sendWelcomeEmail(savedUser.email,savedUser.fullname,ENV.CLIENT_URL)
      }
      catch(error){
        console.error("Error sending welcome email:", error);
      
    }

  } 
    else{
      res.status(400).json({ message: "Invalid user data" });
  }}
  catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" }); // fixed typo
  }
};

export const login = async (req,res)=>{
  const {email,password}=req.body
  try{
    const user = await User.findOne({email})
    if(!user) return res.status(400).json({message:"Invalid Credentials"})
  
    const isPasswordCorrect=await bcrypt.compare(password,user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message:"invalide credentials"});

    const ispasswordCorrect = await bcrypt.compare(password,user.password);
    if(!ispasswordCorrect) return res.status(400).json({message:"Invalid Credentials"});
    genrateToken(user._id,res);
    res.status(200).json({
      _id:user._id,
      fullname:user.fullname,
      email:user.email,
      profilepic:user.profilepic,
    });
  }
  catch(error){
    console.error("Error during login:",error);
    res.status(500).json({message:"Internal server error"});
  }
}
export const logout = (_, res)=>{
  res.cookie("jwt","",{maxAge:0});
  res.status(200).json({message:"logged out successfully"});

}


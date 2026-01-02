import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,


  isCheckingAuth: true,
  isSigningUp:false,
  isLoggingIn:false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      // 401 is normal when user is not logged in
      console.log("error in authcheck", error.response?.status);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup:async(data)=>{
    set({isSigningUp:true})
  
  try{
    const res=await axiosInstance.post("/auth/signup",data);
    set({authUser:res.data});
    toast.success("account created sucesssully")
  }

    catch(error){
      toast.error(error.response.data.message)

    }
    finally{
      set({isSigningUp:false})
    }
  },
  Login:async(data)=>{
    set({isLoggingIn:true});
    try{
      const res = await axiosInstance.post("/auth/login",data);
      set({authUser:res.data});
      toast.error(error.response.data.message);
    }finally{
      set({isLoggingIn:false});
    }
  },
}));


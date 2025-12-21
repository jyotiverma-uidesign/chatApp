import mongoos from "mongoose"
export const connectDB=async()=>{
try{
    await mongoos.connect(process.env.MONGO_URI)
     console.log("MONGOOS CONNECTED")

}catch(error){
    console.error("error connection is mongoDB:",error)
    process.exit(1);
};
}

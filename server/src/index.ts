import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/userRoutes";

const app = express();
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use("/",router)

// DATABASE CONNECTION AND INITIATING THE SERVER :

mongoose.connect("mongodb://localhost:27017/blog").then(() => {
  app.listen(process.env.PORT,()=>{
    console.log(`Database connected and server is running on port ${process.env.PORT}`)
  });
});
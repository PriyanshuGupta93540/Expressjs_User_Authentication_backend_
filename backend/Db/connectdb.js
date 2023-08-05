import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Dbconnection = process.env.URI;

const connectDB = async (req, resp) => {
  try {
    await mongoose.connect(Dbconnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongodb");
  } catch (error) {
    console.log("Error connecting to Mongodb:", error);
  }
};

export default connectDB;

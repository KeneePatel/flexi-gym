import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME = "FlexiGym";
const DB_URI = `${process.env.MONGODB_URI}/${DB_NAME}`;

const connectDB = async () => {
  await MongoClient.connect(DB_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    });
};

export default connectDB;

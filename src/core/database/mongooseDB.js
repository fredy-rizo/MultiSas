import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URI = process.env.MONGODB_URL;
mongoose.set("strictQuery", true);

export const MongooseDB = () => {
  mongoose
    .connect(DB_URI, {})
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("Error connecting to DB → ", err));
};

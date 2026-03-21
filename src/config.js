import { config } from "dotenv";
config();
export default {
  PORT: process.env.PORT || "",
  SECRET: process.env.SECRET || "contra, token",
  MONGODB_URL: process.env.MONGODB_URL || "",
};

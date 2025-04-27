import mongoose from "mongoose";
import { Config } from "../config.js";

export default async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${Config.mongodbUri}/${Config.dbname}`
    );
    console.log(
      `Mongodb is connected! Your database is hosted at ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongodb connection FAILED.", error);
    process.exit(1);
  }
}

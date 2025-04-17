import mongoose from "mongoose";
import { MONGODB_CONNECTION_STRING } from "../config.js";

export default async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_CONNECTION_STRING);
    console.log(`Mongodb is connected! Your database is hosted at ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log("Mongodb connection FAILED.", error)
    process.exit(1)
  }
}

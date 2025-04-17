import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT
export const MONGODB_CONNECTION_STRING = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
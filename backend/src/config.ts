import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// input validation for env variables 
const envSchema = z.object({
  PORT: z.string(),
  MONGODB_URI: z.string().min(1, "MongoDB uri not found."),
  DB_NAME: z.string().min(1, "DB_NAME must be set"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET must be set. "),
});

const env = envSchema.parse(process.env);

export const Config = {
  port: env.PORT,
  mongodbUri: env.MONGODB_URI,
  dbname: env.DB_NAME,
  jwtSecret: env.JWT_SECRET,
};

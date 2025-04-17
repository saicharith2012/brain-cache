import express from "express";
import cors from "cors";
import contentRouter from "./routes/content.routes.js";
import userRouter from "./routes/user.routes.js";
import cacheRouter from "./routes/cache.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/cache", cacheRouter);

export default app;

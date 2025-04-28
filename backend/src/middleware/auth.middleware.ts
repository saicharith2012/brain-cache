import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Config } from "../config.js";

const authenticateUser: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({
      message: "Invalid token.",
    });
  }

  const token = authHeader?.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token as string, Config.jwtSecret);

    req.userId = (decodedToken as JwtPayload).userId;

    next();
  } catch (error) {
    res.status(403).json({
      message: "You are logged in.",
    });
  }
};

export { authenticateUser };

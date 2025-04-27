import { RequestHandler } from "express";
import { z } from "zod";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Config } from "../config.js";

const signupUser: RequestHandler = async (req, res) => {
  // input validation
  try {
    const signupBodySchema = z.object({
      email: z.string().email(),
      username: z.string().min(3).max(10),
      password: z
        .string()
        .min(8)
        .max(20)
        .regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/), {
          message:
            "Password must contain at least one uppercase, one lowercase, one special character, and one number",
        }),
    });

    const parseWithSuccess = signupBodySchema.safeParse(req.body);

    if (!parseWithSuccess.success) {
      res.status(411).json({
        message: `Error in inputs: ${parseWithSuccess.error.issues[0].message}`,
      });
      return;
    }

    // check if the user exists
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      res.status(403).json({
        message: "User already exists",
      });
      return;
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 5);

    // create the user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    if (!user) {
      res.status(500).json({
        message: "Something went wrong while signing up.",
      });
    }

    // return the response
    res.status(200).json({
      message: "Signed up.",
    });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${
        error instanceof Error ? error.message : "Internal Server Error."
      }`,
    });
  }
};

const signinUser: RequestHandler = async (req, res) => {
  // check if the user exists
  // check the password
  // create jwt token
  // send the response
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      res.status(403).json({
        message: "User not found.",
      });
      return;
    }

    const hashedPassword = existingUser.password;

    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordCorrect) {
      res.status(403).json({
        message: "Incorrect email or password.",
      });
      return;
    }

    const jwt_secret: string = Config.jwtSecret;

    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      jwt_secret
    );

    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${
        error instanceof Error ? error.message : "Internal Server Error."
      }`,
    });
  }
};

export { signupUser, signinUser };

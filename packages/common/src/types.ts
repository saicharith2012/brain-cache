import { z } from "zod";
import { ContentType } from "@repo/db/client";

// auth schemas
export const signUpSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  username: z
    .string()
    .min(1, "Username is required")
    .max(20)
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be atleast 8 characters long.")
    .max(50)
    .regex(new RegExp(/.*[A-Z].*/), "Password must contain atleast one uppercase letter")
    .regex(new RegExp(/.*[a-z].*/), "Password must contain atleast one lowercase letter")
    .regex(new RegExp(/.*[0-9].*/), "Password must contain atleast one number")
    .regex(
      new RegExp(/.*[^A-Za-z0-9].*/),
      "Password must contain atleast one special character"
    ),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  username: z.string().min(1, "Username is required").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const envSchema = z.object({});

export const addContentSchema = z.object({
  link: z.string().min(1, "Link is required"),
  type: z.nativeEnum(ContentType),
  title: z.string().min(1, "Title is required"),
  tags: z.array(z.string()).optional(),
});

export type AddContentSchema = z.infer<typeof addContentSchema>;

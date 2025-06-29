import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("invalid email").toLowerCase().trim(),
  username: z.string().min(1, "username is required").max(20).toLowerCase().trim(),
  password: z
    .string()
    .min(8, "password must be atleast 8 characters long.")
    .max(20)
    .regex(new RegExp(/.*[A-Z].*/), "must contain atleast one uppercase letter")
    .regex(new RegExp(/.*[a-z].*/), "must contain atleast one lowercase letter")
    .regex(new RegExp(/.*[0-9].*/), "must contain atleast one number")
    .regex(
      new RegExp(/.*[^A-Za-z0-9].*/),
      "must contain atleast one special character"
    ),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  username: z.string().min(1, "username is required").toLowerCase().trim(),
  password: z.string().min(1, "password is required"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const envSchema = z.object({});

import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  username: z.string().min(3).max(10).toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be atleast 8 characters long.")
    .max(20)
    .regex(new RegExp(/.*[A-Z].*/), "Must contain atleast one uppercase letter")
    .regex(new RegExp(/.*[a-z].*/), "Must contain atleast one lowercase letter")
    .regex(new RegExp(/.*[0-9].*/), "Must contain atleast one number")
    .regex(
      new RegExp(/.*[^A-Za-z0-9].*/),
      "Must contain atleast one special character"
    ),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  username: z.string().min(3).toLowerCase().trim(),
  password: z.string(),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const envSchema = z.object({});

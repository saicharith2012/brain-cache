import { signUpSchema } from "@repo/common/config";
import { z } from "zod";

export const signUpFormSchema = signUpSchema
  .extend({
    confirmPassword: z.string().min(1, "confirm you password"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "passwords don't match",
      });
    }
  });

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export const nextAuthSecret = process.env.NEXTAUTH_SECRET
export const googleId = process.env.GOOGLE_ID
export const googleSecret = process.env.GOOGLE_SECRET
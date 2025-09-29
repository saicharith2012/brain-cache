import { signUpSchema } from "@repo/common/config";
import { z } from "zod";

export const signUpFormSchema = signUpSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords don't match",
      });
    }
  });

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export const nextAuthSecret = process.env.NEXTAUTH_SECRET
export const googleId = process.env.GOOGLE_ID
export const googleSecret = process.env.GOOGLE_SECRET
export const awsS3BucketName = process.env.AWS_S3_BUCKET_NAME
export const awsRegion = process.env.AWS_REGION
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
export const qdrantCollectionName = process.env.QDRANT_COLLECTION_NAME
export const googleGenaiApiKey = process.env.GOOGLE_API_KEY
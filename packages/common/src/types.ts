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
    .regex(
      new RegExp(/.*[A-Z].*/),
      "Password must contain atleast one uppercase letter"
    )
    .regex(
      new RegExp(/.*[a-z].*/),
      "Password must contain atleast one lowercase letter"
    )
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

// add content schema
export const addContentBaseSchema = z.object({
  type: z.nativeEnum(ContentType, {
    errorMap: () => ({ message: "Invalid content type" }),
  }),
  tags: z.array(z.string()).min(1, "Adding atleast one tag would be helpful")
});

const youtubeSchema = addContentBaseSchema.extend({
  type: z.literal(ContentType.youtube),
  title: z.string().min(1, "Title is required"),
  link: z.string().url("Must be a valid video URL"),
});

export type YoutubeSchema = z.infer<typeof youtubeSchema>;

const tweetSchema = addContentBaseSchema.extend({
  type: z.literal(ContentType.tweet),
  title: z.string().min(1, "Title is required."),
  link: z
    .string()
    .url()
    .refine((val) => val.includes("x.com"), {
      message: "URL must be a tweet link",
    }),
});

export type TweetSchema = z.infer<typeof tweetSchema>;

const linkSchema = addContentBaseSchema.extend({
  type: z.literal(ContentType.link),
  title: z.string().min(1, "Title is required."),
  link: z.string().url("Web page link must be a valid URL."),
});

export type LinkSchema = z.infer<typeof linkSchema>;

const noteSchema = addContentBaseSchema.extend({
  type: z.literal(ContentType.note),
  content: z.string().min(1, "Enter something."),
});

export type NoteSchema = z.infer<typeof noteSchema>;

const documentSchema = addContentBaseSchema.extend({
  type: z.literal(ContentType.document),
  file: z
    .instanceof(File, {message: "Upload a document (pdf, doc or docx)"})
    .refine((file) => file.size < 5 * 1024 * 1024, "File must be < 5MB"),
});

export type DocumentSchema = z.infer<typeof documentSchema>;

export const contentSchema = z.discriminatedUnion("type", [
  youtubeSchema,
  tweetSchema,
  linkSchema,
  noteSchema,
  documentSchema,
]);

export type ContentFormData = z.infer<typeof contentSchema>;

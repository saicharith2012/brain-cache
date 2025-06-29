"use server";
import { signUpSchema, SignUpSchema } from "@repo/common/config";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";

export default async function signup(data: SignUpSchema) {
  // zod validation
  // check if the user already exists
  // hash the password
  // create user
  // send response

  try {
    const parsedData = signUpSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: `${parsedData.error.issues[0]?.message}` };
    }

    const { email, username, password } = parsedData.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if ((existingUser.email = email)) {
        return { error: "email already in use." };
      } else if ((existingUser.username = username)) {
        return { error: "username already taken." };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "you have signed up.",
    };
  } catch (error) {
    return {
      error: `${error instanceof Error ? error.message : "error while signing up"}`,
    };
  }
}

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@repo/db/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";

// extend the session and user types to include 'id'
import type { DefaultSession, DefaultUser, Session, User } from "next-auth";
import { JwtPayload } from "jsonwebtoken";
import { googleId, googleSecret, nextAuthSecret } from "../../../../config";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/signin",
  },
  secret: nextAuthSecret,
  providers: [
    CredentialsProvider({
      name: "Sign in with credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Provide the credentials");
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("User does not exist.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password!
        );

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      },
    }),
    GoogleProvider({
      clientId: googleId as string,
      clientSecret: googleSecret as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JwtPayload; user: User }) {
      if (user) {
        token.id = user.id;
      }

      // console.log(token);

      return token;
    },

    async session({ session, token }: { session: Session; token: JwtPayload }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }

      // console.log(session);

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

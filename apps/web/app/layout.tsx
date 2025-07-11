"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className="font-roboto text-sm tracking-[0.005em]">
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}

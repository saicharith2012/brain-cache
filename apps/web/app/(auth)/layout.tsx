"use client";
import { SessionProvider } from "next-auth/react";
import Logo from "../../components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="relative w-screen h-screen flex justify-center items-center">
        <Logo size="lg" className="absolute top-12"/>
        <div className="w-[400px] border border-gray-50 p-8 rounded-xl shadow">{children}</div>
      </div>
    </SessionProvider>
  );
}

"use client";
import { Button } from "@repo/ui/button";
import { redirect } from "next/navigation";
import Logo from "../components/Logo";
import { SessionProvider } from "next-auth/react";

export default function Page() {
  return (
    <SessionProvider>
      <span>brain-cache landing page</span>
      <Logo size="lg" />
      <Button
        text="Enter"
        variant="secondary"
        size="md"
        onClick={() => redirect("/signin")}
      />
    </SessionProvider>
  );
}

"use client";
import { Button } from "@repo/ui/button";
import { redirect } from "next/navigation";
import Logo from "../components/Logo";

export default function Page() {
  return (
    <div>
      <span>brain-cache landing page</span>
      <Logo size="lg" />
      <Button
        text="Enter"
        variant="secondary"
        size="md"
        onClick={() => redirect("/signin")}
      />
    </div>
  );
}

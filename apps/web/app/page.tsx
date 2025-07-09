"use client";
import { Button } from "@repo/ui/button";
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <div>
      <span>brain-cache landing page</span>
      <Button
        text="Enter"
        variant="secondary"
        size="md"
        onClick={() => redirect("/signin")}
      />
    </div>
  );
}

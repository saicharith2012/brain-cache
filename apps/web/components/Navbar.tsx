"use client";

import { Button } from "@repo/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function signOutUser() {
    await signOut();
    router.push("/signin");
  }

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-between py-1 px-4">
      <span>navbar</span>
      <Button
        text="Sign out"
        variant="primary"
        size="md"
        onClick={signOutUser}
      />
    </div>
  );
}

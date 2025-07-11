"use client";

import { Button } from "@repo/ui/button";
import PlusIcon from "@repo/ui/icons/PlusIcon";
import ShareIcon from "@repo/ui/icons/ShareIcon";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const session = useSession();

  function signOutUser() {
    startTransition(async () => {
      await signOut();
      router.push("/signin");
    });
  }

  return (
    <div className="fixed top-0 left-64 right-0 flex items-center justify-end gap-4 p-4 h-18">
      <Button
        text="Add content"
        variant="primary"
        size="md"
        startIcon={<PlusIcon size="xl" />}
        className="text-base"
      />
      <Button
        text="Share brain"
        variant="secondary"
        size="md"
        startIcon={<ShareIcon size="lg" />}
        className="text-base"
      />
      <Button
        text="Sign out"
        variant="primary"
        size="md"
        onClick={signOutUser}
        loading={isPending}
        className="text-base"
      />
      <div className="w-fit h-fit rounded-full overflow-hidden border-2 border-black">
        <Image
          src={session.data?.user.image || "/unknown-image.jpg"}
          alt="user profile"
          width={36}
          height={36}
        />
      </div>
    </div>
  );
}

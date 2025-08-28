"use client";

import { Button } from "@repo/ui/button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Logo from "./Logo";
import PlusIcon from "@repo/ui/icons/PlusIcon";
import { useAppStore } from "../lib/store/store";

export default function Navbar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const session = useSession();
  const { openModal } = useAppStore();

  function signOutUser() {
    startTransition(async () => {
      await signOut();
      router.push("/signin");
    });
  }

  return (
    <div className="fixed top-0 left-0 right-0 max-h-16 flex justify-between px-4 py-3 [&_button]:font-medium bg-white z-101 border-b-1 border-b-gray-100 shadow-inner box-border">
      <Logo size="md" />
      <div className="flex gap-4">
        <Button
          text="Add memory"
          variant="secondary"
          size="md"
          startIcon={<PlusIcon size="lg" />}
          onClick={openModal}
        />
        <Button
          text="Sign out"
          variant="primary"
          size="md"
          onClick={signOutUser}
          loading={isPending}
        />
        <div className="w-fit h-fit rounded-full overflow-hidden border-2 border-black ml-3 cursor-pointer">
          <Image
            src={session.data?.user.image || "/unknown-image.jpg"}
            alt="user profile"
            width={36}
            height={36}
          />
        </div>
      </div>
    </div>
  );
}

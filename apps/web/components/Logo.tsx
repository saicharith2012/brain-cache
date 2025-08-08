"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type LogoSize = "md" | "lg";

interface LogoProps {
  className?: string;
  size: LogoSize;
}

const LogoImageStyles: Record<LogoSize, { height: number; width: number }> = {
  md: { height: 32, width: 40 },
  lg: { height: 48, width: 60 },
};

const LogoHeadingStyles: Record<LogoSize, string> = {
  md: "text-2xl font-semibold",
  lg: "text-6xl font-extrabold",
};

export default function Logo({ className, size }: LogoProps) {
  const router = useRouter();
  const session = useSession();

  function handleClick() {
    if (session.status === "authenticated") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }

  return (
    <div
      className={`${className} flex items-center cursor-pointer`}
      onClick={handleClick}
    >
      <Image
        src="/braincache-logo.png"
        className={`mr-2 w-auto h-auto`}
        alt="logo image"
        width={LogoImageStyles[size].width}
        height={LogoImageStyles[size].height}
      />
      <h1 className={`${LogoHeadingStyles[size]}`}>Braincache.</h1>
    </div>
  );
}

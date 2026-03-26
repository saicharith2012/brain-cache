"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  className?: string;
  size: LogoSize;
  /** Hide the wordmark (collapsed sidebar). */
  markOnly?: boolean;
}

const sizes: Record<LogoSize, { mark: number; text: string }> = {
  sm: { mark: 22, text: "text-[17px]" },
  md: { mark: 28, text: "text-[22px]" },
  lg: { mark: 36, text: "text-[30px]" },
};

/** Three memories joined by filaments into a "b"; the recalled one glows. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M9 7v17M9 24c5 2.6 13.6 1.2 14-6.4.3-5.6-8.2-7.6-14-3.4"
        stroke="var(--ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".55"
      />
      <circle cx="9" cy="7" r="3.4" fill="var(--ink)" />
      <circle cx="9" cy="24" r="3.4" fill="var(--ink)" />
      <circle cx="23" cy="17.6" r="6.5" fill="var(--recall)" opacity=".22" />
      <circle cx="23" cy="17.6" r="4.2" fill="var(--recall)" />
    </svg>
  );
}

export default function Logo({ className = "", size, markOnly }: LogoProps) {
  const session = useSession();
  const href = session.status === "authenticated" ? "/dashboard" : "/";

  return (
    <Link
      href={href}
      aria-label="Braincache home"
      className={`inline-flex items-center gap-2 rounded-[8px] text-ink ${className}`}
    >
      <LogoMark size={sizes[size].mark} />
      {!markOnly && (
        <span
          className={`font-display font-semibold tracking-[-0.01em] leading-none ${sizes[size].text}`}
        >
          Braincache
        </span>
      )}
    </Link>
  );
}

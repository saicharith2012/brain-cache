"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Use light theme" : "Use dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={withLabel ? undefined : label}
      title={label}
      className={`inline-flex items-center gap-3 h-10 rounded-[10px] text-dim hover:text-ink hover:bg-ink/[0.06] cursor-pointer ${withLabel ? "w-full px-3" : "w-10 justify-center"}`}
    >
      {isDark ? (
        <SunIcon className="size-[18px] shrink-0" strokeWidth={1.75} />
      ) : (
        <MoonIcon className="size-[18px] shrink-0" strokeWidth={1.75} />
      )}
      {withLabel && <span className="whitespace-nowrap">{isDark ? "Light theme" : "Dark theme"}</span>}
    </button>
  );
}

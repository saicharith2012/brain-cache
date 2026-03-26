"use client";
import { useMemo, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { LogOutIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, XIcon, LayersIcon } from "lucide-react";
import PlusIcon from "@repo/ui/icons/PlusIcon";
import { useAppStore } from "lib/store/store";
import { navItems } from "lib/constants/navBarItems";
import { useMemories } from "hooks/useMemories";
import Logo from "./Logo";
import TypeIcon from "./TypeIcon";
import ThemeToggle from "./ThemeToggle";

/**
 * Left rail: brand, the main action, memory views with counts, theme and account.
 * Desktop: expanded (232px) or collapsed to icons (64px).
 * Mobile: a drawer opened from the top bar.
 */
export default function Sidebar() {
  const {
    isSidebarOpen,
    toggleSidebar,
    isMobileNavOpen,
    setMobileNavOpen,
    openModal,
    memoryTypeSelectedView,
    setMemoryType,
    activeTag,
    setActiveTag,
  } = useAppStore();
  const session = useSession();
  const router = useRouter();
  const [isSigningOut, startTransition] = useTransition();
  const { data } = useMemories(session.data?.user.id as string);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data?.length ?? 0 };
    for (const item of navItems) {
      if (item.type) c[item.key] = data?.filter((m) => m.type === item.type).length ?? 0;
    }
    return c;
  }, [data]);

  // The busiest tags: each one is a cluster of connected memories.
  const topTags = useMemo(() => {
    const c = new Map<string, number>();
    for (const m of data ?? []) for (const t of m.contentTags) c.set(t.tag.title, (c.get(t.tag.title) ?? 0) + 1);
    return [...c.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8);
  }, [data]);

  function signOutUser() {
    startTransition(async () => {
      await signOut({ redirect: false });
      router.push("/signin");
      toast.success("Signed out.");
    });
  }

  // On mobile the drawer is always shown expanded.
  const rail = (expanded: boolean, mobile: boolean) => (
    <nav
      aria-label="Dashboard"
      className="h-full flex flex-col bg-tissue border-r border-fold"
    >
      <div className={`h-16 flex items-center shrink-0 ${expanded ? "justify-between pl-4 pr-2" : "justify-center"}`}>
        {expanded && <Logo size="sm" />}
        {mobile ? (
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
            className="size-10 grid place-items-center rounded-[10px] text-dim hover:text-ink hover:bg-ink/[0.06] cursor-pointer"
          >
            <XIcon className="size-5" strokeWidth={1.75} />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={expanded}
            className="size-10 shrink-0 grid place-items-center rounded-[10px] text-dim hover:text-ink hover:bg-ink/[0.06] cursor-pointer"
          >
            {expanded ? (
              <PanelLeftCloseIcon className="size-5" strokeWidth={1.75} />
            ) : (
              <PanelLeftOpenIcon className="size-5" strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>

      <div className={`pt-2 pb-4 ${expanded ? "px-3" : "px-2"}`}>
        <button
          type="button"
          onClick={openModal}
          aria-label={expanded ? undefined : "Add memory"}
          title={expanded ? undefined : "Add memory"}
          className={`h-10 w-full inline-flex items-center gap-2 rounded-full bg-recall text-recall-ink font-semibold hover:brightness-95 cursor-pointer ${expanded ? "px-3" : "justify-center"}`}
        >
          <PlusIcon size="lg" />
          {expanded && "Add memory"}
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto ${expanded ? "px-3" : "px-2"}`}>
        {expanded && (
          <p className="px-3 pb-1.5 text-[13px] text-dim">Views</p>
        )}
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = memoryTypeSelectedView === item.key && !activeTag;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => setMemoryType(item.key)}
                  aria-current={active ? "page" : undefined}
                  aria-label={expanded ? undefined : `${item.title} (${counts[item.key]})`}
                  title={expanded ? undefined : item.title}
                  className={`w-full h-9 flex items-center gap-3 rounded-[10px] cursor-pointer transition-colors ${expanded ? "px-3" : "justify-center"} ${active ? "bg-ink/[0.07] text-ink" : "text-dim hover:text-ink hover:bg-ink/[0.04]"}`}
                >
                  {item.type ? (
                    <TypeIcon type={item.type} />
                  ) : (
                    <LayersIcon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  )}
                  {expanded && (
                    <>
                      <span className={`flex-1 text-left ${active ? "font-semibold" : ""}`}>
                        {item.title}
                      </span>
                      {active && <span aria-hidden className="size-1.5 rounded-full bg-recall" />}
                      <span className="text-[13px] tabular-nums text-dim">
                        {counts[item.key]}
                      </span>
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {expanded && topTags.length > 0 && (
          <>
            <p className="px-3 pt-5 pb-1.5 text-[13px] text-dim">Tags</p>
            <ul className="flex flex-wrap gap-1.5 px-2">
              {topTags.map(([tag, n]) => {
                const on = activeTag === tag;
                return (
                  <li key={tag}>
                    <button
                      type="button"
                      onClick={() => setActiveTag(on ? null : tag)}
                      aria-pressed={on}
                      className={`h-7 px-2.5 inline-flex items-center gap-1.5 rounded-full text-[13px] border cursor-pointer transition-colors ${on ? "border-recall bg-recall/15 text-ink font-semibold" : "border-fold text-dim hover:text-ink hover:border-ink/30"}`}
                    >
                      #{tag}
                      <span className="tabular-nums opacity-70">{n}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <div className={`border-t border-fold py-3 flex flex-col gap-1 ${expanded ? "px-3" : "px-2 items-center"}`}>
        <ThemeToggle withLabel={expanded} />
        <div className={`flex items-center gap-2.5 ${expanded ? "px-1 pt-1" : "flex-col pt-1"}`}>
          <Image
            src={session.data?.user.image || "/unknown-image.jpg"}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full border border-fold object-cover"
          />
          {expanded && (
            <span className="flex-1 min-w-0 truncate text-[14px] text-ink">
              {session.data?.user.name || session.data?.user.email || "Your account"}
            </span>
          )}
          <button
            type="button"
            onClick={signOutUser}
            disabled={isSigningOut}
            aria-label="Sign out"
            title="Sign out"
            className="size-9 grid place-items-center rounded-[10px] text-dim hover:text-ink hover:bg-ink/[0.06] cursor-pointer disabled:opacity-50"
          >
            <LogOutIcon className="size-[18px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* desktop rail */}
      <aside
        className={`hidden md:block fixed inset-y-0 left-0 z-30 transition-[width] duration-200 ${isSidebarOpen ? "w-[232px]" : "w-16"}`}
      >
        {rail(isSidebarOpen, false)}
      </aside>

      {/* mobile drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-[#1a2033]/50"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-[272px] max-w-[85vw]">
            {rail(true, true)}
          </aside>
        </div>
      )}
    </>
  );
}

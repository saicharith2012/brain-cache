"use client";
import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSession } from "next-auth/react";
import { LayoutGridIcon, WaypointsIcon } from "lucide-react";
import { useAppStore, type MemoryLayout } from "../lib/store/store";
import { navItems } from "lib/constants/navBarItems";
import { useMemories } from "hooks/useMemories";
import Card from "./Card";
import MemoryMap from "./map/MemoryMap";

const grid = "columns-1 sm:columns-2 xl:columns-3 2xl:columns-4 gap-4";
const LAYOUT_KEY = "braincache:layout";

export function LayoutSwitch({ className = "" }: { className?: string }) {
  const { memoryLayout, setMemoryLayout } = useAppStore();
  const save = (l: MemoryLayout) => {
    setMemoryLayout(l);
    try {
      localStorage.setItem(LAYOUT_KEY, l);
    } catch {
      // storage blocked (private mode); the choice still applies for this visit
    }
  };
  const options: { key: MemoryLayout; label: string; icon: typeof WaypointsIcon }[] = [
    { key: "map", label: "Map", icon: WaypointsIcon },
    { key: "list", label: "List", icon: LayoutGridIcon },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Show memories as"
      className={`inline-flex p-1 gap-1 rounded-full bg-matter border border-fold ${className}`}
    >
      {options.map(({ key, label, icon: Icon }) => {
        const on = memoryLayout === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => save(key)}
            className={`h-8 px-3 inline-flex items-center gap-1.5 rounded-full text-[13px] cursor-pointer transition-colors ${on ? "bg-tissue text-ink font-semibold shadow-[0_0_0_1px_var(--fold)]" : "text-dim hover:text-ink"}`}
          >
            <Icon className="size-4" strokeWidth={1.9} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** A faint, unlit brain shown when there is nothing saved yet. */
function GhostBrain() {
  const pts = [
    [60, 70, 9], [130, 40, 7], [190, 90, 11], [110, 120, 6], [250, 55, 8], [230, 130, 7],
  ] as const;
  const links = [[0, 1], [1, 2], [0, 3], [3, 2], [2, 4], [2, 5]] as const;
  return (
    <svg viewBox="0 0 310 170" className="w-[260px] h-auto" aria-hidden>
      {links.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="var(--fold)" strokeWidth="1.5" strokeDasharray="3 4" />
      ))}
      {pts.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="var(--dim)" strokeOpacity=".45" strokeWidth="1.5" strokeDasharray="2 3" />
      ))}
    </svg>
  );
}

export default function Memories() {
  const {
    openModal,
    memoryTypeSelectedView,
    activeTag,
    setActiveTag,
    citedContentIds,
    selectedMemoryId,
    setCitedContentIds,
    memoryLayout,
    setMemoryLayout,
  } = useAppStore();
  const session = useSession();
  const userId = session.data?.user.id as string | undefined;
  const { data, isLoading, error, refetch } = useMemories(userId!);

  const view = navItems.find((n) => n.key === memoryTypeSelectedView) ?? navItems[0];

  // Read the viewer's layout preference once; otherwise map on wide screens with enough memories.
  useEffect(() => {
    if (memoryLayout || !data) return;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LAYOUT_KEY);
    } catch {
      // storage blocked; fall back to the default below
    }
    if (saved === "map" || saved === "list") setMemoryLayout(saved);
    else setMemoryLayout(window.innerWidth < 768 || data.length < 3 ? "list" : "map");
  }, [memoryLayout, data, setMemoryLayout]);

  // Dev only: /dashboard?recall=<id>,<id> plays the recall pulse without a working AI key.
  useEffect(() => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars -- set by Next.js, not a project env var
    if (process.env.NODE_ENV === "production") return;
    const ids = new URLSearchParams(window.location.search).get("recall");
    if (ids) setCitedContentIds(ids.split(",").filter(Boolean));
  }, [setCitedContentIds]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (m) =>
        (!view.type || m.type === view.type) &&
        (!activeTag || m.contentTags.some((t) => t.tag.title === activeTag))
    );
  }, [data, view, activeTag]);

  const isMap = memoryLayout === "map";
  const heading = activeTag ? `#${activeTag}` : view.title;
  const shown = isMap ? data?.length ?? 0 : filtered.length;

  return (
    <section aria-labelledby="memories-heading" id="memories" className="pt-7">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-baseline gap-3 min-w-0">
          <h2
            id="memories-heading"
            className="font-display font-semibold text-[26px] sm:text-[30px] tracking-[-0.01em] text-ink truncate"
          >
            {isMap && !activeTag && !view.type ? "Your brain" : heading}
          </h2>
          {!isLoading && !error && (
            <span className="text-[14px] text-dim tabular-nums whitespace-nowrap">
              {isMap && (activeTag || view.type)
                ? `${filtered.length} of ${shown} lit`
                : `${shown} ${shown === 1 ? "memory" : "memories"}`}
            </span>
          )}
          {activeTag && (
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="text-[13px] text-dim underline underline-offset-4 hover:text-ink cursor-pointer"
            >
              Clear tag
            </button>
          )}
        </div>
        {!!data?.length && <LayoutSwitch />}
      </div>

      {isLoading && (
        <div
          aria-label="Loading memories"
          aria-busy
          className="h-[calc(100vh-240px)] min-h-[440px] rounded-[20px] border border-fold bg-tissue grid place-items-center"
        >
          <p className="text-dim animate-pulse">Loading your memories…</p>
        </div>
      )}

      {error && (
        <div className="py-16 text-center">
          <p className="text-ink font-semibold">Couldn&rsquo;t load your memories.</p>
          <p className="mt-1 text-dim">Check your connection, then try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 h-10 px-4 rounded-full border border-ink/25 text-ink hover:border-ink/60 cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && data?.length === 0 && (
        <div className="recall-stage rounded-[24px] border border-fold px-6 py-12 sm:py-16 flex flex-col items-center text-center">
          <GhostBrain />
          <p className="mt-6 font-display font-semibold text-[24px] text-ink">Save your first memory</p>
          <p className="mt-2 text-dim max-w-[42ch]">
            Add a memory and it will appear here as a node. Memories with the same tag connect to each other.
          </p>
          <button
            type="button"
            onClick={openModal}
            className="mt-6 h-11 px-5 inline-flex items-center rounded-full bg-recall text-recall-ink font-semibold hover:brightness-95 cursor-pointer"
          >
            Add memory
          </button>
        </div>
      )}

      {!isLoading && !error && !!data?.length && isMap && <MemoryMap memories={data} />}

      {!isLoading && !error && !!data?.length && memoryLayout === "list" && (
        <>
          {filtered.length === 0 ? (
            <div className="py-10 max-w-[44ch]">
              <p className="font-display font-semibold text-[22px] text-ink">
                {activeTag ? `Nothing tagged #${activeTag}.` : `No ${view.title.toLowerCase()} yet.`}
              </p>
              <p className="mt-2 text-dim">Save one with Add memory and it will show up here.</p>
            </div>
          ) : (
            <div className={grid}>
              <AnimatePresence initial={false}>
                {filtered.map((memory) => (
                  <motion.div
                    key={memory.id}
                    layout="position"
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                    className={`mb-4 break-inside-avoid rounded-[14px] ${selectedMemoryId === memory.id ? "ring-2 ring-ring ring-offset-2 ring-offset-matter" : ""}`}
                  >
                    <Card
                      id={memory.id}
                      title={memory.title || ""}
                      link={memory.link || ""}
                      type={memory.type}
                      tags={memory.contentTags}
                      note={memory.note?.contentData}
                      cited={citedContentIds.includes(memory.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </section>
  );
}

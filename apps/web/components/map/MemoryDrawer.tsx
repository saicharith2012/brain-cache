"use client";
import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAppStore } from "lib/store/store";
import { useMemories } from "hooks/useMemories";
import Card from "../Card";
import TypeIcon from "../TypeIcon";

/** Side panel (bottom sheet on mobile) for the memory picked on the map or in a list. */
export default function MemoryDrawer() {
  const { selectedMemoryId, setSelectedMemoryId, citedContentIds } = useAppStore();
  const session = useSession();
  const { data } = useMemories(session.data?.user.id as string);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const memory = data?.find((m) => m.id === selectedMemoryId) ?? null;

  // Memories that share a tag with this one, most shared first.
  const related = useMemo(() => {
    if (!memory || !data) return [];
    const tags = new Set(memory.contentTags.map((t) => t.tag.title));
    return data
      .filter((m) => m.id !== memory.id)
      .map((m) => ({ m, shared: m.contentTags.filter((t) => tags.has(t.tag.title)).length }))
      .filter((r) => r.shared > 0)
      .sort((a, b) => b.shared - a.shared)
      .slice(0, 6);
  }, [memory, data]);

  // If the memory was deleted, close.
  useEffect(() => {
    if (selectedMemoryId && data && !memory) setSelectedMemoryId(null);
  }, [selectedMemoryId, data, memory, setSelectedMemoryId]);

  useEffect(() => {
    if (!memory) return;
    if (!returnFocus.current) returnFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedMemoryId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [memory, setSelectedMemoryId]);

  useEffect(() => {
    if (selectedMemoryId === null && returnFocus.current) {
      returnFocus.current.focus?.({ preventScroll: true });
      returnFocus.current = null;
    }
  }, [selectedMemoryId]);

  return (
    <AnimatePresence>
      {memory && (
        <motion.aside
          key="drawer"
          role="dialog"
          aria-label={memory.title || "Memory"}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed z-40 bg-tissue border-fold shadow-[0_24px_64px_-24px_rgba(42,23,54,0.45)] overflow-y-auto inset-x-0 bottom-0 max-h-[82vh] rounded-t-[20px] border-t md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:max-h-none md:w-[400px] md:rounded-none md:border-t-0 md:border-l"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 h-14 bg-tissue border-b border-fold">
            <p className="font-display font-semibold text-[18px] text-ink">
              {citedContentIds.includes(memory.id) ? "Recalled memory" : "Memory"}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setSelectedMemoryId(null)}
              aria-label="Close"
              className="size-9 grid place-items-center rounded-[10px] text-dim hover:text-ink hover:bg-ink/[0.06] cursor-pointer"
            >
              <XIcon className="size-5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="p-5">
            <Card
              id={memory.id}
              title={memory.title || ""}
              link={memory.link || ""}
              type={memory.type}
              tags={memory.contentTags}
              note={memory.note?.contentData}
              cited={citedContentIds.includes(memory.id)}
            />

            <h3 className="mt-7 mb-2 font-display font-semibold text-[16px] text-ink">Connected memories</h3>
            {related.length === 0 ? (
              <p className="text-[14px] text-dim">
                Nothing shares a tag with this yet. Give related memories the same tag to connect them.
              </p>
            ) : (
              <ul className="flex flex-col">
                {related.map(({ m, shared }) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedMemoryId(m.id)}
                      className="w-full flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-[10px] text-left hover:bg-ink/[0.05] cursor-pointer"
                    >
                      <TypeIcon type={m.type} />
                      <span className="flex-1 min-w-0 truncate text-[14px] text-ink">
                        {m.title || m.note?.contentData || m.link || "Untitled"}
                      </span>
                      <span className="shrink-0 text-[12px] text-dim">
                        {shared} shared {shared === 1 ? "tag" : "tags"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

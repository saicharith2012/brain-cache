"use client";
import { FormEvent, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowUpIcon, AudioLines, XIcon } from "lucide-react";
import { ContentType } from "@repo/common/config";
import { useAppStore } from "lib/store/store";
import TypeIcon, { TYPE_META } from "./TypeIcon";

type Source = { contentId: string; title: string; type: string };
type Status = "idle" | "searching" | "streaming" | "done" | "error";

const isContentType = (t: string): t is ContentType => t in TYPE_META;

export default function Chat() {
  const { data } = useSession();
  const userId = data?.user.id;
  const setCitedContentIds = useAppStore((s) => s.setCitedContentIds);
  const setMemoryType = useAppStore((s) => s.setMemoryType);
  const setSelectedMemoryId = useAppStore((s) => s.setSelectedMemoryId);

  const [query, setQuery] = useState("");
  const [asked, setAsked] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const abortRef = useRef<AbortController | null>(null);

  async function ask(e?: FormEvent) {
    e?.preventDefault();
    const q = query.trim();
    if (!q || !userId) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAsked(q);
    setAnswer("");
    setSources([]);
    setCitedContentIds([]);
    setStatus("searching");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ query: q, userId }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) throw new Error(await response.text());

      const header = response.headers.get("X-Braincache-Sources");
      const found: Source[] = header ? JSON.parse(decodeURIComponent(header)) : [];
      setSources(found);
      setCitedContentIds(found.map((s) => s.contentId));
      setStatus("streaming");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setAnswer((previous) => previous + chunk);
      }
      const remainder = decoder.decode();
      if (remainder) setAnswer((previous) => previous + remainder);
      setStatus("done");
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      console.error(error);
      setStatus("error");
    }
  }

  function clear() {
    abortRef.current?.abort();
    setStatus("idle");
    setAnswer("");
    setAsked("");
    setSources([]);
    setCitedContentIds([]);
  }

  return (
    <section aria-labelledby="ask-heading" id="ask" className="rounded-[24px] border border-fold bg-tissue p-4 sm:p-5">
      <div>
        <h2 id="ask-heading" className="mb-3 flex items-center gap-2 font-semibold">
          <AudioLines className={`size-4 ${status === "searching" ? "text-[var(--ring)] motion-safe:animate-pulse" : "text-dim"}`} aria-hidden />
          Ask your brain
        </h2>
        <form
          onSubmit={ask}
          className={`flex h-14 items-center gap-2 rounded-xl border bg-matter pl-4 pr-2 transition-[border-color,box-shadow] focus-within:border-ink ${status === "searching" ? "recall-composer-pending" : "border-fold"}`}
        >
          <label htmlFor="ask-input" className="sr-only">
            Ask your brain
          </label>
          <input
            id="ask-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What did I save about…?"
            autoComplete="off"
            className="flex-1 min-w-0 h-full bg-transparent text-[16px] text-ink placeholder:text-dim focus:outline-none"
          />
          <button
            type="submit"
            disabled={!query.trim() || status === "searching" || status === "streaming"}
            aria-label="Ask"
            className="h-10 px-3.5 inline-flex items-center gap-1.5 rounded-full bg-recall text-recall-ink font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Ask</span>
            <ArrowUpIcon className="size-4 sm:hidden" strokeWidth={2.25} />
          </button>
        </form>
      </div>

      {status === "idle" ? (
        <p className="px-1 pt-3 text-[14px] text-dim">
          Ask about something you saved. The sources used in the answer will light up in your library.
        </p>
      ) : (
        <article
          aria-live="polite"
          aria-busy={status === "searching" || status === "streaming"}
          className="mt-4 bg-matter border border-fold rounded-2xl"
        >
          <header className="flex items-start justify-between gap-4 px-5 pt-4">
            <p className="min-w-0 break-words text-[14px] text-dim">
              <span className="sr-only">You asked: </span>
              {asked}
            </p>
            <button
              type="button"
              onClick={clear}
              aria-label="Clear answer"
              className="-mr-2 -mt-1 size-8 shrink-0 grid place-items-center rounded-[10px] text-dim hover:text-ink hover:bg-ink/[0.06] cursor-pointer"
            >
              <XIcon className="size-4" strokeWidth={2} />
            </button>
          </header>

          <div className="px-5 pt-2 pb-5">
            {status === "searching" && (
              <p className="text-[15px] text-dim animate-pulse">Recalling…</p>
            )}
            {status === "error" && (
              <p className="text-[15px] text-danger">
                Couldn&rsquo;t get an answer right now. Try asking again in a moment.
              </p>
            )}
            {(status === "streaming" || status === "done") && (
              <p className="text-[17px] leading-[1.65] text-ink max-w-[68ch] whitespace-pre-wrap break-words">
                {answer}
                {status === "streaming" && (
                  <span className="inline-block w-2 h-[1.05em] align-[-0.15em] ml-0.5 bg-ink/60 animate-pulse" />
                )}
              </p>
            )}
          </div>

          {status === "done" && sources.length === 0 && (
            <p className="border-t border-fold px-5 py-3 text-sm text-dim">No saved sources matched this question.</p>
          )}

          {sources.length > 0 && (
            <footer className="px-5 py-3.5 border-t border-fold">
              <p className="text-[13px] text-dim mb-1.5">Recalled from</p>
              <ul className="flex flex-wrap gap-2 motion-safe:animate-[fade-in_280ms_ease-out]">
                {sources.map((s) => (
                  <li key={s.contentId} className="min-w-0 max-w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setMemoryType("all");
                        setSelectedMemoryId(s.contentId);
                      }}
                      className="flex max-w-full items-center gap-2 py-1.5 px-3 border border-fold rounded-full bg-tissue text-left text-sm hover:border-recall cursor-pointer"
                    >
                      <span aria-hidden className="size-2 shrink-0 rounded-full bg-recall shadow-[0_0_0_3px_color-mix(in_srgb,var(--recall)_25%,transparent)]" />
                      {isContentType(s.type) && <TypeIcon type={s.type} />}
                      <span className="truncate text-ink font-medium">{s.title || "Untitled"}</span>
                      {isContentType(s.type) && (
                        <span className="shrink-0 text-dim">{TYPE_META[s.type].label}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </footer>
          )}
        </article>
      )}
    </section>
  );
}

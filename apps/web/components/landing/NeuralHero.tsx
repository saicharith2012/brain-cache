"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { AudioLines, ChevronDown, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ContentType } from "@repo/common/config";
import NeuralSculpture, { RECALL_DURATION } from "./NeuralSculpture";
import TypeIcon, { TYPE_META } from "components/TypeIcon";

type Memory = {
  id: string;
  type: ContentType;
  title: string;
  excerpt: string;
};

const memories: Memory[] = [
  { id: "talk", type: "youtube", title: "The science of sleep", excerpt: "The speaker suggests cutting off caffeine early enough that its effects have time to wear off." },
  { id: "log", type: "note", title: "My sleep log", excerpt: "I fell asleep faster on the days I skipped my usual 3 p.m. coffee." },
  { id: "focus", type: "tweet", title: "A thread on focus", excerpt: "Keep a short list of distractions to revisit after your work block." },
  { id: "guide", type: "link", title: "Spaced repetition guide", excerpt: "Leave a day between your first two sessions, then increase the interval when recall feels easy." },
  { id: "paper", type: "document", title: "Learning research notes", excerpt: "Attempt to recall the material before checking your notes. Use missed items to plan your next review." },
  { id: "cards", type: "note", title: "Flashcard ideas", excerpt: "Each card should prompt one idea so I can tell exactly what I missed." },
];

const examples = [
  {
    question: "What did I save about caffeine and sleep?",
    label: "Caffeine & sleep",
    answer: "The sleep talk suggests cutting off caffeine earlier in the day. Your sleep log backs that up: you fell asleep faster when you skipped your 3 p.m. coffee.",
    sources: ["talk", "log"],
  },
  {
    question: "How should I space out my study sessions?",
    label: "Spaced repetition",
    answer: "Start by leaving a day between your first two reviews, then stretch the interval as recall gets easier. Try answering from memory before looking at your notes.",
    sources: ["guide", "paper"],
  },
];

const byId = new Map(memories.map((memory) => [memory.id, memory]));

export default function NeuralHero({ still = false, intro }: { still?: boolean; intro?: ReactNode }) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [started, setStarted] = useState<number | null>(null);
  const [showExcerpts, setShowExcerpts] = useState(true);
  const [showAnswer, setShowAnswer] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const previewId = useId();
  const example = examples[exampleIndex]!;
  const targets = example.sources.map((id) => byId.get(id)!);
  const selected = selectedId ? byId.get(selectedId) : undefined;
  const instant = still || reduceMotion === true;

  useEffect(() => {
    if (started === null || instant) return;
    const excerpts = window.setTimeout(() => setShowExcerpts(true), 980);
    const answer = window.setTimeout(() => setShowAnswer(true), RECALL_DURATION);
    return () => {
      window.clearTimeout(excerpts);
      window.clearTimeout(answer);
    };
  }, [started, instant]);

  useEffect(() => {
    if (instant) {
      setShowExcerpts(true);
      setShowAnswer(true);
    }
  }, [instant]);

  function play(index: number) {
    setExampleIndex(index);
    setSelectedId(null);
    setShowExcerpts(instant);
    setShowAnswer(instant);
    setStarted(performance.now());
  }

  return (
    <div className={`neural-experience ${still ? "neural-experience-still" : ""}`}>
      {intro && <div className="neural-intro">{intro}</div>}
      <div className="neural-visual">
        <motion.div className="neural-question" key={started}
          initial={instant || started === null ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <AudioLines aria-hidden="true" className="size-4 shrink-0 text-[var(--hero-accent)]" />
          {example.question}
        </motion.div>
        <NeuralSculpture sources={example.sources} selected={selectedId} started={started} still={still} />
      </div>

      {!still && (
        <div className="neural-controls" id="demo">
          <div role="group" aria-label="Example questions" className="flex flex-wrap gap-1.5">
            {examples.map(({ label }, index) => (
              <button key={label} type="button" aria-pressed={index === exampleIndex}
                onClick={() => play(index)} className="neural-control">
                {label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => play(exampleIndex)} className="neural-control">
            <RotateCcw aria-hidden="true" className="size-3.5" /> Replay
          </button>
        </div>
      )}

      <div className="neural-result">
        {!still && (
          <ul aria-label="Recalled sources" className="neural-sources grid grid-cols-2 gap-2">
            {targets.map((memory, index) => (
              <li key={memory.id} className="min-w-0">
                <button
                  type="button"
                  aria-expanded={selectedId === memory.id}
                  aria-controls={previewId}
                  disabled={!showAnswer}
                  onClick={() => setSelectedId(selectedId === memory.id ? null : memory.id)}
                  className="neural-source"
                >
                  <TypeIcon type={memory.type} />
                  <span>{memory.title}</span>
                  <ChevronDown aria-hidden="true" className="ml-auto size-3.5 shrink-0" />
                </button>
                {showExcerpts && !showAnswer && (
                  <motion.p
                    initial={{ opacity: 0, y: -12, x: index === 0 ? -16 : 16 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.34 }}
                    className="neural-excerpt"
                  >
                    {memory.excerpt}
                  </motion.p>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="neural-answer" aria-live={still ? undefined : "polite"} aria-busy={!showAnswer}>
          <p className="neural-label">
            <span className={showAnswer ? "neural-answer-dot" : "neural-answer-dot motion-safe:animate-pulse"} />
            {showAnswer ? "Answer" : "Recalling your memories"}
          </p>
          {showAnswer && (
            <motion.p key={started} initial={instant || started === null ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="mt-2">
              {example.answer}
            </motion.p>
          )}
        </div>

        {!still && (
          <div id={previewId} hidden={!selected} aria-live="polite" className="neural-preview">
            {selected && (
              <>
                <p className="neural-label">{TYPE_META[selected.type].label} · {selected.title}</p>
                <p className="mt-1.5">{selected.excerpt}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

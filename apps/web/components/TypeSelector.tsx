import { ContentType } from "@repo/common/config";
import { TypeSelectorProps } from "../types/global";
import TypeIcon, { TYPE_META } from "./TypeIcon";

const TYPES: ContentType[] = [
  ContentType.youtube,
  ContentType.tweet,
  ContentType.link,
  ContentType.note,
  ContentType.document,
];

export default function TypeSelector({ selected, onSelect }: TypeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="What are you saving?"
      className="grid grid-cols-5 gap-1 p-1 rounded-[14px] bg-matter border border-fold"
    >
      {TYPES.map((type) => {
        const active = selected === type;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(type)}
            className={`flex flex-col items-center gap-1 py-2 rounded-[10px] text-[12px] cursor-pointer transition-colors ${active ? "bg-tissue text-ink font-semibold shadow-[0_0_0_1px_var(--fold)]" : "text-dim hover:text-ink"}`}
          >
            <TypeIcon type={type} size="xl" />
            <span className="inline-flex items-center gap-1">
              {active && <span aria-hidden className="size-1.5 rounded-full bg-recall" />}
              {TYPE_META[type].label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

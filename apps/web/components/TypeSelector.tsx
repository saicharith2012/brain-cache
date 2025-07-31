import { ContentType } from "@repo/db/client";
import { TypeSelectorProps } from "../types/global";

const TYPES: ContentType[] = [
  ContentType.youtube,
  ContentType.tweet,
  ContentType.link,
  ContentType.note,
  ContentType.document,
];

export default function TypeSelector({
  selected,
  onSelect,
}: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TYPES.map((type) => (
        <div
          key={type}
          className={`cursor-pointer border rounded-lg p-3 text-center font-semibold transition ${selected === type ? "bg-gray-500 text-white border-black shadow" : "bg-white text-black hover:bg-gray-100"}`}
          onClick={() => onSelect(type)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
      ))}
    </div>
  );
}

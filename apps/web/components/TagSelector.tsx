import { useEffect, useRef, useState } from "react";
import { Tag } from "../types/global";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { ContentFormData } from "@repo/common/config";
import InputTextComponent from "@repo/ui/inputTextComponent"
import CrossIcon from "@repo/ui/icons/CrossIcon";
import getTagColor from "../lib/utils/getTagColor";
import { TAG_COLOR_PALETTE } from "../lib/constants/colors";

export default function TagSelector({
  tags,
  setValue,
  errors,
}: {
  tags: Tag[];
  setValue: UseFormSetValue<ContentFormData>;
  errors: FieldErrors<ContentFormData>;
}) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>(tags);
  const [inputValue, setInputValue] = useState("");
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsDropDownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    setValue("tags", []);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setValue]);

  // updating filtered tags as input value and selected tags update
  useEffect(() => {
    const selectedTitles = new Set(selectedTags.map((tag) => tag.title));
    const newlyFiltered = tags.filter(
      (tag) =>
        !selectedTitles.has(tag.title) &&
        tag.title.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setFilteredTags(newlyFiltered);
    if (newlyFiltered.length === 0) setHighlightedIndex(-1);
  }, [inputValue, selectedTags, tags]);

  const handleTagAdd = (tag: Tag) => {
    const updated = [...selectedTags, tag];
    setSelectedTags(updated);
    setValue(
      "tags",
      updated.map((t) => t.title), 
      {shouldValidate: true}
    );
    setInputValue("");
    setIsDropDownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleTagRemove = (tag: Tag) => {
    const updated = selectedTags.filter((t) => t.title !== tag.title);
    setSelectedTags(updated);
    setValue(
      "tags",
      updated.map((t) => t.title),
      {shouldValidate: true}
    );
  };

  return (
    <div className="w-full">
      <label htmlFor="tag-input" className="block mb-1.5 text-[13px] font-medium text-ink">
        Tags
      </label>

      <div className="flex flex-wrap items-center gap-1.5">
        {selectedTags.map((tag, index) => (
          <div
            key={index}
            className={`flex items-center gap-1 ${TAG_COLOR_PALETTE[tag.color] ?? TAG_COLOR_PALETTE.gray} pl-1.5 pr-1 py-0.5 rounded-[8px] text-[13px] font-medium`}
          >
            {tag.title}
            <button
              type="button"
              onClick={() => handleTagRemove(tag)}
              aria-label={`Remove tag ${tag.title}`}
              className="opacity-60 hover:opacity-100 cursor-pointer rounded-[2px]"
            >
              <CrossIcon size="md" strokeWidth="3" />
            </button>
          </div>
        ))}

        <div className="relative w-full" ref={wrapperRef}>
          <InputTextComponent
            id="tag-input"
            type="text"
            placeholder="Type a tag and press Enter"
            role="combobox"
            aria-expanded={isDropDownOpen}
            aria-controls="tag-options"
            autoComplete="off"
            onFocus={() => setIsDropDownOpen(true)}
            value={inputValue}
            className="w-full h-fit"
            ref={inputRef}
            onClick={() => setIsDropDownOpen(true)}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsDropDownOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (isDropDownOpen) {
                  e.preventDefault();
                }
                let newTag: Tag | undefined;

                if (highlightedIndex !== -1 && filteredTags[highlightedIndex]) {
                  newTag = filteredTags[highlightedIndex];
                } else if (inputValue.trim() !== "") {
                  newTag = tags.find(
                    (tag) =>
                      tag.title.toLowerCase() ===
                      inputValue.trim().toLowerCase()
                  ) || {
                    title: inputValue.trim(),
                    color: getTagColor() || "gray",
                  };
                }

                if (
                  newTag &&
                  !selectedTags.some((t) => t.title === newTag!.title)
                ) {
                  handleTagAdd(newTag);
                }
                setHighlightedIndex(-1)
              } else if (e.key === "Escape") {
                setIsDropDownOpen(false);
                setHighlightedIndex(-1);
              } else if (e.key === "ArrowDown" && filteredTags.length > 0) {
                setHighlightedIndex((prev) => (prev + 1) % filteredTags.length);
              } else if (e.key === "ArrowUp" && filteredTags.length > 0) {
                setHighlightedIndex(
                  (prev) =>
                    (prev - 1 + filteredTags.length) % filteredTags.length
                );
              }
            }}
            error={errors.tags?.message}
          />

          {isDropDownOpen && (
            <div
              id="tag-options"
              role="listbox"
              className="absolute top-11 w-full flex flex-col max-h-44 overflow-y-auto bg-tissue border border-fold rounded-[10px] shadow-[0_12px_32px_-12px_rgba(26,32,51,0.3)] z-10 py-1 empty:hidden"
            >
              {/* Create New Tag Option */}
              {inputValue.trim() !== "" &&
                !tags.some(
                  (tag) =>
                    tag.title.toLowerCase() === inputValue.trim().toLowerCase()
                ) &&
                !selectedTags.some(
                  (tag) =>
                    tag.title.toLowerCase() === inputValue.trim().toLowerCase()
                ) && (
                  <div
                    className={`px-2 py-1.5 cursor-pointer hover:bg-ink/[0.05] transition-colors duration-150 ${
                      highlightedIndex === -1 ? "bg-ink/[0.05]" : ""
                    } flex gap-1 items-center`}
                    onClick={() =>
                      handleTagAdd({
                        title: inputValue.trim(),
                        color: getTagColor() || "gray",
                      })
                    }
                  >
                    <div
                      className={`${TAG_COLOR_PALETTE["gray"]} px-1.5 py-0.5 rounded-[8px] text-[13px] font-medium w-fit`}
                    >
                      {inputValue.trim()}
                    </div>
                    <span className="text-[13px] text-dim">Create tag</span>
                  </div>
                )}

              {filteredTags.map((tag, index) => (
                <div
                  key={index}
                  className={`px-2 py-1.5 cursor-pointer hover:bg-ink/[0.05] transition-colors duration-150 ${
                    index === highlightedIndex ? "bg-ink/[0.05]" : ""
                  }`}
                  onClick={() => handleTagAdd(tag)}
                >
                  <div
                    className={`${TAG_COLOR_PALETTE[tag.color] ?? TAG_COLOR_PALETTE.gray} px-1.5 py-0.5 rounded-[8px] text-[13px] font-medium w-fit `}
                  >
                    {tag.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

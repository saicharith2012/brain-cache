"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Tweet } from "react-tweet";
import ReactPlayer from "react-player";
import mql from "@microlink/mql";
import { toast } from "sonner";
import { ExternalLinkIcon, FileTextIcon, Trash2Icon } from "lucide-react";
import {
  ActionError,
  CardProps,
  GetDocumentPresignedUrlResponse,
} from "../types/global";
import { TAG_COLOR_PALETTE } from "../lib/constants/colors";
import { getDocumentPresignedUrl } from "../actions/generatePresignedUrls";
import { useDeleteMemory } from "hooks/useDeleteMemory";
import TypeIcon, { TYPE_META } from "./TypeIcon";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const domainOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
};

export default function Card(props: CardProps) {
  const [imageUrl, setImageUrl] = useState("/default-webpage.jpg");
  const { mutateAsync: deleteMemory, isPending: isDeleting } = useDeleteMemory();

  useEffect(() => {
    if (props.type !== "link" || !props.link) return;
    mql(props.link, { screenshot: true })
      .then(({ status, data }) => {
        if (status === "success" && data.screenshot?.url) setImageUrl(data.screenshot.url);
      })
      .catch(() => {});
  }, [props.type, props.link]);

  async function handleDelete() {
    try {
      const response = await deleteMemory({ memoryId: props.id });
      toast.success(response.message);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Couldn't delete this memory. Try again.");
    }
  }

  async function openDocument() {
    try {
      const response = await getDocumentPresignedUrl(props.id);
      if ((response as ActionError).error) throw new Error((response as ActionError).error);
      window.open((response as GetDocumentPresignedUrlResponse).url, "_blank", "noopener");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't open this PDF. Try again.");
    }
  }

  const title = props.title ? capitalize(props.title) : "";
  const meta =
    props.type === "link" && props.link ? domainOf(props.link) : TYPE_META[props.type].label;

  return (
    <article
      className={`group relative bg-tissue rounded-[14px] border overflow-hidden transition-[border-color,box-shadow] duration-200 ${props.cited ? "border-recall shadow-[0_0_0_3px_color-mix(in_srgb,var(--recall)_30%,transparent)]" : "border-fold"}`}
    >
      <header className="flex items-center gap-2 h-11 pl-3.5 pr-1.5">
        <TypeIcon type={props.type} />
        <span className="flex-1 min-w-0 truncate text-[13px] text-dim">{meta}</span>
        {props.cited && (
          <span className="recalled-chip px-2 py-0.5 rounded-full text-[12px] font-semibold">Recalled</span>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Delete ${title || "memory"}`}
          title="Delete"
          className="size-8 grid place-items-center rounded-[10px] text-dim hover:text-danger hover:bg-danger/10 cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-50 transition-opacity"
        >
          <Trash2Icon className="size-4" strokeWidth={1.75} />
        </button>
      </header>

      {props.type === "youtube" && (
        <>
          <div className="aspect-video bg-ink/5">
            <ReactPlayer
              src={props.link?.replace("youtube", "youtube-nocookie")}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          {title && <h3 className="px-3.5 pt-3 text-[15px] font-semibold leading-snug text-ink">{title}</h3>}
        </>
      )}

      {props.type === "tweet" && (
        <div className="[&>div]:m-0! [&>div]:border-0! [&>div]:rounded-none! [&>div]:bg-transparent! [&>div>article]:px-3.5! [&>div>article]:pt-0! [&>div>article]:pb-1!">
          <Tweet id={props.link!.split("/").pop()!.split("?")[0]!} apiUrl="" />
        </div>
      )}

      {props.type === "link" && (
        <a
          href={props.link}
          target="_blank"
          rel="noreferrer"
          className="block focus-visible:outline-offset-[-2px]"
        >
          <div className="relative w-full h-40 bg-ink/5 border-y border-fold">
            <Image
              src={imageUrl}
              alt=""
              className="object-cover object-top"
              fill
              sizes="(max-width: 640px) 100vw, 360px"
            />
          </div>
          <h3 className="px-3.5 pt-3 text-[15px] font-semibold leading-snug text-ink group-hover:underline underline-offset-2">
            {title || props.link}
          </h3>
        </a>
      )}

      {props.type === "note" && (
        <div className="px-3.5">
          {title && <h3 className="text-[15px] font-semibold leading-snug text-ink mb-1.5">{title}</h3>}
          <p className="text-[15px] leading-[1.6] text-ink/85 whitespace-pre-wrap line-clamp-[12]">
            {props.note}
          </p>
        </div>
      )}

      {props.type === "document" && (
        <div className="px-3.5">
          <button
            type="button"
            onClick={openDocument}
            className="w-full flex items-center gap-3 p-3 rounded-[10px] border border-fold bg-matter hover:border-ink/40 text-left cursor-pointer"
          >
            <FileTextIcon className="size-8 shrink-0 text-document" strokeWidth={1.25} aria-hidden />
            <span className="flex-1 min-w-0">
              <span className="block truncate text-[15px] font-semibold text-ink">
                {title || "Untitled PDF"}
              </span>
              <span className="text-[13px] text-dim">Open PDF</span>
            </span>
            <ExternalLinkIcon className="size-4 text-dim" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      )}

      <footer className="flex flex-wrap gap-1.5 px-3.5 pt-3 pb-3.5">
        {props.tags?.map((item) => (
          <span
            key={item.tag.title}
            className={`px-1.5 py-0.5 rounded-[8px] text-[12px] font-medium ${TAG_COLOR_PALETTE[item.tag.color] ?? TAG_COLOR_PALETTE.gray}`}
          >
            {item.tag.title}
          </span>
        ))}
      </footer>
    </article>
  );
}

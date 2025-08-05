"use client";
import { CardProps } from "../types/global";
import { TAG_COLOR_PALETTE } from "../lib/constants/colors";
import DeleteIcon from "@repo/ui/icons/DeleteIcon";
import WebIcon from "@repo/ui/icons/WebIcon";
import { Tweet } from "react-tweet";
import ReactPlayer from "react-player";
import mql from "@microlink/mql";
import { useEffect, useState } from "react";
import Image from "next/image";
import { deleteDocument } from "../actions/content";
import NoteIcon from "@repo/ui/icons/NoteIcon";

export default function Card(props: CardProps) {
  const [imageUrl, setImageUrl] = useState("/default-webpage.jpg");

  useEffect(() => {
    if (props.type === "link") {
      async function fetchUrlImage() {
        const { status, data } = await mql(props.link!, { screenshot: true });

        if (status === "success" && data.screenshot?.url) {
          setImageUrl(data.screenshot?.url);
        }
      }

      fetchUrlImage();
    }
  }, [props.type, props.link]);

  async function handleDelete() {
    try {
      const response = await deleteDocument(props.id);

      if (response.error) {
        throw new Error(response.error);
      }

      console.log(response);
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Internal Server Error"
      );
    }
  }

  return (
    <div className="group relative bg-white rounded-xl border shadow-sm border-gray-100 min-w-72 max-w-80 h-fit transition-all duration-300 overflow-hidden">
      <div className="">
        {/* embedding a youtube video */}
        {props.type === "youtube" && (
          <div>
            <ReactPlayer src={props.link} />
            <div className="px-3 pt-3">
              <div className="text-base mb-1">
                {props.title!.charAt(0).toUpperCase() + props.title!.slice(1)}
              </div>
            </div>
          </div>
        )}

        {/* embedding a tweet */}
        {props.type === "tweet" && (
          <div className="light [&>div]:!m-0 [&>div]:!border-0 [&>div]:!rounded-none [&>div]:hover:!bg-white [&>div]:hover:!cursor-pointer [&>div>article]:!px-3 [&>div>article]:!pt-3 [&>div>article]:!pb-1 ">
            <Tweet
              id={props.link!.split("/")[props.link!.split("/").length - 1]}
              apiUrl=""
            />
          </div>
        )}

        {/* embedding a link */}
        {props.type === "link" && (
          <a href={props.link}>
            <div className={`relative w-full h-[160px]`}>
              <Image
                src={imageUrl}
                alt="url image"
                className="object-cover"
                fill
                sizes="(max-width: 320px) 100vw, 320px"
              />
              <div className="absolute top-2 right-2 flex items-center px-2 py-1 gap-1 bg-gray-100 rounded-full">
                <WebIcon size="lg" />
                <div>Web</div>
              </div>
            </div>
            <div className="px-3 pt-3 flex flex-col gap-4">
              <div className="text-base mb-1">
                {props.title!.charAt(0).toUpperCase() + props.title!.slice(1)}
              </div>
              <div className="text-gray-700 text-[13px]">
                {props.link!.replace("https://", "").split("/")[0]}
              </div>
            </div>
          </a>
        )}

        {/* embedding a note */}
        {props.type === "note" && (
          <div className="relative w-full h-fit pt-12 px-4 pb-4 bg-gray-50">
            <div className="absolute top-2 right-2 flex items-center px-2 py-1 gap-1 bg-gray-100 rounded-full">
              <NoteIcon size="lg"/>
              <div>Note</div>
            </div>

            <div>{props.note}</div>
          </div>
        )}
      </div>

      <div className="p-2 flex flex-wrap gap-2">
        {props.tags?.map((item, index) => (
          <div
            className={`px-2 py-1 ${TAG_COLOR_PALETTE[item.tag.color]} w-fit rounded-lg`}
            key={index}
          >{`${item.tag.title}`}</div>
        ))}
      </div>

      <div
        className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full bg-gray-200 hover:bg-gray-300 focus:bg-gray-400 p-1.5"
        onClick={handleDelete}
      >
        <DeleteIcon size="lg" strokeWidth="2" />
      </div>
    </div>
  );
}

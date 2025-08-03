"use client";
import { CardProps } from "../types/global";
import { TAG_COLOR_PALETTE } from "../lib/constants/colors";
import DeleteIcon from "@repo/ui/icons/DeleteIcon";
import WebIcon from "@repo/ui/icons/WebIcon";
import OpenIcon from "@repo/ui/icons/OpenIcon";
import { Tweet } from "react-tweet";
import ReactPlayer from "react-player";
import mql from "@microlink/mql";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Card(props: CardProps) {
  const [imageUrl, setImageUrl] = useState("/default-webpage.jpg");

  useEffect(() => {
    if (props.type === "link") {
      async function fetchUrlImage() {
        const { status, data } = await mql(props.link, { screenshot: true });

        if (status === "success" && data.screenshot?.url) {
          setImageUrl(data.screenshot?.url);
        }
      }

      fetchUrlImage();
    }
  }, [props.type, props.link]);

  return (
    <div className="group relative bg-white rounded-xl border shadow-sm border-gray-100 min-w-72 max-w-80 h-fit transition-all duration-300 overflow-hidden">
      <div className="">
        {/* embedding a youtube video */}
        {props.type === "youtube" && (
          <div>
            <ReactPlayer src={props.link} />
            <div className="px-3 pt-3">
              <div className="text-base mb-1">
                {props.title.charAt(0).toUpperCase() + props.title.slice(1)}
              </div>
            </div>
          </div>
        )}

        {/* embedding a tweet */}
        {props.type === "tweet" && (
          <div className="light [&>div]:!m-0 [&>div]:!border-0 [&>div]:!rounded-none [&>div]:hover:!bg-white [&>div]:hover:!cursor-pointer [&>div>article]:!px-3 [&>div>article]:!pt-3 [&>div>article]:!pb-1 ">
            <Tweet
              id={props.link.split("/")[props.link.split("/").length - 1]}
              apiUrl=""
            />
          </div>
        )}

        {/* embedding a link */}
        {props.type === "link" && (
          <a href={props.link}>
            <div className={`relative w-full h-[160px]`}>
              <div className="w-auto h-auto">
                <Image
                  src={imageUrl}
                  alt="url image"
                  className="w-full"
                  fill
                />
              </div>
              <div className="absolute top-2 right-2 flex items-center px-2 py-1 gap-1 bg-gray-100 rounded-full">
                <WebIcon size="lg" />
                <div>Web</div>
              </div>
            </div>
            <div className="px-3 pt-3 flex flex-col gap-4">
              <div className="text-base mb-1">
                {props.title.charAt(0).toUpperCase() + props.title.slice(1)}
              </div>
              <div className="text-gray-700 text-[13px]">
                {props.link.replace("https://", "").split("/")[0]}
              </div>
            </div>
          </a>
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

      <div className="absolute flex gap-2 right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
        <div className="rounded-full bg-gray-200 hover:bg-gray-300 focus:bg-gray-400 p-1.5">
          <OpenIcon size="xl" />
        </div>
        <div className="rounded-full bg-gray-200 hover:bg-gray-300 focus:bg-gray-400 p-1.5">
          <DeleteIcon size="xl" strokeWidth="2" />
        </div>
      </div>
    </div>
  );
}

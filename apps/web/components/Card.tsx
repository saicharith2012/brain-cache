import { CardProps } from "../types/global";
import { TAG_COLOR_PALETTE } from "../lib/constants/colors";
import DeleteIcon from "@repo/ui/icons/DeleteIcon";
import WebIcon from "@repo/ui/icons/WebIcon";

export default function Card(props: CardProps) {
  return (
    <div className="group relative bg-white rounded-lg border shadow-sm border-gray-100 max-w-72 min-w-72 h-fit min-h-56 transition-all duration-300 overflow-hidden">
      <div>
        {/* embedding a youtube video */}
        {props.type === "youtube" && (
          <iframe
            className="w-full"
            src={props.link.replace("watch?v=", "embed/")}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}

        {/* embedding a tweet */}
        {props.type === "tweet" && (
          <blockquote className="twitter-tweet">
            <a href={props.link.replace("x", "twitter")}></a>
          </blockquote>
        )}

        {/* embedding a link or document */}
        {props.type === "link" && (
          <a href={props.link}>
            <div className="relative w-full h-[160px] flex justify-center items-center bg-[url(/default-webpage.jpg)] bg-cover">
              <div className="absolute top-2 right-2 flex items-center px-2 py-1 gap-1 bg-gray-100 rounded-full">
                <WebIcon size="lg" />
                <div>Web</div>
              </div>
            </div>
            <div className="px-3 pt-3">
              <div className="text-base mb-4">
                {props.title.charAt(0).toUpperCase() + props.title.slice(1)}
              </div>
              <div className="text-gray-700 text-[13px]">
                {props.link.replace("http://", "").split("/")[0]}
              </div>
            </div>
          </a>
        )}
      </div>

      <div className="p-2 flex flex-wrap gap-2 ">
        {props.tags?.map((item, index) => (
          <div
            className={`px-2 py-1 ${TAG_COLOR_PALETTE[item.tag.color]} w-fit rounded-lg`}
            key={index}
          >{`#${item.tag.title}`}</div>
        ))}
      </div>

      <div className="absolute right-2 bottom-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:bg-gray-400 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
        <DeleteIcon size="xl" strokeWidth="2" />
      </div>
    </div>
  );
}

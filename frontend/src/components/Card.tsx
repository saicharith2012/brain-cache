import DeleteIcon from "../icons/DeleteIcon";
import DocumentIcon from "../icons/DocumentIcon";
import LinkIcon from "../icons/LinkIcon";
import OpenIcon from "../icons/OpenIcon";
import TwitterIcon from "../icons/TwitterIcon";
import YoutubeIcon from "../icons/YoutubeIcon";

interface CardProps {
  title: string;
  link: string;
  type: "tweet" | "youtube" | "document" | "link";
}

export default function Card(props: CardProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm border-gray-100 p-4 max-w-72 min-w-72 h-fit min-h-56">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="pr-3 text-gray-500">
            {props.type === "youtube" && <YoutubeIcon size="2xl"/>}
            {props.type === "tweet" && <TwitterIcon size="xl"/>}
            {props.type === "document" && <DocumentIcon size="xl" />}
            {props.type === "link" && <LinkIcon size="xl" />}
          </div>
          <span className="font-medium text-gray-600">{props.title}</span>
        </div>

        <div className="flex text-gray-400 items-center gap-2">
          <a href={props.link} target="_blank">
            <OpenIcon size="2xl"/>
          </a>
          <div className="cursor-pointer">
            <DeleteIcon size="xl" />
          </div>{" "}
        </div>
      </div>

      <div className="mt-4">
        {/* embedding a youtube video */}
        {props.type === "youtube" && (
          <iframe
            className="w-full rounded-lg"
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
            <div className="w-full h-[150px] flex justify-center items-center bg-gray-100 rounded-lg">
              <LinkIcon size="3xl" />
            </div>
          </a>
        )}
      </div>
    </div>
  );
}

import { ContentType } from "@repo/db/client";
import { TypeSelectorProps } from "../types/global";
import YoutubeIcon from "@repo/ui/icons/YoutubeIcon";
import TwitterIcon from "@repo/ui/icons/TwitterIcon";
import WebIcon from "@repo/ui/icons/WebIcon";
import NoteIcon from "@repo/ui/icons/NoteIcon";
import DocumentIcon from "@repo/ui/icons/DocumentIcon";

const TYPES: {
  type: string;
  bgColor: string;
  hoverBgColor: string;
  icon: React.ReactElement;
  iconColor: string;
}[] = [
  {
    type: ContentType.youtube,
    bgColor: "bg-indianred-200",
    hoverBgColor: "hover:bg-indianred-100",
    icon: <YoutubeIcon size="xl" strokeWidth="1.5" />,
    iconColor: "text-indianred-600",
  },
  {
    type: ContentType.tweet,
    bgColor: "bg-twtblue-200",
    hoverBgColor: "hover:bg-twtblue-100",
    icon: <TwitterIcon size="xl" strokeWidth="1.3" />,
    iconColor: "text-twtblue-600",
  },
  {
    type: ContentType.link,
    bgColor: "bg-indigo-200",
    hoverBgColor: "hover:bg-indigo-100",
    icon: <WebIcon size="xl" strokeWidth="1.5" />,
    iconColor: "text-indigo-600",
  },
  {
    type: ContentType.note,
    bgColor: "bg-amber-100",
    hoverBgColor: "hover:bg-amber-50",
    icon: <NoteIcon size="xl" strokeWidth="1.5" />,
    iconColor: "text-amber-600",
  },
  {
    type: ContentType.document,
    bgColor: "bg-seagreen-200",
    hoverBgColor: "hover:bg-seagreen-100",
    icon: <DocumentIcon size="xl" strokeWidth="1.5" />,
    iconColor: "text-seagreen-600",
  },
];

export default function TypeSelector({
  selected,
  onSelect,
}: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TYPES.map((type) => (
        <div
          key={type.type}
          className={` flex items-center py-3 px-4 font-semibold cursor-pointer border border-gray-200 rounded-lg text-gray-700 transition duration-200 ${selected === type.type ? `${type.bgColor} border-black` : `bg-gray-50 text-black ${type.hoverBgColor}`}`}
          onClick={() => onSelect(type.type)}
        >
          <div className="flex flex-col items-start gap-1.5 h-11">
            <div className={`${type.iconColor}`}>{type.icon}</div>
            <span className="">
              {type.type.charAt(0).toUpperCase() + type.type.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

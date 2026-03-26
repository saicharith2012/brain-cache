import { ContentType } from "@repo/common/config";
import YoutubeIcon from "@repo/ui/icons/YoutubeIcon";
import TwitterIcon from "@repo/ui/icons/TwitterIcon";
import WebIcon from "@repo/ui/icons/WebIcon";
import NoteIcon from "@repo/ui/icons/NoteIcon";
import DocumentIcon from "@repo/ui/icons/DocumentIcon";

type IconSize = "lg" | "xl" | "2xl";

/** One place for each content type's icon, colour and human name. */
export const TYPE_META: Record<
  ContentType,
  { label: string; plural: string; color: string }
> = {
  youtube: { label: "Video", plural: "Videos", color: "text-youtube" },
  tweet: { label: "Tweet", plural: "Tweets", color: "text-tweet" },
  link: { label: "Web page", plural: "Web pages", color: "text-link" },
  note: { label: "Note", plural: "Notes", color: "text-note" },
  document: { label: "PDF", plural: "PDFs", color: "text-document" },
};

export default function TypeIcon({
  type,
  size = "lg",
}: {
  type: ContentType;
  size?: IconSize;
}) {
  const icon = {
    youtube: <YoutubeIcon size={size} strokeWidth="1.6" />,
    tweet: <TwitterIcon size={size} strokeWidth="1.4" />,
    link: <WebIcon size={size} strokeWidth="1.6" />,
    note: <NoteIcon size={size} strokeWidth="1.6" />,
    document: <DocumentIcon size={size} strokeWidth="1.6" />,
  }[type];

  return (
    <span className={`inline-flex shrink-0 ${TYPE_META[type].color}`} aria-hidden>
      {icon}
    </span>
  );
}

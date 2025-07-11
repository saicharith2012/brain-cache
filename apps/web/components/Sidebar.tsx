import { ReactElement } from "react";
import Logo from "./Logo";
import TwitterIcon from "@repo/ui/icons/TwitterIcon";
import YoutubeIcon from "@repo/ui/icons/YoutubeIcon";
import DocumentIcon from "@repo/ui/icons/DocumentIcon";
import LinkIcon from "@repo/ui/icons/LinkIcon";
import HashtagIcon from "@repo/ui/icons/HashtagIcon";
import SidebarItem from "./SidebarItem";

const sidebarItems: { icon: ReactElement; title: string }[] = [
  { icon: <TwitterIcon size="2xl" />, title: "Tweets" },
  { icon: <YoutubeIcon size="2xl" />, title: "Videos" },
  { icon: <DocumentIcon size="2xl" />, title: "Documents" },
  { icon: <LinkIcon size="2xl" />, title: "Links" },
  { icon: <HashtagIcon size="2xl" />, title: "Tags" },
];

export default function Sidebar() {
  return (
    <div className="h-screen bg-white shadow border-black/30 w-64 fixed top-0 left-0 p-4">
      <Logo size="md" />

      <div>
        {sidebarItems.map((item, index) => (
          <div key={index}>
            <SidebarItem text={item.title} icon={item.icon} />
          </div>
        ))}
      </div>
    </div>
  );
}

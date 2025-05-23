import { ReactElement } from "react";
import TwitterIcon from "../icons/TwitterIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import DocumentIcon from "../icons/DocumentIcon";
import LinkIcon from "../icons/LinkIcon";
import HashtagIcon from "../icons/HashtagIcon";
import SidebarItem from "./SidebarItem";

const sidebarItems: { icon: ReactElement; title: string }[] = [
  { icon: <TwitterIcon size="2xl"/>, title: "Tweets" },
  { icon: <YoutubeIcon size="2xl"/>, title: "Videos" },
  { icon: <DocumentIcon size="2xl" />, title: "Documents" },
  { icon: <LinkIcon size="2xl" />, title: "Links" },
  { icon: <HashtagIcon size="2xl" />, title: "Tags" },
];

export default function Sidebar() {
  return (
    <div className="h-screen bg-white shadow border-black/30 w-64 fixed top-0 left-0 p-4">
      <div className="flex items-center mt-2 ml-2 mb-8">
        <img src="./braincache-logo.png" className="w-10 mr-2"></img>
        <h1 className="text-2xl font-semibold">Braincache</h1>
      </div>

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

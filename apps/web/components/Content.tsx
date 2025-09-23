"use client";
import PlusIcon from "@repo/ui/icons/PlusIcon";
import { ContentWithTags, Tag } from "../types/global";
import Card from "./Card";
import CreateContentModal from "./CreateContentModal";
import { useAppStore } from "../lib/store/store";

export default function Content({
  data,
  tags,
}: {
  data: ContentWithTags[];
  tags: Tag[];
}) {
  const { openModal, isSidebarOpen } = useAppStore();
  // console.log(data)
  return (
    <div className={`h-full w-full pt-16 ${isSidebarOpen ? "pl-58" : "pl-16"}`}>
      <CreateContentModal tags={tags} />
      
      <div className="flex py-12 sm:p-12">
        <div
          className={`${isSidebarOpen ? "md:columns-1 lg:columns-2 xl:columns-3 2xl:columns-4" : "sm:columns-1 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5"} gap-3 w-fit [&>div]:w-fit mx-auto`}
        >
          <div
            className="break-inside-avoid w-80 min-w-80 max-w-80 h-72 p-6 mb-4 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-300 hover:border-black border-dashed hover:scale-103 rounded-lg cursor-pointer"
            onClick={openModal}
          >
            <div className="opacity-80 my-3">
              <PlusIcon size="6xl" />
            </div>
            <div className="flex-1 text-4xl mt-6 ml-2 text-start">
              Add a new <br /> memory to your
              <br /> brain
            </div>
          </div>
          {data.map((item) => (
            <div key={item.id}>
              <Card
                id={item.id}
                title={item.title || ""}
                link={item.link || ""}
                type={item.type}
                tags={item.contentTags}
                note={item.note?.contentData}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

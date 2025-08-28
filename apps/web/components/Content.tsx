"use client";
import PlusIcon from "@repo/ui/icons/PlusIcon";
import { ContentWithTags, Tag } from "../types/global";
import Card from "./Card";
import { useState } from "react";
import CreateContentModal from "./CreateContentModal";

export default function Content({
  data,
  tags,
}: {
  data: ContentWithTags[];
  tags: Tag[];
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // console.log(data)
  return (
    <div>
      <CreateContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tags={tags}
      />
      <div className="flex py-4 sm:p-12">
        <div className="md:columns-1 lg:columns-2 xl:columns-3 2xl:columns-4 gap-3 w-fit [&>div]:w-fit mx-auto">
          <div
            className="break-inside-avoid w-80 min-w-80 max-w-80 h-72 p-6 mb-4 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-300 hover:border-black border-dashed hover:scale-103 rounded-lg cursor-pointer"
            onClick={() => {
              setIsModalOpen(true);
            }}
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

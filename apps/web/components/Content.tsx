"use client";
import PlusIcon from "@repo/ui/icons/PlusIcon";
import { ContentWithTags } from "../types/global";
import Card from "./Card";
import { useState } from "react";
import CreateContentModal from "./CreateContentModal";

export default function Content({ data }: { data: ContentWithTags[] }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div>
      <CreateContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="p-8 flex flex-wrap gap-4">
        <div
          className="w-72 min-w-fit h-72 p-6 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-300 hover:border-black border-dashed hover:scale-103 rounded-lg cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <div className="opacity-80 my-3">
            <PlusIcon size="6xl" />
          </div>
          <div className="text-3xl mt-6 text-start">
            Add a new memory
            <br /> to your
            <br /> brain&apos;s cache
          </div>
        </div>
        {data.map((item) => (
          <div key={item.id}>
            <Card
              title={item.title}
              link={item.link}
              type={item.type}
              tags={item.contentTags}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

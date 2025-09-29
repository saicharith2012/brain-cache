import React from "react";
import Navbar from "./Navbar";
import { motion } from "motion/react";
import { useAppStore } from "../lib/store/store";
import PlusIcon from "@repo/ui/icons/PlusIcon";
import Card from "./Card";
import { ContentWithTags } from "../types/global";

export default function Memories({ data }: { data: ContentWithTags[] }) {
  const { openModal } = useAppStore();
  return (
    <div id="memories" className={`relative flex flex-col py-12 sm:p-12`}>
      <Navbar />
      <motion.div
        layout
        className={`sm:columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-3 w-fit [&>div]:w-fit mx-auto`}
      >
        <div
          className="break-inside-avoid w-80 min-w-80 max-w-80 h-72 p-6 mb-4 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-300 hover:border-black border-dashed hover:scale-103 rounded-lg cursor-pointer bg-white"
          onClick={openModal}
        >
          <div className="opacity-80 my-3">
            <PlusIcon size="6xl" />
          </div>
          <div className="flex-1 text-4xl mt-6 ml-2 text-start">
            Add a new memory to your brain
          </div>
        </div>

        <motion.div layout>
          {data.map((item) => (
            <motion.div layout key={item.id}>
              <Card
                id={item.id}
                title={item.title || ""}
                link={item.link || ""}
                type={item.type}
                tags={item.contentTags}
                note={item.note?.contentData}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

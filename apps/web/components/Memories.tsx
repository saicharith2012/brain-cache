"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAppStore } from "../lib/store/store";
import PlusIcon from "@repo/ui/icons/PlusIcon";
import Card from "./Card";
import { ContentWithTags } from "../types/global";
import { ContentType } from "@repo/common/config";
import { MemoryViews } from "lib/constants/navBarItems";
import { useSession } from "next-auth/react";
import { useMemories } from "hooks/useMemories";

export default function Memories() {
  const { openModal, memoryTypeSelectedView } = useAppStore();
  const [memories, setMemories] = useState<ContentWithTags[]>([]);

  const session = useSession();
  const userId = session.data?.user.id as string | undefined;

  // fetch memories
  const { data, isLoading, error } = useMemories(userId!);

  useEffect(() => {
    if (!data) {
      setMemories([]);
      return;
    }

    if (memoryTypeSelectedView === MemoryViews.ALL) {
      setMemories(data);
      return;
    }

    let filtered = data;
    if (memoryTypeSelectedView === MemoryViews.VIDEOS) {
      filtered = data.filter((item) => item.type === ContentType.youtube);
    } else if (memoryTypeSelectedView === MemoryViews.TWEETS) {
      filtered = data.filter((item) => item.type === ContentType.tweet);
    } else if (memoryTypeSelectedView === MemoryViews.PAGES) {
      filtered = data.filter((item) => item.type === ContentType.link);
    } else if (memoryTypeSelectedView === MemoryViews.NOTES) {
      filtered = data.filter((item) => item.type === ContentType.note);
    } else if (memoryTypeSelectedView === MemoryViews.DOCUMENTS) {
      filtered = data.filter((item) => item.type === ContentType.document);
    }

    setMemories(filtered);
  }, [memoryTypeSelectedView, data]);

  if (isLoading)
    return (
      <p className="flex items-center justify-center py-12 sm:p-12 min-h-[calc(100vh-64px)]">
        Loading...
      </p>
    );

  if (error) return;

  return (
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
        {memories.map((memory) => (
          <motion.div layout key={memory.id}>
            <Card
              id={memory.id}
              title={memory.title || ""}
              link={memory.link || ""}
              type={memory.type}
              tags={memory.contentTags}
              note={memory.note?.contentData}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

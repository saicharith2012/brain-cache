"use client";
import React, { useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@repo/ui/button";
import { useSession } from "next-auth/react";
import { queryRetrieval } from "../actions/retrieval";

export default function Chat() {
  const queryRef = useRef<HTMLTextAreaElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const { data } = useSession();
  const userId = data?.user.id;

  const handleClick = async () => {
    if (!queryRef.current || !userId) {
      return;
    }
    const response = await queryRetrieval({
      query: queryRef.current?.value,
      userId,
    });

    if (!responseRef.current) {
      return;
    }

    responseRef.current.innerText = response || "";
  };

  return (
    <motion.div
      layout
      aria-label="chat"
      className={`min-h-[calc(100vh-64px)] z-0 flex flex-col p-12 gap-8 box-border`}
      id="chat"
    >
      <motion.div
        layout
        className="w-4xl max-w-5/6 mx-auto p-2 bg-white rounded-md border border-gray-400"
        aria-label="chatbox"
      >
        <motion.textarea
          ref={queryRef}
          name="query"
          layout
          placeholder="Ask your brain"
          className="w-full min-h-[150px] focus-within:outline-none resize-none"
        />
        <motion.div layout className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="md"
            text="search"
            onClick={() => handleClick()}
          />
        </motion.div>
      </motion.div>
      <motion.div
        layout
        ref={responseRef}
        className="w-4xl max-w-5/6 mx-auto flex-1"
        aria-label="response"
      ></motion.div>
    </motion.div>
  );
}

"use client";
import React from "react";
import { motion } from "motion/react";
import { Button } from "@repo/ui/button";

export default function Chat() {
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
          layout
          placeholder="Ask your brain"
          className="w-full min-h-[150px] focus-within:outline-none resize-none"
        />
        <motion.div layout className="flex justify-end">
          <Button variant="secondary" size="md" text="search" />
        </motion.div>
      </motion.div>
      <motion.div
        layout
        className="w-4xl mx-auto flex-1"
        aria-label="response"
      ></motion.div>
    </motion.div>
  );
}

"use client";
import { useAppStore } from "lib/store/store";
import { AnimatePresence } from "motion/react";
import React, { useEffect } from "react";
import CreateContentModal from "./CreateContentModal";
import Chat from "./Chat";
import Navbar from "./Navbar";
import Memories from "./Memories";

export default function DashboardClient() {
  const { isSidebarOpen, isModalOpen } = useAppStore();
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, [isModalOpen]);

  return (
    <AnimatePresence>
      <div
        className={`h-full w-full pt-16 ${isSidebarOpen ? "pl-58" : "pl-16"} z-0 border-box`}
      >
        <CreateContentModal />
        <Chat />
        <div
          id="memories"
          className={`relative flex flex-col py-12 sm:p-12 min-h-[calc(100vh-64px)]`}
        >
          <Navbar />
          <Memories />
        </div>
      </div>
    </AnimatePresence>
  );
}

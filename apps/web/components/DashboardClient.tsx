"use client";
import CreateContentModal from "./CreateContentModal";
import { useAppStore } from "../lib/store/store";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import Chat from "./Chat";
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
        <CreateContentModal/>
        <Chat />
        <Memories />
      </div>
    </AnimatePresence>
  );
}

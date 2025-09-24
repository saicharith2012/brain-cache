"use client";
import { ReactElement, useState } from "react";
import BrainIcon from "@repo/ui/icons/BrainIcon";
import BotIcon from "@repo/ui/icons/BotIcon";
import ChevronLeft from "@repo/ui/icons/ChevronLeft";
import ChevronRight from "@repo/ui/icons/ChevronRight";
import { AnimatePresence, motion } from "motion/react";
import { useAppStore } from "../lib/store/store";

const sidebarItems: { icon: ReactElement; key: string; title: string }[] = [
  {
    icon: <BotIcon size="2xl" strokeWidth="1.5" />,
    key: "chat",
    title: "Chat with brain",
  },
  {
    icon: <BrainIcon size="2xl" strokeWidth="1.5" />,
    key: "memories",
    title: "Memories",
  },
];

const sidebarVariant = {
  open: {
    width: "232px",
  },
  closed: {
    width: "64px",
  },
};

const sidebarTitleVariants = {
  open: {
    opacity: 1,
    x: 0,
  },
  closed: {
    opacity: 0,
    x: -10,
  },
};

const sidebarItemsParentVariant = {
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const [currentTab, setCurrentTab] = useState<string>("chat");
  return (
    <motion.div
      initial={false}
      animate={isSidebarOpen ? "open" : "closed"}
      variants={sidebarVariant}
      transition={{
        duration: 0.3,
      }}
      className={`h-screen bg-white shadow border-black/30 fixed top-16 left-0 p-2 z-106`}
    >
      <div className="flex flex-col gap-2">
        <div
          className={`flex ${isSidebarOpen ? "justify-between" : "justify-center"} items-center mb-2`}
        >
          <motion.div
            variants={sidebarTitleVariants}
            className={`text-black text-xl ${isSidebarOpen ? "ml-3" : "w-0"} font-semibold overflow-hidden`}
          >
            Dashboard
          </motion.div>
          <div
            onClick={toggleSidebar}
            aria-label="sidebar-toggle"
            className="rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors duration-300 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] flex items-center justify-center p-2 cursor-pointer"
          >
            {isSidebarOpen ? (
              <ChevronLeft size="2xl" strokeWidth="1.5" />
            ) : (
              <ChevronRight size="2xl" strokeWidth="1.5" />
            )}
          </div>
        </div>
        <motion.div
          variants={sidebarItemsParentVariant}
          className="flex flex-col gap-1.5"
        >
          {sidebarItems.map((item, index) => (
            <motion.div
              key={index}
              className="relative group flex gap-4 items-center rounded-md px-3 py-2 cursor-pointer transition-all duration-300 z-[120] hover:bg-gray-100"
              onClick={() => setCurrentTab(item.key)}
            >
              <motion.div className="text-black z-108">{item.icon}</motion.div>
              {!isSidebarOpen && (
                <div
                  className="absolute top-[20%] left-[110%] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-0.5 bg-gray-50 border rounded-lg z-110 pointer-events-none"
                  aria-label="tooltip"
                >
                  {item.title}
                </div>
              )}{" "}
              <motion.div
                variants={sidebarTitleVariants}
                className="text-black text-base whitespace-nowrap overflow-hidden text-ellipsis z-108"
              >
                {item.title}
              </motion.div>
              <AnimatePresence>
                {currentTab === item.key && (
                  <motion.div
                    layoutId="sidebar-current"
                    className="absolute w-full h-full inset-0 bg-gray-200 rounded-lg z-100"
                  ></motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

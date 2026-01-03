// to navigate different types of memories in the dashboard
"use client";
import React from "react";
import { motion } from "motion/react";
import { navItems } from "lib/constants/navBarItems";
import { useAppStore } from "lib/store/store";

const Navbar = () => {
  const { memoryTypeSelectedView, setMemoryType } = useAppStore();
  // console.log(memoryTypeSelectedView);
  return (
    <motion.div layout className="w-full pb-12 z-100">
      <motion.nav
        layout
        className="w-fit mx-auto bg-gray-100 rounded-4xl px-1 py-1 flex z-110"
      >
        {navItems.map((item) => (
          <motion.div
            layout
            key={item.title}
            className="w-full relative group text-center py-2 text-neutral-500 cursor-pointer px-8 hover:bg-gray-200 rounded-full transition-colors duration-300"
            onClick={() => setMemoryType(item.key)}
          >
            <motion.span
              layout
              className="relative whitespace-nowrap font-bold text-neutral-800 transition-colors duration-250 z-108"
            >
              {item.title}
            </motion.span>
            {memoryTypeSelectedView === item.key && (
              <motion.div
                layoutId="current"
                className="absolute inset-0 rounded-full w-full h-full bg-gray-300 z-105"
              ></motion.div>
            )}
          </motion.div>
        ))}
      </motion.nav>
    </motion.div>
  );
};

export default Navbar;

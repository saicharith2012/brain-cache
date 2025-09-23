// to navigate different types of memories in the dashboard
"use client";
import React, { useState } from "react";
import { motion } from "motion/react";

const navItems = [
  {
    title: "All Memories",
    key: "all",
  },
  {
    title: "Videos",
    key: "videos",
  },
  {
    title: "Tweets",
    key: "tweets",
  },
  {
    title: "Web pages",
    key: "pages",
  },
  {
    title: "Notes",
    key: "notes",
  },
  {
    title: "Documents",
    key: "documents",
  },
];

const Navbar = () => {
  const [hovered, setHovered] = useState<string | null>();
  const [current, setCurrent] = useState<string>("all");
  return (
    <motion.div layout className="w-full pb-12">
      <motion.nav
        layout
        className="w-fit mx-auto bg-gray-100 rounded-4xl px-2 py-1 flex"
      >
        {navItems.map((item) => (
          <motion.div
            layout
            key={item.title}
            onMouseEnter={() => setHovered(item.key)}
            onMouseLeave={() => setHovered(null)}
            className="w-full relative group text-center py-2 text-neutral-500 cursor-pointer px-8"
            onClick={() => setCurrent(item.key)}
          >
            <motion.span
              layout
              className="relative whitespace-nowrap font-bold text-neutral-800 transition-colors duration-250 z-108"
            >
              {item.title}
            </motion.span>
            {hovered === item.key && (
              <motion.div
                layoutId="hover"
                className="absolute inset-0 rounded-full w-full h-full bg-gray-200 z-100"
              ></motion.div>
            )}
            {current === item.key && (
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

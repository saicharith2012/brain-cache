import React from "react";
import { IconProps, IconSizeVariants } from "./IconTypes";

export default function ChevronLeft(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={props.strokeWidth || "1.5"}
      stroke="currentColor"
      className={IconSizeVariants[props.size]}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

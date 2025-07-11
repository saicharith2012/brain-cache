import { IconProps, IconSizeVariants } from "./IconTypes";

export default function HashtagIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="current"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={IconSizeVariants[props.size]}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
      />
    </svg>
  );
}

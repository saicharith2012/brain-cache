type IconSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";

export interface IconProps {
  size: IconSize;
  strokeWidth?: string;
}

export const IconSizeVariants: Record<IconSize, string> = {
  sm: "size-2",
  md: "size-3",
  lg: "size-4",
  xl: "size-5",
  "2xl": "size-6",
  "3xl": "size-8",
  "4xl": "size-10",
  "5xl": "size-12",
  "6xl": "size-16"
};

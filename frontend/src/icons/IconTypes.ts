type IconSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export interface IconProps {
  size: IconSize;
}

export const IconSizeVariants: Record<IconSize, string> = {
  sm: "size-2",
  md: "size-3",
  lg: "size-4",
  xl: "size-5",
  "2xl": "size-6",
  "3xl": "size-8"
};

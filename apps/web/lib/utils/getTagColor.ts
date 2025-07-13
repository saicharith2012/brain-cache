import { AVAILABLE_TAG_COLORS } from "../constants/colors";

export default function getTagColor() {
  const color =
    AVAILABLE_TAG_COLORS[
      Math.floor(Math.random() * AVAILABLE_TAG_COLORS.length)
    ];
  return color;
}

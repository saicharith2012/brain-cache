import { ContentType } from "@repo/common/config";

export const navItems = [
  { title: "All memories", key: "all", type: null },
  { title: "Videos", key: "videos", type: ContentType.youtube },
  { title: "Tweets", key: "tweets", type: ContentType.tweet },
  { title: "Web pages", key: "pages", type: ContentType.link },
  { title: "Notes", key: "notes", type: ContentType.note },
  { title: "PDFs", key: "documents", type: ContentType.document },
] as const;

export type MemoryViewType = (typeof navItems)[number]["key"];

export const MemoryViews = Object.fromEntries(
  navItems.map((navItem) => [navItem.key.toUpperCase(), navItem.key])
) as {
  [K in MemoryViewType as Uppercase<K>]: K;
};

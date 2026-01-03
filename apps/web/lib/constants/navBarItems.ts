export const navItems = [
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
] as const;

export type MemoryViewType = (typeof navItems)[number]["key"];

export const MemoryViews = Object.fromEntries(
  navItems.map((navItem) => [navItem.key.toUpperCase(), navItem.key])
) as {
  [K in MemoryViewType as Uppercase<K>]: K;
};

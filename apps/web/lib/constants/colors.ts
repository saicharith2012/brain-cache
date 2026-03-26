// Tag chip colours. Class strings are written out in full so Tailwind can find them.
export const TAG_COLOR_PALETTE: Record<string, string> = {
  slate: "text-slate-700 bg-slate-100 dark:text-slate-200 dark:bg-slate-400/15",
  gray: "text-gray-700 bg-gray-100 dark:text-gray-200 dark:bg-gray-400/15",
  zinc: "text-zinc-700 bg-zinc-100 dark:text-zinc-200 dark:bg-zinc-400/15",
  neutral: "text-neutral-700 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-400/15",
  stone: "text-stone-700 bg-stone-100 dark:text-stone-200 dark:bg-stone-400/15",
  red: "text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-400/15",
  orange: "text-orange-700 bg-orange-100 dark:text-orange-200 dark:bg-orange-400/15",
  amber: "text-amber-700 bg-amber-100 dark:text-amber-200 dark:bg-amber-400/15",
  yellow: "text-yellow-700 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-400/15",
  lime: "text-lime-700 bg-lime-100 dark:text-lime-200 dark:bg-lime-400/15",
  green: "text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-400/15",
  emerald: "text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-400/15",
  teal: "text-teal-700 bg-teal-100 dark:text-teal-200 dark:bg-teal-400/15",
  cyan: "text-cyan-700 bg-cyan-100 dark:text-cyan-200 dark:bg-cyan-400/15",
  sky: "text-sky-700 bg-sky-100 dark:text-sky-200 dark:bg-sky-400/15",
  blue: "text-blue-700 bg-blue-100 dark:text-blue-200 dark:bg-blue-400/15",
  indigo: "text-indigo-700 bg-indigo-100 dark:text-indigo-200 dark:bg-indigo-400/15",
  violet: "text-violet-700 bg-violet-100 dark:text-violet-200 dark:bg-violet-400/15",
  purple: "text-purple-700 bg-purple-100 dark:text-purple-200 dark:bg-purple-400/15",
  fuchsia: "text-fuchsia-700 bg-fuchsia-100 dark:text-fuchsia-200 dark:bg-fuchsia-400/15",
  pink: "text-pink-700 bg-pink-100 dark:text-pink-200 dark:bg-pink-400/15",
  rose: "text-rose-700 bg-rose-100 dark:text-rose-200 dark:bg-rose-400/15",
};

export const AVAILABLE_TAG_COLORS = Object.keys(TAG_COLOR_PALETTE);

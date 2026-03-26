import { MemoryViewType } from "lib/constants/navBarItems";
import { create } from "zustand";

export type MemoryLayout = "map" | "list";

interface Store {
  // sidebar (desktop: expanded or icon rail; mobile: drawer open or closed)
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;

  // create memory modal
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // how memories are shown, and which subset is in focus
  memoryLayout: MemoryLayout | null; // null until the viewer's preference is read
  setMemoryLayout: (layout: MemoryLayout) => void;
  memoryTypeSelectedView: MemoryViewType;
  setMemoryType: (memoryType: MemoryViewType) => void;
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;

  // the memory open in the side drawer
  selectedMemoryId: string | null;
  setSelectedMemoryId: (id: string | null) => void;

  // memories recalled by the latest answer
  citedContentIds: string[];
  setCitedContentIds: (ids: string[]) => void;
}

export const useAppStore = create<Store>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),

  isModalOpen: false,
  openModal: () => set({ isModalOpen: true, isMobileNavOpen: false }),
  closeModal: () => set({ isModalOpen: false }),

  memoryLayout: null,
  setMemoryLayout: (layout) => set({ memoryLayout: layout }),
  memoryTypeSelectedView: "all",
  setMemoryType: (memoryType) =>
    set({ memoryTypeSelectedView: memoryType, activeTag: null, isMobileNavOpen: false }),
  activeTag: null,
  setActiveTag: (tag) =>
    set({ activeTag: tag, memoryTypeSelectedView: "all", isMobileNavOpen: false }),

  selectedMemoryId: null,
  setSelectedMemoryId: (id) => set({ selectedMemoryId: id }),

  citedContentIds: [],
  setCitedContentIds: (ids) => set({ citedContentIds: ids }),
}));

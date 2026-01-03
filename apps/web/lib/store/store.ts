import { MemoryViewType } from "lib/constants/navBarItems";
import { create } from "zustand";

interface Store {
  // sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  // create memory modal
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // memory grid view based on types
  memoryTypeSelectedView: MemoryViewType;
  setMemoryType: (memoryType: MemoryViewType) => void;
}

export const useAppStore = create<Store>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  memoryTypeSelectedView: "all",
  setMemoryType: (memoryType) => set(() => ({memoryTypeSelectedView: memoryType})) 
}));

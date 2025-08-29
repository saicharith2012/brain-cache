import { create } from "zustand";

interface Store {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useAppStore = create<Store>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));

import { create } from "zustand";

type UIState = {
  isSidebarOpen: boolean;
  isMapLoading: boolean;
  activeModal: string | null;
  toggleSidebar: () => void;
  setMapLoading: (loading: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isMapLoading: false,
  activeModal: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setMapLoading: (loading) => set({ isMapLoading: loading }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));

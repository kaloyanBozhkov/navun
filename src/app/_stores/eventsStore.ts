import { create } from "zustand";

type EventsStore = {
  selectedCategory: string | null;
  searchQuery: string;
  setCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
};

export const useEventsStore = create<EventsStore>((set) => ({
  selectedCategory: null,
  searchQuery: "",
  setCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  reset: () => set({ selectedCategory: null, searchQuery: "" }),
}));

import { create } from "zustand";

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  role: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  role: null,
  setUser: (user) => set({ user, isAuthenticated: true, role: user.role }),
  clearUser: () => set({ user: null, isAuthenticated: false, role: null }),
}));

import { create } from "zustand";

interface NavbarState {
  showNavBar: boolean;
  setShowNavBar: (show: boolean) => void;
}

export const useNavBarStore = create<NavbarState>((set) => ({
  showNavBar: true,
  setShowNavBar: (show) => set({ showNavBar: show }),
}));

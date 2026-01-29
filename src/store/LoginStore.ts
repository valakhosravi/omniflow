import { create } from "zustand";

interface LoginStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useLoginStore = create<LoginStore>((set, get) => ({
  isOpen: false,
  onOpen: () => {
    set({ isOpen: true });
  },
  onClose: () => {
    set({ isOpen: false });
  },
  onOpenChange: (open: boolean) => {
    set({ isOpen: open });
  },
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";

type TransactionStore = {
  amount: number;
  setBalance: (value: number) => void;
  decreaseBalance: (value: number) => void;
  incrementBalance: (value: number) => void;
  resetState: () => void;
};

const useTransactionStore = create<TransactionStore>()(
  // persist(
  (set) => ({
    amount: 0,
    setBalance: (value) => set(() => ({ amount: value })),
    decreaseBalance: (value) =>
      set((state) => ({ amount: state.amount - value })),
    incrementBalance: (value) =>
      set((state) => ({ amount: state.amount + value })),
    resetState: () => set({ amount: 0 }),
  })
  // {
  //   name: "transaction-storage", // اسم کلید در localStorage
  // }
  // )
);

export default useTransactionStore;

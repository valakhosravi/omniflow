import { create } from "zustand";

interface FilterState {
  fromDate?: string;
  toDate?: string;
  processTypeId?: number;
  labelId?: number;
  StateCode?: number;

  setFilter: (
    key: keyof Omit<
      FilterState,
      "setFilter" | "resetFilters" | "applyFilters" | "appliedFilters"
    >,
    value: any
  ) => void;
  resetFilters: () => void;
  applyFilters: () => void;

  appliedFilters: {
    fromDate?: string;
    toDate?: string;
    processTypeId?: number;
    labelId?: number;
    StateCode?: number;
  };
}

const initialFilters = {
  FromDate: undefined,
  ToDate: undefined,
  ProcessTypeId: undefined,
  LabelId: undefined,
  StateCode: undefined,
};

export const useTaskStore = create<FilterState>((set, get) => ({
  FromDate: undefined,
  ToDate: undefined,
  ProcessTypeId: undefined,
  LabelId: undefined,
  StateCode: undefined,

  appliedFilters: { ...initialFilters },

  setFilter: (key, value) => set({ [key]: value }),

  applyFilters: () => {
    const currentState = get();
    const applied = {
      fromDate: currentState.fromDate,
      toDate: currentState.toDate,
      processTypeId: currentState.processTypeId,
      labelId: currentState.labelId,
      StateCode: currentState.StateCode,
    };

    set({ appliedFilters: applied });
  },

  // Reset all filters
  resetFilters: () =>
    set({
      ...initialFilters,
      appliedFilters: { ...initialFilters },
    }),
}));

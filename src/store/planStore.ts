import { DayData } from "@/context/WeeklyDataContext";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface RowType {
  id: number;
  selections: {
    food?: number[];
    appetizer?: number[];
    dessert?: number[];
    drink?: number[];
  };
  mealDate?: string;
}

interface WeekTab {
  key: string;
  title: string;
  date: string;
}

interface MetaData {
  name: string;
  fromDate: string;
  toDate: string;
}

interface PlanState {
  weeklyData: DayData[];
  weekTabs: WeekTab[];
  meta: MetaData;
  fromDate: string | null;
  toDate: string | null;
  name: string | null;
  selectedIndex: number;
  setWeeklyData: (data: DayData[]) => void;
  updateDayData: (index: number, dayData: DayData) => void;
  setWeekTabs: (tabs: WeekTab[]) => void;
  setMeta: (meta: MetaData) => void;
  setDateRange: (from: string, to: string, name: string) => void;
  setSelectedIndex: (index: number) => void;
  clearStore: () => void;
  isDataValid: (from: string, to: string) => boolean;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      weeklyData: [],
      weekTabs: [],
      meta: {
        name: "",
        fromDate: "",
        toDate: "",
      },
      fromDate: null,
      toDate: null,
      name: null,
      selectedIndex: 0,

      setWeeklyData: (data) => set({ weeklyData: data }),

      updateDayData: (index, dayData) =>
        set((state) => {
          const newData = [...state.weeklyData];
          newData[index] = dayData;
          return { weeklyData: newData };
        }),

      setWeekTabs: (tabs) => set({ weekTabs: tabs }),

      setMeta: (meta) => set({ meta }),

      setDateRange: (from, to, name) =>
        set({
          fromDate: from,
          toDate: to,
          name,
          meta: {
            name,
            fromDate: from,
            toDate: to,
          },
        }),

      setSelectedIndex: (index) => set({ selectedIndex: index }),

      clearStore: () =>
        set({
          weeklyData: [],
          weekTabs: [],
          meta: {
            name: "",
            fromDate: "",
            toDate: "",
          },
          fromDate: null,
          toDate: null,
          name: null,
          selectedIndex: 0,
        }),

      isDataValid: (from, to) => {
        const state = get();
        return state.fromDate === from && state.toDate === to;
      },
    }),
    {
      name: "plan-storage", // unique name for localStorage key
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage
      // If you want localStorage instead (persists after closing browser):
      // storage: createJSONStorage(() => localStorage),

      // Optional: Only persist specific fields
      partialize: (state) => ({
        weeklyData: state.weeklyData,
        weekTabs: state.weekTabs,
        meta: state.meta,
        fromDate: state.fromDate,
        toDate: state.toDate,
        name: state.name,
        selectedIndex: state.selectedIndex,
      }),
    }
  )
);

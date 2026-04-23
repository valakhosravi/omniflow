"use client";
import { createContext, useContext, useState } from "react";

export interface DayData {
  rows: {
    id: number;
    selections: {
      food: number[];
      appetizer: number[];
      dessert: number[];
      drink: number[];
    };
    mealDate: string;
  }[];
}

interface WeekTab {
  key: string;
  title: string;
}

interface WeeklyDataContextProps {
  weeklyData: DayData[];
  setWeeklyData: (data: DayData[]) => void;
  weekTabs: WeekTab[];
  setWeekTabs: (tabs: WeekTab[]) => void;
  meta: {
    name: string;
    fromDate: string;
    toDate: string;
  };
  setMeta: (meta: { name: string; fromDate: string; toDate: string }) => void;
}

const WeeklyDataContext = createContext<WeeklyDataContextProps | undefined>(
  undefined
);

export const WeeklyDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [weeklyData, setWeeklyData] = useState<DayData[]>([]);
  const [weekTabs, setWeekTabs] = useState<WeekTab[]>([]);
  const [meta, setMeta] = useState({
    name: "",
    fromDate: "",
    toDate: "",
  });

  return (
    <WeeklyDataContext.Provider
      value={{
        weeklyData,
        setWeeklyData,
        weekTabs,
        setWeekTabs,
        meta,
        setMeta,
      }}
    >
      {children}
    </WeeklyDataContext.Provider>
  );
};

export const useWeeklyData = () => {
  const context = useContext(WeeklyDataContext);
  if (!context) {
    throw new Error("useWeeklyData must be used within a WeeklyDataProvider");
  }
  return context;
};

"use client";
import { PlanData } from "@/models/food/plan/PlanEdit";
import { createContext, useContext, useState } from "react";

type PlanContextType = {
  planData: PlanData | null;
  setPlanData: (data: PlanData | null) => void;
  editIdData: number | null;
  setEditIdData: (id: number | null) => void;
  clearEditIdData: () => void;
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [editIdData, setEditIdData] = useState<number | null>(null);

  const clearEditIdData = () => setEditIdData(null);

  return (
    <PlanContext.Provider
      value={{
        planData,
        setPlanData,
        editIdData,
        setEditIdData,
        clearEditIdData,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlanContext must be used within a PlanProvider");
  }
  return context;
};

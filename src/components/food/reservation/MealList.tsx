import { Meal } from "@/models/food/plan/PlanEdit";
import { useState } from "react";
import MealCard from "./MealCard";
import Loading from "@/ui/Loading";

interface MealListProps {
  meals: Meal[];
}

export default function MealList({ meals }: MealListProps) {
  const [loadingStates, setLoadingStates] = useState<{ [id: number]: boolean }>(
    Object.fromEntries(meals.map((meal) => [meal.MealId, true]))
  );
  if (loadingStates) <Loading />;
  return (
    <>
      <h1 className="font-semibold text-[20px]/[28px] text-primary-950 mb-3">
        منوی غذایی
      </h1>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-4 max-h-[470px] mx-auto ${
          meals.length > 9 ? "overflow-y-auto pl-2" : ""
        }`}
      >
        {meals.map((meal: Meal) => (
          <MealCard
            key={meal.MealId}
            meal={meal}
            setLoadingStates={setLoadingStates}
          />
        ))}
      </div>
    </>
  );
}

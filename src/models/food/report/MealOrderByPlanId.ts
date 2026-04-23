export interface DailyOrders {
  Date: string;
  Selfs: SelfMeals[];
}

export interface SelfMeals {
  SelfName: string;
  BuildingName: string;
  Meals: Meal[];
}

export interface Meal {
  MealName: string;
  Count: number;
}

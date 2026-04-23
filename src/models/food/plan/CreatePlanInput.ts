export default interface CreatePlanInput {
  Name: string;
  FromDate: string;
  ToDate: string;
  DailyMeals: Meal[];
}

export interface Meal {
  MealId: number;
  MealDate: string;
}

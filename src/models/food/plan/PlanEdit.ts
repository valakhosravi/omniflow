export type Meal = {
  DailyMealId: number;
  MealId: number;
  MealName: string;
  SupplierName: string;
  SupplierId: number;
  MealType: number;
  MealDate: string;
  ImageAddress: string;
  Thumbnail: string;
  Price: number;
  Description: string;
};

export type PlanData = {
  PlanId: number;
  Name: string;
  FromDate: string;
  ToDate: string;
  DailyMeals: Meal[];
  CreatedDate: string;
};

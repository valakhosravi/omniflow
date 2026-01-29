export default interface OrderById {
  OrderId: number;
  PlanName: string;
  SelfName: string;
  SelfId: string;
  StartDate: string;
  EndDate: string;
  CreatedDate: string;
  DailyMealDetails: DailyMealDetails[];
}

export interface DailyMealDetails {
  DailyMealId: number;
  MealId: number;
  MealName: string;
  SupplierName: string;
  SupplierId: number;
  MealType: number;
  MealDate: string;
  Thumbnail: string;
  ImageAddress: string;
  Price: number;
  Description: string;
  Count: number;
  SelfId: number;
  SelfName: string;
}

export interface GetOrderByPlanId {
  [selfName: string]: OrderModel[];
}

export interface OrderModel {
  PersonnelId: number;
  FullName: string;
  Mobile: string;
  MealDate: string;
  MealName: string;
  SupplierName: string;
  SelfName: string;
  OrderCount: number;
}

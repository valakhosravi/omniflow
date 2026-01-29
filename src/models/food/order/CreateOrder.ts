export default interface CreateOrder {
  PlanId: number;
  OrderDetailItems: OrderDetailItems[];
}

export interface OrderDetailItems {
  DailyMealId: number;
  Count: number;
  SelfId: number;
}

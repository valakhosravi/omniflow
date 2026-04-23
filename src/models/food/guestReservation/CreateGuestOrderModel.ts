export interface CreateGuestOrderModel {
  PlanId: number;
  Description: string;
  SelfId: number;
  DailyMealId: number;
  Count: number;
}

export interface GetGuestOrder {
  GuestOrderId: number;
  PlanId: number;
  Description: string;
  DailyMealId: number;
  Count: number;
  MealDate: string;
  SelfId: number;
  SelfName: string;
  MealName: string;
}

export interface GetBuildings {
  BuildingId: number;
  Name: string;
}

export interface GetUnreservedPlansModel {
  PlanId: number;
  Name: string;
  FromDate: string;
  ToDate: string;
}

export interface GetGuestOrderPlansModel {
  PlanId: number;
  Name: string;
  FromDate: string;
  ToDate: string;
}

export interface GetGuestOrderByPlanIdModel {
  GuestOrderId: number;
  PlanId: number;
  Description: string;
  DailyMealId: number;
  Count: number;
  MealDate: string;
  SelfId: number;
  SelfName: string;
  MealName: string;
}

export interface SearchByFullNameModel {
  UserId: number;
  FullName: string;
  Title: string;
  PersonnelId: number;
}

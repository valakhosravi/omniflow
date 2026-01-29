export default interface OrderReservationModel {
  PlanId: number;
  PlanName: string;
  IsOpen: boolean;
  OrderId: number;
  FromDate: string;
  ToDate: string;
  IsReservable: boolean;
  PlanDays: planModel[];
}

export interface planModel {
  Day: string;
  SelfName: string;
  IsChangable: boolean;
  IsHoliday: boolean;
  HolidayDescription?: string;
  ReservationsDetails: reservationModel[];
}

export interface reservationModel {
  CreatedDate: string;
  OrderCount: number;
  MealName: string;
  MealType: string;
  SupplierId: number;
  SupplierName: string;
  OrderId: number;
  MealDate: string;
  Price?: number;
  Rating?: number;
  MealId: number;
  DailyMealId: number;
}

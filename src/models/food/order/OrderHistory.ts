export default interface OrderHistoryItem {
  OrderId: number;
  UserId: number;
  OrderCount: number;
  IsOpen: boolean;
  MealId: number;
  MealName: string;
  MealType: number;
  SupplierId: number;
  Price: number;
  SupplierName: string;
  MealDate: string;
  DailyMealId: number;
  SelfName: string;
  Rating: number | null;
}

export interface OrderHistoryData {
  Orders: OrderHistoryItem[];
  TotalCount: number;
  TotalPages: number;
}

export interface OrderHistoryResponse {
  Data: OrderHistoryData;
  ResponseCode: number;
  ResponseMessage: string;
}

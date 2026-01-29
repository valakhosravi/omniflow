export interface MealsideGetBySupplierIdModel {
  MealSideId: number;
  SupplierId: number;
  MealSideType: number;
  Name: string;
  ImageAddress: string;
  Price: number;
  IsActive: boolean;
  CreatedDate: string;
  Supplier: Supplier[];
}

export interface Supplier {
  SupplierId: number;
  Name: string;
  Address: string;
  Phone: string;
  CreatedDate: string;
}

export interface MealGetBySupplierIdModel {
  MealId: number;
  SupplierId: number;
  Name: string;
  ImageAddress: string;
  Thumbnail: string;
  Description?: string;
  Price: number;
  IsActive: boolean;
  CreatedDate: string;
  Supplier: Supplier[];
  MealType: number;
}

export interface Supplier {
  SupplierId: number;
  Name: string;
  Address: string;
  Phone: string;
  CreatedDate: string;
}

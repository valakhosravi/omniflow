export interface MealResponse {
  MealId: number;
  SupplierId: number | null;
  Name: string;
  ImageAddress?: string | null;
  Thumbnail?: string | null;
  Description?: string | null;
  Price?: number | null;
  IsActive: boolean;
  CreatedDate: string;
  Supplier: Suplier;
  MealType: number | null;
}

export interface Suplier {
  SupplierId: number;
  Name: string;
  Address: string;
  Phone: string;
  CreatedDate: string;
}

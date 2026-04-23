export interface CreateMealInput {
  Name: string;
  SupplierId: number | null;
  Description?: string | null;
  Price?: number | null;
  ImageFile: File | null;
  MealType: number | null;
}

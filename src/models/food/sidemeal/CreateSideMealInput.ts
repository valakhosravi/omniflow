export default interface CreateMealSideInput {
  Name: string;
  SupplierId: number | null;
  Price?: number | null;
  MealSideType: number | null;
  ImageFile: File | null;
}

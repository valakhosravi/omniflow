export default interface SideMealModel {
  MealSideId: number;
  SupplierId: number;
  Name: string;
  ImageAddress?: string | null;
  Price?: number | null;
  IsActive: boolean;
  CreatedDate: string;
  ImageFile: File | null;
}

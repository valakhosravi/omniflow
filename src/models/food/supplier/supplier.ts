export default interface SupplierModel {
  SupplierId: number;
  Name: string;
  Address?: string;
  Phone?: string;
  CreatedDate: string;
}

export interface SupplierListResponse {
  Items: SupplierModel[];
  TotalCount: number;
  PageSize: number;
  CurrentPage: number;
  TotalPages: number;
  HasPrevious: boolean;
  HasNext: boolean;
}

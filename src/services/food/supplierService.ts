import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import SupplierModel, {
  SupplierListResponse,
} from "@/models/food/supplier/supplier";
import PaginatedResponse from "@/models/food/paginated-response/paginated-response";
import http from "../httpService";
import CreateSupplierInput from "@/models/food/supplier/CreateSupplierInput";

export async function SupplierListApi(pageNumber: number, pageSize: number) {
  const { data } = await http.get<
    GeneralResponse<PaginatedResponse<SupplierModel[]>>
  >(
    `/api/admin/v2/food/management/supplier/GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
  return data;
}

export async function SupplierCreateApi(body: any) {
  const { data } = await http.post<GeneralResponse<CreateSupplierInput>>(
    "/api/admin/v2/food/management/supplier/create",
    body,
  );
  return data;
}

export async function SupplierEditApi(
  id: number,
  supplierData: SupplierListResponse,
) {
  const { data } = await http.put<GeneralResponse<null>>(
    `/api/admin/v2/food/management/supplier/edit/${id}`,
    supplierData,
  );
  return data;
}

export async function SupplierDeleteApi(id: number) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/admin/v2/food/management/supplier/delete/${id}`,
  );
  return data;
}

export async function SupplierGetByIdApi(id: number) {
  const { data } = await http.get<GeneralResponse<null>>(
    `/api/admin/v2/food/management/supplier/getById/${id}`,
  );
  return data;
}

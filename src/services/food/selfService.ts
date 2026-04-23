import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import SelfModel from "@/models/food/self/SelfModel";
import CreateSelfInput from "@/models/food/self/CreateSelfInput";
import http from "../httpService";
import PaginatedResponse from "@/models/food/paginated-response/paginated-response";

export async function getSelfListApi(pageNumber: number, pageSize: number) {
  const { data } = await http.get<
    GeneralResponse<PaginatedResponse<SelfModel[]>>
  >(
    `/api/admin/v2/food/management/Self/GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
  return data;
}

export async function DeleteSelfApi(id: number) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/admin/v2/food/management/Self/Delete/${id}`,
  );
  return data;
}

export async function CreateSelfApi(body: any) {
  const { data } = await http.post<GeneralResponse<CreateSelfInput>>(
    "/api/admin/v2/food/management/Self/Create",
    body,
  );
  return data;
}

export async function GetSelfByIdApi(id: number) {
  const { data } = await http.get<GeneralResponse<null>>(
    `/api/admin/v2/food/management/Self/GetById/${id}`,
  );
  return data;
}

export async function EditSelfApi(id: number, body: any) {
  const { data } = await http.put<GeneralResponse<SelfModel>>(
    `/api/admin/v2/food/management/Self/Edit/${id}`,
    body,
  );
  return data;
}

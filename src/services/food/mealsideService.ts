import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import SideMealModel from "@/models/food/sidemeal/SideMealModel";
import CreateMealSideInput from "@/models/food/sidemeal/CreateSideMealInput";
import convertToFormData from "@/utils/convertToFormData";
import http from "../httpService";
import PaginatedResponse from "@/models/food/paginated-response/paginated-response";
import { MealsideGetBySupplierIdModel } from "@/models/food/sidemeal/MealsideGetBySupplierIdModel";

export async function getMealSideListApi(pageNumber: number, pageSize: number) {
  const { data } = await http.get<
    GeneralResponse<PaginatedResponse<SideMealModel[]>>
  >(
    `/api/admin/v2/MealSide/GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
  return data;
}

export async function GetMealSideByIdApi(id: number) {
  const { data } = await http.get<GeneralResponse<null>>(
    `/api/admin/v2/MealSide/GetById/${id}`,
  );
  return data;
}

export async function CreateMealSideApi(data: CreateMealSideInput) {
  const formData = convertToFormData(data);
  return await http
    .post<
      GeneralResponse<CreateMealSideInput>
    >("/api/admin/v2/MealSide/Create", formData)
    .then(({ data }) => data);
}

export async function EditMealSideApi(id: number, body: any) {
  const formData = convertToFormData(body);
  const { data } = await http.put<GeneralResponse<SideMealModel>>(
    `/api/admin/v2/MealSide/Edit/${id}`,
    formData,
  );
  return data;
}

export async function DeleteMealSideApi(id: number) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/admin/v2/MealSide/Delete/${id}`,
  );
  return data;
}

export async function mealsideChangeStatusApi(id: number) {
  const { data } = await http.put<GeneralResponse<null>>(
    `/api/admin/v2/MealSide/ChangeStatus/${id}`,
  );
  return data;
}

export async function mealsideGetBySupplierId(id: number) {
  const { data } = await http.get<
    GeneralResponse<MealsideGetBySupplierIdModel>
  >(`/api/admin/v2/MealSide/GetBySupplierId/${id}`);
  return data;
}

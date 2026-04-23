import { CreateMealInput, MealResponse } from "@/models/food/meal/import";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import convertToFormData from "@/utils/convertToFormData";
import PaginatedResponse from "@/models/food/paginated-response/paginated-response";
import http from "../httpService";
import { MealGetBySupplierIdModel } from "@/models/food/meal/MealGetBySupplierIdModel";

export type SortField =
  | "Name"
  | "CreatedDate"
  | "MealType"
  | "SupplierId"
  | "Price";
export type SortType = "asc" | "desc";

export async function getMealListApi(
  pageNumber: number,
  pageSize: number,
  searchField?: string,
  searchValue?: string,
  sortField?: SortField,
  sortType?: SortType,
) {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  if (searchField && searchValue !== undefined && searchValue !== null) {
    params.append("searchField", searchField);
    params.append("searchValue", searchValue);
  }

  if (sortField && sortType) {
    params.append("sortField", sortField);
    params.append("sortType", sortType);
  }

  const url = `/api/admin/v2/food/management/Meal/GetAll?${params.toString()}`;

  const { data } =
    await http.get<GeneralResponse<PaginatedResponse<MealResponse>>>(url);

  return data;
}

export async function createMealApi(data: CreateMealInput) {
  const formData = convertToFormData(data);
  return http
    .post<
      GeneralResponse<MealResponse>
    >("/api/admin/v2/food/management/meal/create", formData)
    .then(({ data }) => data);
}

export async function deleteMealApi(id: number) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/admin/v2/food/management/Meal/delete/${id}`,
  );
  return data;
}

export async function editMealApi(id: number, mealData: MealResponse) {
  const formData = convertToFormData(mealData);
  const { data } = await http.put<GeneralResponse<null>>(
    `/api/admin/v2/food/management/Meal/edit/${id}`,
    formData,
  );
  return data;
}

export async function mealGetByIdApi(id: number) {
  const { data } = await http.get<GeneralResponse<MealResponse>>(
    `/api/admin/v2/food/management/Meal/getById/${id}`,
  );
  return data;
}

export async function mealChangeStatusApi(id: number) {
  const { data } = await http.put<GeneralResponse<null>>(
    `/api/admin/v2/food/management/Meal/ChangeStatus/${id}`,
  );
  return data;
}

export async function mealGetBySupplierId(id: number) {
  const { data } = await http.get<GeneralResponse<MealGetBySupplierIdModel[]>>(
    `/api/admin/v2/food/management/Meal/GetBySupplierId/${id}`,
  );
  return data;
}

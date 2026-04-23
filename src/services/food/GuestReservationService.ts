import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import http from "../httpService";
import {
  CreateGuestOrderModel,
  GetBuildings,
  GetGuestOrder,
  GetGuestOrderByPlanIdModel,
  GetGuestOrderPlansModel,
  GetUnreservedPlansModel,
  SearchByFullNameModel,
} from "@/models/food/guestReservation/CreateGuestOrderModel";
import PaginatedResponse from "@/models/food/paginated-response/paginated-response";

export async function createGuestOrder(orders: CreateGuestOrderModel[]) {
  const { data } = await http.post<GeneralResponse<null>>(
    "/api/v2/Food/Client/GuestOrder/Create",
    orders,
  );
  return data;
}

export async function getGuestOrders(pageNumber: number, pageSize: number) {
  const { data } = await http.get<
    GeneralResponse<PaginatedResponse<GetGuestOrder[]>>
  >(
    `/api/v2/Food/Client/GuestOrder/GetGuestOrders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
  return data;
}

export async function deleteGuestOrder(id: number) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/v2/Food/Client/GuestOrder/Delete/${id}`,
  );
  return data;
}

export async function getBuildings() {
  const { data } = await http.get<GeneralResponse<GetBuildings[]>>(
    `/api/admin/v2/Food/Management/Building/GetAll`,
  );
  return data;
}

export async function GetUnreservedPlans() {
  const { data } = await http.get<GeneralResponse<GetUnreservedPlansModel[]>>(
    `/api/v2/Food/Client/GuestOrder/GetUnreservedPlans`,
  );
  return data;
}

export async function GetGuestOrderPlanId(
  pageNumber: number,
  pageSize: number,
) {
  const { data } = await http.get<
    GeneralResponse<PaginatedResponse<GetGuestOrderPlansModel[]>>
  >(
    `/api/v2/Food/Client/GuestOrder/GetGuestOrderPlans?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
  return data;
}

export async function GetGuestOrdersByPlanId(id: number) {
  const { data } = await http.get<
    GeneralResponse<GetGuestOrderByPlanIdModel[]>
  >(`/api/v2/Food/Client/GuestOrder/GetGuestOrdersByPlanId/${id}`);
  return data;
}

export async function EditGuestOrder(
  id: number,
  orders: CreateGuestOrderModel[],
) {
  const { data } = await http.put<GeneralResponse<null>>(
    `/api/v2/Food/Client/GuestOrder/Edit/${id}`,
    orders,
  );
  return data;
}

export async function SearchByFullName(fullName: string) {
  const { data } = await http.get<GeneralResponse<SearchByFullNameModel[]>>(
    `/api/v2/User/BasicInfo/Account/SearchByFullName`,
    {
      params: { fullName },
    },
  );
  return data;
}

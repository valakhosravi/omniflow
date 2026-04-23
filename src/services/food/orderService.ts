import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import http from "../httpService";
import CreateOrder from "@/models/food/order/CreateOrder";
import PaginatedResponse from "@/models/food/paginated-response/paginated-response";
import OrderModel from "@/models/food/order/OrderModel";
import OrderById from "@/models/food/order/OrderById";
import OrderReservationModel from "@/models/food/order/OrderReservation";
import OrderDelete from "@/models/food/order/OrderDelete";
import { MealOrder } from "@/models/food/order/MealOrder";
import CloseOrder from "@/models/food/order/CloseOrder";

export async function getOrderListApi(pageNumber: number, pageSize: number) {
  const { data } = await http.get<
    GeneralResponse<PaginatedResponse<OrderModel[]>>
  >(
    `/api/v2/food/client/Order/GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
  return data;
}

export async function CreateOrderApi(body: CreateOrder) {
  const { data } = await http.post<GeneralResponse<CreateOrder>>(
    "/api/v2/food/client/Order/Create",
    body,
  );
  return data;
}

export async function DeleteOrderApi(id: number, body: OrderDelete[]) {
  const { data } = await http.post<GeneralResponse<null>>(
    `/api/v2/food/client/order/Delete`,
    {
      OrderId: id,
      DailyMealIds: body.map((item) => item.DailyMealId),
    },
  );
  return data;
}

export async function DeleteUserOrderCascadeApi(id: number) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/admin/v2/Food/Management/Order/DeleteUserOrderCascade/${id}`,
  );
  return data;
}

export async function GetOrderByIdApi({ id }: { id: number }) {
  const { data } = await http.get<GeneralResponse<OrderById>>(
    `/api/v2/food/Client/Order/GetOrderById/${id}`,
  );
  return data;
}

export async function EditOrderApi(id: number, body: CreateOrder) {
  const { data } = await http.put<GeneralResponse<CreateOrder>>(
    `/api/v2/food/client/Order/Edit/${id}`,
    body,
  );
  return data;
}

export async function getReservationApi() {
  const { data } = await http.get<GeneralResponse<OrderReservationModel[]>>(
    `/api/v2/food/client/Order/GetReservations`,
  );
  return data;
}

export async function getOrderByPlanIdAndDate(
  PlanId: number,
  OrderDate: string,
) {
  const { data } = await http.get<GeneralResponse<MealOrder[]>>(
    `/api/v2/Food/Client/Order/GetOrderByPlanIdAndDate?PlanId=${PlanId}&OrderDate=${OrderDate}`,
  );
  return data;
}

export async function getOrderByPlanIdAndDateForUser(
  PlanId: number,
  OrderDate: string,
  userId: number,
) {
  const { data } = await http.get<GeneralResponse<MealOrder[]>>(
    `/api/v2/Food/Client/Order/GetOrderByPlanIdAndDateForUser?PlanId=${PlanId}&OrderDate=${OrderDate}&userId=${userId}`,
  );
  return data;
}

export async function CloseOrderApi(body: CloseOrder) {
  const { data } = await http.post<GeneralResponse<null>>(
    "/api/v2/Food/Client/Order/Close",
    body,
  );
  return data;
}

export async function CloseOrderByUserIdApi(userId: number, body: CloseOrder) {
  const { data } = await http.post<GeneralResponse<null>>(
    `/api/v2/Food/Client/Order/CloseForUser?userId=${userId}`,
    body,
  );
  return data;
}

export async function GetReservationsForUser(userId: number) {
  const { data } = await http.get<GeneralResponse<OrderReservationModel[]>>(
    `/api/v2/Food/Client/Order/GetReservationsForUser`,
    {
      params: { userId },
    },
  );
  return data;
}

export async function CreatOrderForUser(userId: number, body: CreateOrder) {
  const { data } = await http.post<GeneralResponse<CreateOrder>>(
    `/api/v2/Food/Client/Order/CreateForUser?userId=${userId}`,
    body,
  );
  return data;
}

import GeneralResponse from "@/models/general-response/general_response";
import http from "../httpService";
import { GetOrderByPlanId } from "@/models/food/report/OrderByPlanId";
import { DailyOrders } from "@/models/food/report/MealOrderByPlanId";

export async function GetOrderByPlanIdApi(planId: number) {
  const { data } = await http.get<GeneralResponse<GetOrderByPlanId>>(
    `/api/admin/v2/Food/Management/Report/GetOrderReportByPlanId/${planId}`
  );
  return data;
}

export async function GetMealOrderByPlanIdApi(planId: number) {
  const { data } = await http.get<GeneralResponse<DailyOrders[]>>(
    `/api/admin/v2/Food/Management/Report/GetMealOrdersReportByPlanId/${planId}`
  );
  return data;
}

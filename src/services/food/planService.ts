import GeneralResponse from "@/models/general-response/general_response";
import http from "../httpService";
import PaginatedResponse from "@/models/paginated-response/paginated-response";
import PlanModel from "@/models/food/plan/PlanModel";
import CreatePlanInput from "@/models/food/plan/CreatePlanInput";
import { PlanData } from "@/models/food/plan/PlanEdit";
import PlanSummary from "@/models/food/plan/PlanSummary";
import ActivePlanDate from "@/models/food/plan/ActivePlanDate";
import PlanOrder from "@/models/food/plan/PlanOrder";

export async function getPlanListApi(pageNumber: number, pageSize: number) {
  const { data } = await http.get<
    GeneralResponse<PaginatedResponse<PlanModel[]>>
  >(
    `/api/admin/v2/food/management/Plan/GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return data;
}

export async function DeletePlanApi(id: number) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/admin/v2/food/management/Plan/Delete/${id}`
  );
  return data;
}

export async function CreatePlanApi(body: any) {
  const { data } = await http.post<GeneralResponse<CreatePlanInput>>(
    "/api/admin/v2/food/management/Plan/Create",
    body
  );
  return data;
}

export async function planChangeStatusApi(id: number) {
  const { data } = await http.put<GeneralResponse<null>>(
    `/api/admin/v2/food/management/Plan/ChangeStatus/${id}`
  );
  return data;
}

export async function EditPlanApi(id: number, body: any) {
  const { data } = await http.put<GeneralResponse<PlanModel>>(
    `/api/admin/v2/food/management/Plan/Edit/${id}`,
    body
  );
  return data;
}

export async function GetPlanByIdApi(id: number) {
  const { data } = await http.get<GeneralResponse<PlanData>>(
    `/api/admin/v2/food/management/Plan/GetById/${id}`
  );
  return data;
}

export async function GetNextPlan() {
  const { data } = await http.get<GeneralResponse<PlanData>>(
    `/api/admin/v2/food/management/Plan/GetNextPlan`
  );
  return data;
}

export async function GetPlanOrderSummaryApi(planId: number, fullname?: string) {
  const params = new URLSearchParams();
  if (fullname) {
    params.append('fullname', fullname);
  }
  
  const { data } = await http.get<GeneralResponse<PlanOrder[]>>(
    `/api/admin/v2/Food/Management/Plan/GetOrders/${planId}?${params.toString()}`
  );
  return data;
}

export async function GetActivePlanDatesApi() {
  const { data } = await http.get<GeneralResponse<ActivePlanDate[]>>(
    `/api/admin/v2/food/management/Plan/GetActivePlanDates`
  );
  return data;
}

import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import http from "../httpService";
import { holidayGetallModel } from "@/models/food/holiday/holidayGetallModel";
import createHolidayModel from "@/models/food/holiday/createHolidayModel";
import { holidayGetFromToModel } from "@/models/food/holiday/holidayGetFromToModel";

export async function holidayGetallApi() {
  const { data } = await http.get<GeneralResponse<holidayGetallModel[]>>(
    `/api/admin/food/management/v2/Holiday/GetAll`,
  );
  return data;
}

export async function CreateHolidayApi(body: createHolidayModel) {
  const { data } = await http.post<GeneralResponse<createHolidayModel>>(
    `/api/admin/v2/food/management/Holiday/Create`,
    body,
  );
  return data;
}

export async function DeleteHolidayApi(date: string) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/admin/v2/food/management/Holiday/DeleteByDate?HolidayDate=${date}`,
  );
  return data;
}

export async function holidayGetFromAndToApi(from: string, to: string) {
  const { data } = await http.get<GeneralResponse<holidayGetFromToModel[]>>(
    `/api/admin/v2/food/management/Holiday/GetFromAndToDate?from=${from}&to=${to}`,
  );
  return data;
}

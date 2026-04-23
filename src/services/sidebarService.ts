import { MenuRequest } from "@/models/menu/import";
import http from "./httpService";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";

export async function getSidebarApi() {
  const { data } = await http.get<GeneralResponse<MenuRequest[]>>(
    "/api/v2/site/setting/menu/get",
  );
  return data;
}

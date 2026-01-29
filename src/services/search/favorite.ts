import GeneralResponse from "@/models/general-response/general_response";
import http from "../httpService";
import favoriteModel from "@/models/search/favoriteModel";
import favRequestUpdate from "@/models/search/favRequestUpdate";
import createFavoriteInput from "@/models/search/createFavoriteInput";
import favEditRequest from "@/models/search/favEditRequest";

export async function getFavoriteListApi() {
  const { data } = await http.get<GeneralResponse<favoriteModel[]>>(
    `/api/v2/site/setting/Favorite/GetAll`
  );
  return data;
}

export async function updateFavoriteApi(body: favRequestUpdate) {
  const { data } = await http.put<GeneralResponse<null>>(
    `/api/v2/site/setting/Favorite/UpdateOrder`,
    body
  );
  return data;
}

export async function CreateSearchUrlApi(body: any) {
  const { data } = await http.post<GeneralResponse<createFavoriteInput>>(
    "/api/v2/site/setting/Favorite/Create",
    body
  );
  return data;
}

export async function DeleteFavoriteApi(id: number) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/v2/site/setting/Favorite/Delete/${id}`
  );
  return data;
}

export async function EditFavoriteApi(id: number, body: favEditRequest) {
  const { data } = await http.put<GeneralResponse<null>>(
    `/api/v2/site/setting/Favorite/Edit/${id}`,
    body
  );
  return data;
}

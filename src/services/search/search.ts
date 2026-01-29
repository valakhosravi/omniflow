import searchResponseModel from "@/models/search/searchResponseModel";
import http from "../httpService";
import searchRequestModel from "@/models/search/searchRequestModel";
import GeneralResponse from "@/models/general-response/general_response";
import urlSearchResponseModel from "@/models/search/urlSearchResponse";

export async function searchApi(body: searchRequestModel) {
  const { data } = await http.post<searchResponseModel[]>("/api/search", body);
  return data;
}

export async function searchUrlApi(url: string) {
  const { data } = await http.get<GeneralResponse<urlSearchResponseModel>>(
    `/api/v2/site/setting/menu/GetByUrl?url=${url}`
  );
  return data;
}

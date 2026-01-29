import http from "@/services/httpService";
import GeneralResponse from "@/models/general-response/general_response";
import { EmployeeDetailItem } from "@/models/employmentCertificate/human-resource/EmployeeDetailItem";
import { EmployeeRequestDetail } from "@/models/employmentCertificate/human-resource/EmployeeRequestDetail";

export async function GetBasicInfoByPersonnelId(personnelId: string) {
  const { data } = await http.get<GeneralResponse<EmployeeDetailItem>>(
    `/api/v2/humanresource/personnel/basicinfo/getbypersonnelid?personnelId=${personnelId}`
  );
  return data;
}

export async function GetByRequestId(requestId: number) {
  const { data } = await http.get<GeneralResponse<EmployeeRequestDetail>>(
    `/api/v2/humanresource/request/employmentrequest/GetByRequestId?requestId=${requestId}`
  );
  return data;
}

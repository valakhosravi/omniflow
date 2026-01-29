import { GetTask } from "@/models/camunda-process/GetNextTask";
import { ProcessInstance } from "@/models/camunda-process/StartProcess";
import { GetUserRequests } from "@/models/camunda-process/GetRequests";
import GeneralResponse from "@/models/general-response/general_response";
import { Pagination } from "@/models/general-response/pagination";
import { TaskFilter } from "@/constants/task-filter";
import { GetRequestsByInstanceIds } from "@/models/camunda-process/GetRequestsByInstanceIds";
import http from "../httpService";
import { ClearRequestBody } from "@/models/camunda-process/ClearRequestBody";

export interface StartProcessInput {
  defenitionId: string;
  body: any;
}

export async function startProcess({ defenitionId, body }: StartProcessInput) {
  const { data } = await http.post<ProcessInstance>(
    `/api-camunda/api/process-definition/${defenitionId}/start`,
    body
  );
  return data;
}

export async function getTasksByFilter(type: TaskFilter, value: string) {
  const { data } = await http.get<GetTask[]>(
    `/api-camunda/api/task?${type}=${value}`
  );
  return data;
}

export async function getNextTask(instancId: string) {
  const { data } = await http.get<GetTask[]>(
    `/api-camunda/api/task?processInstanceId=${instancId}`
  );
  return data;
}

export async function completeTask(taskId: string, body: any) {
  const { data, status } = await http.post(
    `/api-camunda/api/task/${taskId}/complete`,
    body
  );
  return { data, status };
}

export async function GetRequestsService(
  pageNumber: number = 1,
  pageSize: number = 10
) {
  const { data } = await http.get<GeneralResponse<Pagination<GetUserRequests>>>(
    `/api/v2/process/operation/request/GetRequests?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );

  return { data };
}

export async function getRequestsByInstanceIDsService(
  ids: string[],
  pageNumber: number = 1,
  pageSize: number = 10,
  hasSnooze: boolean = false
) {
  const { data } = await http.post<
    GeneralResponse<Pagination<GetRequestsByInstanceIds>>
  >(
    `/api/v2/process/operation/request/GetRequestsByInstanceIds?pageNumber=${pageNumber}&pageSize=${pageSize}&hasSnooze=${hasSnooze}`,
    {
      InstanceIds: ids,
    }
  );
  return { data };
}

export async function clearRequestApi(data: ClearRequestBody) {
  return http
    .post<GeneralResponse<null>>(`/api-camunda/api/message`, data)
    .then(({ data }) => data);
}

export async function claimTaskByTaskId(taskId: string, body: any) {
  const { data, status } = await http.post(
    `/api-camunda/api/task/${taskId}/claim`,
    body
  );
  return { data, status };
}

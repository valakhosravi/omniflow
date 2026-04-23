import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { GetUserRequests } from "@/models/camunda-process/GetRequests";
import { GetRequestsByInstanceIds } from "@/models/camunda-process/GetRequestsByInstanceIds"; // Add this import
import { Pagination } from "@/models/general-response/pagination";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { GetProcessTypesModel } from "../types/GetProcessTypesModel";
import { CompletedTask } from "@/models/camunda-process/GetCompletedTasks";

// Define the get requests query parameters interface
interface GetRequestsParams {
  pageNumber: number;
  pageSize: number;
  SortColumn?:
  | "RequestId"
  | "InstanceId"
  | "IsTerminated"
  | "PersonnelId"
  | "TerminatedDate"
  | "CreatedDate"
  | "ProcessTypeName"
  | "StatusName"
  | "FullName"
  | "Title"
  | "TrackingCode"
  | "LabelId"
  | "LabelColor"
  | "LabelName"
  | "StatusDate"
  | "IsRead"
  | "CanBeCanceled";
  SortDirection?: "ASC" | "DESC";
}

// Define the search request interface
interface SearchRequestParams {
  Title?: string;
  ProcessTypeId?: number;
  LabelId?: number;
  FromDate?: string;
  ToDate?: string;
  IsTerminate?: boolean;
  pageNumber: number;
  pageSize: number;
}

// Define the add request to label interface
interface AddRequestToLabelParams {
  LabelId: number;
  RequestId: number;
}

// Add this interface after the existing interfaces
interface GetRequestsByInstanceIdsParams {
  ids: string[];
  pageNumber: number;
  pageSize: number;
  hasSnooze: boolean;
}

export type VerifyTaskPermissionRequest = {
  Groups?: string[],
  TaskId: string,
  PersonnelId: string
}

export type VerifyTaskPermissionResponse = {
  IsActive: boolean,
  Values: {
    Type: "assignee" | "candidate";
    Value: string;
  }[];
}



export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["request"],
  endpoints: (builder) => ({
    getRequests: builder.query<
      GeneralResponse<Pagination<GetUserRequests>>,
      GetRequestsParams
    >({
      query: ({ pageNumber, pageSize, ...filters }) => {
        const queryString = Object.entries({ pageNumber, pageSize, ...filters })
          .filter(([, value]) => value !== undefined && value !== null)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&");

        return {
          url: `/v2/Process/Operation/Request/GetRequests?${queryString}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "request", id: "LIST" }],
    }),
    searchRequests: builder.mutation<
      GeneralResponse<Pagination<GetUserRequests>>,
      SearchRequestParams
    >({
      query: (body) => ({
        url: "/v2/Process/Operation/Request/SearchRequest",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      }),
    }),
    addRequestToLabel: builder.mutation<
      GeneralResponse<any>,
      AddRequestToLabelParams
    >({
      query: (body) => ({
        url: "/v2/Process/Operation/Request/AddRequestToLabel",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      }),
    }),
    getProcessTypes: builder.query<
      GeneralResponse<GetProcessTypesModel[]>,
      void
    >({
      query: () => ({
        url: `/v2/Process/Operation/Request/GetProcessTypes`,
        method: "GET",
      }),
    }),
    getRequestsByInstanceIds: builder.mutation<
      GeneralResponse<Pagination<GetRequestsByInstanceIds>>,
      GetRequestsByInstanceIdsParams
    >({
      query: ({ ids, pageNumber, pageSize, hasSnooze }) => ({
        url: `/v2/Process/Operation/Request/GetRequestsByInstanceIds?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "POST",
        body: {
          InstanceIds: ids,
          hasSnooze,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      }),
    }),
    getCompletedTasks: builder.query<
      GeneralResponse<CompletedTask[]>,
      GetRequestsParams
    >({
      query: ({ pageNumber, pageSize, ...filters }) => ({
        url: `/v2/Process/Operation/Request/GetCompletedTasks?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
        params: {
          pageNumber,
          pageSize,
          ...filters,
        },
      }),
      providesTags: [{ type: "request", id: "COMPLETED_TASKS" }],
    }),

    verifyTaskPermission: builder.mutation<GeneralResponse<VerifyTaskPermissionResponse>, VerifyTaskPermissionRequest>({
      query: (body) => ({
        url: `/v1/Process/Operation/Authorization/VerifyTaskPermission`,
        method: "POST",
        body,
      }),
    }),
    taskInvolvementChecker: builder.query<GeneralResponse<boolean>, string>({
      query: (requestId) => ({
        url: `/v1/Process/Operation/Authorization/TaskInvolvementChecker?requestId=${requestId}`,
        method: "GET",
      }),
    }),
   

  }),
});

export const {
  useGetRequestsQuery,
  useSearchRequestsMutation,
  useAddRequestToLabelMutation,
  useGetProcessTypesQuery,
  useGetRequestsByInstanceIdsMutation,
  useGetCompletedTasksQuery,
  useVerifyTaskPermissionMutation,
  useTaskInvolvementCheckerQuery,

} = requestApi;

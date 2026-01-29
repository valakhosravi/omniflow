import { baseQuery, baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  GetRequestTimelineModel,
  GetUserRequests,
} from "@/models/camunda-process/GetRequests";
import { GetRequestsByInstanceIds } from "@/models/camunda-process/GetRequestsByInstanceIds"; // Add this import
import { Pagination } from "@/models/general-response/pagination";
import GeneralResponse from "@/models/general-response/general_response";
import { GetProcessTypesModel } from "../types/GetProcessTypesModel";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import { GetRequestById } from "@/models/camunda-process/GetRequests";
import { CompletedTask } from "@/models/camunda-process/GetCompletedTasks";
import {
  GetProcessByNameAndVersionParams,
  GetProcessByNameAndVersionResponse,
} from "@/models/camunda-process/GetProcessByNameAndVersion";

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

interface CreateSnoozeRequest {
  RequestId: number;
  SnoozeDate: string;
}

// Add this interface after the existing interfaces
interface GetRequestsByInstanceIdsParams {
  ids: string[];
  pageNumber: number;
  pageSize: number;
  hasSnooze: boolean;
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
          .filter(([_, value]) => value !== undefined && value !== null)
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
    getLastRequestStatus: builder.query<
      GeneralResponse<GetLastRequestStatus>,
      number
    >({
      query: (requestId) => ({
        url: `/v2/Process/Operation/Request/GetLastRequestStatus/${requestId}`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [
        { type: "request", id: `status-${requestId}` },
      ],
    }),
    getRequestById: builder.query<GeneralResponse<GetRequestById>, number>({
      query: (id) => ({
        url: `/v2/Process/Operation/Request/GetByRequestId/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "request", id: `request-${id}` },
      ],
    }),
    getLastProcessByName: builder.query<
      GeneralResponse<GetProcessByNameAndVersionResponse>,
      string
    >({
      query: (processName) => ({
        url: `/v1/Process/Operation/Execution/GetLastActiveProcessByName?processName=${encodeURIComponent(
          processName
        )}`,
        method: "GET",
        headers: {
          Accept: "text/plain",
        },
      }),
      providesTags: (result, error, processName) => [
        { type: "request", id: `last-process-${processName}` },
      ],
    }),
    getProcessByNameAndVersion: builder.query<
      GeneralResponse<GetProcessByNameAndVersionResponse>,
      GetProcessByNameAndVersionParams
    >({
      query: ({ processName, version }) => ({
        url: `/v2/Process/Operation/Execution/GetProcessByNameAndVersion?processName=${encodeURIComponent(
          processName
        )}&version=${encodeURIComponent(version)}`,
        method: "GET",
      }),
      providesTags: (result, error, { processName, version }) => [
        { type: "request", id: `process-${processName}-${version}` },
      ],
    }),
    getRequestTimeline: builder.query<
      GeneralResponse<GetRequestTimelineModel[]>,
      number
    >({
      query: (requestId) => ({
        url: `/v2/Process/Operation/Request/GetTimeline/${requestId}`,
        method: "GET",
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
  }),
});

export const {
  useGetRequestsQuery,
  useSearchRequestsMutation,
  useAddRequestToLabelMutation,
  useGetProcessTypesQuery,
  useGetRequestsByInstanceIdsMutation,
  useGetLastRequestStatusQuery,
  useGetRequestByIdQuery,
  useGetProcessByNameAndVersionQuery,
  useGetLastProcessByNameQuery,
  useGetRequestTimelineQuery,
  useLazyGetRequestTimelineQuery,
  useGetCompletedTasksQuery,
} = requestApi;

import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import {
  ApplicationResponse,
  BugInfoResponse,
  BugReasonResponse,
  BugResponse,
  FeatureResponse,
} from "./Bug.types";

export const bugFixApi = createApi({
  reducerPath: "bugFixApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Application", "BugReason", "BugRequest", "BugStatus", "Feature"],
  endpoints: (builder) => ({
    getAllApplications: builder.query<
      GeneralResponse<ApplicationResponse[]>,
      void
    >({
      query: () => ({
        url: "/V1/Support/Bug/Application/GetAll",
        method: "GET",
      }),
      providesTags: ["Application"],
    }),
    getAllBugReasons: builder.query<GeneralResponse<BugReasonResponse[]>, void>(
      {
        query: () => ({
          url: "/V1/Support/Bug/Reason/GetAll",
          method: "GET",
        }),
        providesTags: ["BugReason"],
      },
    ),
    getBugRequestById: builder.query<GeneralResponse<BugResponse>, number>({
      query: (id) => ({
        url: `/V1/Support/Bug/Request/GetById/${id}`,
        method: "GET",
      }),
      providesTags: (__result, __error, id) => [{ type: "BugRequest", id }],
    }),
    getBugInfoByRequestId: builder.query<
      GeneralResponse<BugInfoResponse>,
      {
        requestId: string;
        processName: string;
        trackingCode: string;
      }
    >({
      query: ({ requestId, processName, trackingCode }) => ({
        url: `/V1/Support/Bug/Request/GetInfoByProcessRequestId?processRequestId=${requestId}`,
        method: "GET",
        headers: {
          "X-Tracking-Code": trackingCode,
          "X-Process-Name": processName,
        },
      }),
      providesTags: (_result, _error, { requestId }) => [
        { type: "BugRequest", id: requestId },
      ],
    }),
    getFeaturesByApplicationId: builder.query<
      GeneralResponse<FeatureResponse[]>,
      number
    >({
      query: (applicationId) => ({
        url: `/V1/Support/Bug/Feature/GetByApplicationId?applicationId=${applicationId}`,
        method: "GET",
      }),
      providesTags: ["Feature"],
    }),
  }),
});
export const {
  useGetAllApplicationsQuery,
  useGetAllBugReasonsQuery,
  useLazyGetAllBugReasonsQuery,
  useGetBugRequestByIdQuery,
  useGetBugInfoByRequestIdQuery,
  useGetFeaturesByApplicationIdQuery,
} = bugFixApi;

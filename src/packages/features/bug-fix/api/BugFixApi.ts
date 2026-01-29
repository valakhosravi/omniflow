import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import GeneralResponse from "@/packages/core/types/api/general_response";
import {
  ApplicationResponse,
  BugInfoResponse,
  BugReasonResponse,
  BugResponse,
  FeatureResponse,
} from "../BugFix.types";

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
      }
    ),
    getBugRequestById: builder.query<GeneralResponse<BugResponse>, number>({
      query: (id) => ({
        url: `/V1/Support/Bug/Request/GetById/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "BugRequest", id }],
    }),
    getBugInfoByRequestId: builder.query<
      GeneralResponse<BugInfoResponse>,
      number
    >({
      query: (requestId) => ({
        url: `/V1/Support/Bug/Request/GetInfoByProcessRequestId?processRequestId=${requestId}`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [
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
  useGetBugRequestByIdQuery,
  useGetBugInfoByRequestIdQuery,
  useGetFeaturesByApplicationIdQuery,
} = bugFixApi;

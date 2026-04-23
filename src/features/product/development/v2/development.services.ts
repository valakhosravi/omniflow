import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CreateJiraIssueRequest,
  DevelopmentRequestDetailsResponse,
  GetUsernameByPersonnelId,
} from "./development.types";

export const developmentApi = createApi({
  reducerPath: "developmentDetailsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["developRequestDetails"],
  endpoints: (builder) => ({
    getDevelopmentDetails: builder.query<
      GeneralResponse<DevelopmentRequestDetailsResponse>,
      { requestId: number; trackingCode: string; processName: string }
    >({
      query: ({ requestId, trackingCode, processName }) => ({
        url: `/v1/Product/Develop/Request/GetByProcessRequestId?processRequestId=${requestId}`,
        method: "GET",
        headers: {
          "X-Tracking-Code": trackingCode,
          "X-Process-Name": processName,
        },
      }),
      providesTags: (_result, _error, { requestId }) => [
        { type: "developRequestDetails", id: requestId },
      ],
    }),
    createJiraIssue: builder.mutation<
      GeneralResponse<null>,
      {
        body: CreateJiraIssueRequest;
        trackingCode: string;
        processName: string;
      }
    >({
      query: ({ body, trackingCode, processName }) => ({
        url: `/v4/Process/Jira/Issue/Create`,
        method: "POST",
        body,
        headers: {
          "X-Tracking-Code": trackingCode,
          "X-Process-Name": processName,
        },
      }),
    }),
    getUsernameByPersonnelId: builder.query<
      GeneralResponse<GetUsernameByPersonnelId>,
      { PersonnelId: number; Department: string }
    >({
      query: ({ PersonnelId, Department }) => ({
        url: `/v2/Process/Jira/User/GetUsernameByPersonnelId?PersonnelId=${PersonnelId}&Department=${encodeURIComponent(
          Department,
        )}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetDevelopmentDetailsQuery,
  useCreateJiraIssueMutation,
  useLazyGetUsernameByPersonnelIdQuery,
} = developmentApi;

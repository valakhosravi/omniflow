import GeneralResponse from "@/packages/core/types/api/general_response";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CreateRequest,
  CreateReportRequest,
  CreateJiraIssueRequest,
  GetGroupUsersByPropertyDetails,
  GetStackHolder,
  GetUsernameByPersonnelId,
  GroupMemebers,
  JiraPropertyTypes,
  PersonnelIdProperty,
  StackHolderDirectorDetails,
} from "../types/JiraTypes";

export const jiraApi = createApi({
  reducerPath: "jiraApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["JiraIssue", "JiraUser", "StackHolder"],
  endpoints: (builder) => ({
    createIssue: builder.mutation<GeneralResponse<null>, CreateRequest>({
      query: (body) => ({
        url: `/v1/Process/Jira/Issue/Create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["JiraIssue"],
    }),
    createJiraIssue: builder.mutation<
      GeneralResponse<null>,
      CreateJiraIssueRequest
    >({
      query: (body) => ({
        url: `/v4/Process/Jira/Issue/Create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["JiraIssue"],
    }),

    reportCreate: builder.mutation<GeneralResponse<null>, CreateReportRequest>({
      query: (body) => ({
        url: `/v1/Process/Jira/Issue/ReportCreate`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["JiraIssue"],
    }),
    getGroupUsers: builder.query<
      GeneralResponse<GroupMemebers>,
      { Department: string }
    >({
      query: ({ Department }) => ({
        url: `/v1/Process/Jira/User/GetGroupUsers?Department=${encodeURIComponent(
          Department
        )}`,
        method: "GET",
      }),
      providesTags: ["JiraUser"],
    }),
    getPersonnelIdProperty: builder.query<
      GeneralResponse<PersonnelIdProperty>,
      { Username: string }
    >({
      query: ({ Username }) => ({
        url: `/v1/Process/Jira/User/GetPersonnelIdProperty?Username=${encodeURIComponent(
          Username
        )}`,
        method: "GET",
      }),
      providesTags: ["JiraUser"],
    }),
    getUsernameByPersonnelId: builder.query<
      GeneralResponse<GetUsernameByPersonnelId>,
      { PersonnelId: number; Department: string }
    >({
      query: ({ PersonnelId, Department }) => ({
        url: `/v2/Process/Jira/User/GetUsernameByPersonnelId?PersonnelId=${PersonnelId}&Department=${encodeURIComponent(
          Department
        )}`,
        method: "GET",
      }),
      providesTags: ["JiraUser"],
    }),
  }),
});

export const {
  useCreateIssueMutation,
  useCreateJiraIssueMutation,
  useReportCreateMutation,
  useGetGroupUsersQuery,
  useLazyGetGroupUsersQuery,
  useGetPersonnelIdPropertyQuery,
  useLazyGetPersonnelIdPropertyQuery,
  useGetUsernameByPersonnelIdQuery,
  useLazyGetUsernameByPersonnelIdQuery,
} = jiraApi;

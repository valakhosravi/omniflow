import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AttachmentByRequestId,
  CreateJiraIssueRequest,
  CreateReportRequest,
  CreateRequest,
  EmployeeInfo,
  GetDeputyUsersModel,
  GetProcessByNameAndVersionParams,
  GetProcessByNameAndVersionResponse,
  GetRequestById,
  GetRequestTimelineModel,
  GetUsernameByPersonnelId,
  GroupMemebers,
  GroupUser,
  PersonnelIdProperty,
  SaveAndUploadRequestType,
  SaveProcessAttachmentModel,
  StackHolder,
  StackHolderDirector,
  UpdateBatchRequest,
} from "./commonApi.type";
import { buildSaveProcessAttachmentFormData } from "@/utils/saveAttachmentBuilder";
import { RequestHistoryItem } from "@/features/loan/salary-advance/v1/salary-advance.types";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "attachmentByRequestId",
    "groupUserByProperty",
    "requestHistory",
    "request",
    "employeeInfo",
  ],
  endpoints: (builder) => ({
    // Application endpoints
    getAttachmentByRequestId: builder.query<
      GeneralResponse<AttachmentByRequestId[]>,
      number
    >({
      query: (requestId) => ({
        url: `/v2/Process/Operation/Attachment/GetByRequestId/${requestId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, requestId) => [
        { type: "attachmentByRequestId", id: requestId },
      ],
    }),
    deleteAttachmentAndFileByAttachmentId: builder.mutation<
      GeneralResponse<null>,
      number
    >({
      query: (attachmentId) => ({
        url: `/v2/Process/Operation/Attachment/DeleteAttachmentAndFile/${attachmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["attachmentByRequestId"],
    }),

    saveProcessAttachment: builder.mutation<any, SaveProcessAttachmentModel>({
      query: (data) => {
        const formData = buildSaveProcessAttachmentFormData(data);

        return {
          url: `/v2/Process/Operation/Attachment/SaveProcessAttachment`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["attachmentByRequestId"],
    }),
    uploadAndSaveAttachment: builder.mutation<any, SaveAndUploadRequestType>({
      query: (data) => {
        const formData = buildSaveProcessAttachmentFormData(data);

        return {
          url: `/v2/Process/Operation/Attachment/UploadAndSaveAttachment`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["attachmentByRequestId"],
    }),

    getDeputyUsers: builder.query<
      GeneralResponse<GetDeputyUsersModel[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/HumanResource/Personnel/BasicInfo/GetDeputyUsers/${id}`,
        method: "GET",
      }),
    }),

    getStackHolders: builder.query<GeneralResponse<StackHolder[]>, void>({
      query: () => ({
        url: `/v2/Process/jira/Issue/GetStackHolders`,
        method: "GET",
      }),
      providesTags: () => [{ type: "groupUserByProperty" }],
    }),

    getStackHolderDirectors: builder.query<
      GeneralResponse<StackHolderDirector[]>,
      void
    >({
      query: () => ({
        url: `/v2/Process/Jira/Issue/GetStackHolderDirectors`,
        method: "GET",
      }),
      providesTags: () => [{ type: "groupUserByProperty" }],
    }),
    getGroupUserByProperty: builder.query<GeneralResponse<GroupUser>, string>({
      query: (property) => ({
        url: `/v2/Process/Jira/User/GetGroupUsersByProperty?Department=${property}&PropertyType=1`,
        method: "GET",
      }),
      providesTags: () => [{ type: "groupUserByProperty" }],
    }),

    getRequestHistory: builder.query<
      GeneralResponse<RequestHistoryItem[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Process/Operation/Request/GetHistory/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "requestHistory", id }],
    }),
    getLastProcessByName: builder.query<
      GeneralResponse<GetProcessByNameAndVersionResponse>,
      string
    >({
      query: (processName) => ({
        url: `/v1/Process/Operation/Execution/GetLastActiveProcessByName?processName=${encodeURIComponent(
          processName,
        )}`,
        method: "GET",
        headers: {
          Accept: "text/plain",
        },
      }),
      providesTags: (_result, _error, processName) => [
        { type: "request", id: `last-process-${processName}` },
      ],
    }),
    getProcessByNameAndVersion: builder.query<
      GeneralResponse<GetProcessByNameAndVersionResponse>,
      GetProcessByNameAndVersionParams
    >({
      query: ({ processName, version }) => ({
        url: `/v2/Process/Operation/Execution/GetProcessByNameAndVersion?processName=${encodeURIComponent(
          processName,
        )}&version=${encodeURIComponent(version)}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { processName, version }) => [
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
    getRequestById: builder.query<GeneralResponse<GetRequestById>, number>({
      query: (id) => ({
        url: `/v2/Process/Operation/Request/GetByRequestId/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "request", id: `request-${id}` },
      ],
    }),
    updateBatchGroupIsRead: builder.mutation<
      GeneralResponse<any>,
      UpdateBatchRequest
    >({
      query: ({ requestId, groupKeys }) => ({
        url: `/v1/Process/Operation/Observed/UpdateBatchGroupIsRead`,
        method: "PUT",
        body: {
          RequestId: requestId,
          GroupKeys: groupKeys,
        },
      }),
    }),
    updateIsReadByRequestId: builder.mutation<GeneralResponse<any>, string>({
      query: (requestId) => ({
        url: `/v2/Process/Operation/Observed/UpdateIsReadByRequestId/${requestId}`,
        method: "PUT",
      }),
    }),
    GetJiraTaskStatus: builder.query<
      GeneralResponse<{ StatusName: string }>,
      { issueKey: string }
    >({
      query: ({ issueKey }) => ({
        url: `/v1/Process/Jira/Issue/GetJiraTaskStatus?issueKey=${issueKey}`,
        method: "GET",
      }),
    }),
    getEmployeeInfoByPersonnelId: builder.query<
      GeneralResponse<EmployeeInfo>,
      number
    >({
      query: (personnelId) => ({
        url: `/v2/HumanResource/Personnel/BasicInfo/GetEmployeeInfoByPersonnelId/${personnelId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, personnelId) => [
        { type: "employeeInfo", id: personnelId },
      ],
    }),
    getLastRequestStatus: builder.query<
      GeneralResponse<GetLastRequestStatus>,
      number
    >({
      query: (requestId) => ({
        url: `/v2/Process/Operation/Request/GetLastRequestStatus/${requestId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, requestId) => [
        { type: "request", id: `status-${requestId}` },
      ],
    }),
  }),
});

export const {
  useDeleteAttachmentAndFileByAttachmentIdMutation,
  useSaveProcessAttachmentMutation,
  useUploadAndSaveAttachmentMutation,
  useGetAttachmentByRequestIdQuery,
  useGetDeputyUsersQuery,
  useLazyGetDeputyUsersQuery,
  useGetStackHoldersQuery,
  useGetStackHolderDirectorsQuery,
  useGetGroupUserByPropertyQuery,

  useGetRequestHistoryQuery,
  useLazyGetRequestHistoryQuery,
  useGetLastProcessByNameQuery,
  useGetProcessByNameAndVersionQuery,
  useGetRequestTimelineQuery,
  useGetRequestByIdQuery,
  useUpdateBatchGroupIsReadMutation,
  useUpdateIsReadByRequestIdMutation,
  useGetJiraTaskStatusQuery,

  useGetEmployeeInfoByPersonnelIdQuery,
  useLazyGetEmployeeInfoByPersonnelIdQuery,
  useGetLastRequestStatusQuery,
} = commonApi;

// --- Jira API ---

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
          Department,
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
          Username,
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
          Department,
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

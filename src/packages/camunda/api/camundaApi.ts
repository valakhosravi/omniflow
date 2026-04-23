import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProcessInstance } from "@/models/camunda-process/StartProcess";
import { GetTask } from "@/models/camunda-process/GetNextTask";
import { GetUserRequests } from "@/models/camunda-process/GetRequests";
import { GetRequestsByInstanceIds } from "@/models/camunda-process/GetRequestsByInstanceIds";
import { TaskFilter } from "@/constants/task-filter";
export interface ClearRequestBody {
  messageName: string;
  processInstanceId: string;
}


// Types for Camunda API
export interface StartProcessRequest {
  definitionId: string;
  body: any;
  processName?: string;
}

export interface CompleteTaskRequest {
  taskId: string;
  body: any;
  processName?: string;
  trackingCode?: string;
}
export interface ClaimTaskRequest {
  taskId: string;
  body: any;
}

export interface GetTasksByFilterRequest {
  type: TaskFilter;
  value: string;
}

export interface GetNextTaskRequest {
  instanceId: string;
}

export interface GetRequestsRequest {
  pageNumber?: number;
  pageSize?: number;
}

export interface MessageRequest {
  body: any;
  trackingCode?: string;
  processName?: string;
}

export interface GetTasksByCandidateGroupsRequest {
  candidateGroups: string[];
}

export const camundaApi = createApi({
  reducerPath: "camundaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api-camunda/api",
    credentials: "include",
  }),
  tagTypes: ["Process", "Task", "Request", "Message"],
  endpoints: (builder) => ({
    // Start a new process instance
    startProcess: builder.mutation<ProcessInstance, StartProcessRequest>({
      query: ({ definitionId, body, processName }) => ({
        url: `/process-definition/${definitionId}/start`,
        method: "POST",
        body,
        headers: {
          "X-Process-Name": processName,
        },
      }),
      invalidatesTags: ["Process", "Task"],
    }),

    // Get tasks by filter
    getTasksByFilter: builder.query<GetTask[], GetTasksByFilterRequest>({
      query: ({ type, value }) => ({
        url: `/task?${type}=${value}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    // Get tasks by candidate groups
    getTasksByCandidateGroups: builder.query<
      GetTask[],
      GetTasksByCandidateGroupsRequest
    >({
      query: ({ candidateGroups }) => ({
        url: "/task",
        method: "POST",
        body: {
          candidateGroups,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "CANDIDATE_GROUPS" },
            ]
          : [{ type: "Task", id: "CANDIDATE_GROUPS" }],
    }),

    // Get tasks by process instance ID
    getTasksByProcessInstance: builder.query<GetTask[], string>({
      query: (instanceId) => ({
        url: `/task?processInstanceId=${instanceId}`,
        method: "GET",
      }),
      providesTags: (result, _error, instanceId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: `instance-${instanceId}` },
            ]
          : [{ type: "Task", id: `instance-${instanceId}` }],
    }),

    // Complete a task
    completeTask: builder.mutation<any, CompleteTaskRequest>({
      query: ({ taskId, body, processName, trackingCode }) => ({
        url: `/task/${taskId}/complete`,
        method: "POST",
        body,
        headers: {
          "X-Process-Name": processName,
          "X-Tracking-Code": trackingCode,
        },
      }),
      invalidatesTags: ["Task", "Process"],
    }),

    // Send a message
    sendMessage: builder.mutation<any, MessageRequest>({
      query: ({ body, trackingCode, processName }) => ({
        url: "/message",
        method: "POST",
        body,
        headers: {
          "X-Tracking-Code": trackingCode,
          "X-Process-Name": processName,
        },
      }),
      invalidatesTags: ["Message", "Process"],
    }),

    // Claim a task
    claimTask: builder.mutation<any, ClaimTaskRequest>({
      query: ({ taskId, body }) => ({
        url: `/task/${taskId}/claim`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Task"],
    }),

    // Get task by ID
    getTaskById: builder.query<GetTask, string>({
      query: (taskId) => ({
        url: `/task/${taskId}`,
        method: "GET",
      }),
      providesTags: (result, _error, taskId) =>
        result ? [{ type: "Task", id: taskId }] : [],
    }),

    // Get next task (custom endpoint - you might need to adjust this)
    getNextTask: builder.query<GetTask, string>({
      query: (instanceId) => ({
        url: `/task?processInstanceId=${instanceId}&firstResult=0&maxResults=1`,
        method: "GET",
      }),
      transformResponse: (response: GetTask[]) => response[0],
      providesTags: (result) =>
        result ? [{ type: "Task", id: result.id }] : [],
    }),

    // Get user requests (custom endpoint - you might need to adjust this)
    getUserRequests: builder.query<GetUserRequests, GetRequestsRequest>({
      query: ({ pageNumber = 1, pageSize = 10 }) => ({
        url: `/process-instance?firstResult=${
          (pageNumber - 1) * pageSize
        }&maxResults=${pageSize}`,
        method: "GET",
      }),
      providesTags: ["Request"],
    }),

    // Get requests by instance IDs
    getRequestsByInstanceIds: builder.query<GetRequestsByInstanceIds, string[]>(
      {
        query: (instanceIds) => ({
          url: `/process-instance?processInstanceIds=${instanceIds.join(",")}`,
          method: "GET",
        }),
        providesTags: ["Request"],
      },
    ),

    // Clear request (custom endpoint - you might need to adjust this)
    clearRequest: builder.mutation<any, ClearRequestBody>({
      query: (body) => ({
        url: "/process-instance/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Request", "Process"],
    }),
  }),
});

export const {
  // Mutations
  useStartProcessMutation,
  useCompleteTaskMutation,
  useSendMessageMutation,
  useClaimTaskMutation,
  useClearRequestMutation,

  // Queries
  useGetTasksByFilterQuery,
  useGetTasksByCandidateGroupsQuery,
  useGetTasksByProcessInstanceQuery,
  useGetNextTaskQuery,
  useGetTaskByIdQuery,
  useGetUserRequestsQuery,
  useGetRequestsByInstanceIdsQuery,

  // Lazy queries
  useLazyGetTasksByFilterQuery,
  useLazyGetTasksByCandidateGroupsQuery,
  useLazyGetTasksByProcessInstanceQuery,
  useLazyGetNextTaskQuery,
  useLazyGetTaskByIdQuery,
  useLazyGetUserRequestsQuery,
  useLazyGetRequestsByInstanceIdsQuery,

  // //snooze
  // useCreateSnoozeMutation,
  // useDeleteSnoozeMutation,
  // useEditSnoozeMutation,
} = camundaApi;

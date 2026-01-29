import GeneralResponse from "@/packages/core/types/api/general_response";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CreateDevelopRequest,
  EditDevelopRequest,
  GetAllDevelopDetails,
  GetDevelopmentRequestDetailsModel,
  GetDevelopmentTicketModel,
  UserInfoDetails,
} from "../types/DevelopmentRequests";

interface MessageRequest {
  body: any;
}

export const developmentApi = createApi({
  reducerPath: "developmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "developRequestDetails",
    "Message",
    "developTicket",
    "groupUserByProperty",
  ],
  endpoints: (builder) => ({
    getDevelopmentTicket: builder.query<
      GeneralResponse<GetDevelopmentTicketModel>,
      number
    >({
      query: (requestId) => ({
        url: `/v2/Process/Operation/Request/GetByRequestId/${requestId}`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [
        { type: "developTicket", id: requestId },
      ],
    }),
    getDevelopmentRequestDetails: builder.query<
      GeneralResponse<GetDevelopmentRequestDetailsModel>,
      number
    >({
      query: (requestId) => ({
        url: `/v3/Product/Request/Develop/GetByRequestId/${requestId}`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [
        { type: "developRequestDetails", id: requestId },
      ],
    }),
    getDevelopmentRequestDetailsV1: builder.query<
      GeneralResponse<GetAllDevelopDetails>,
      number
    >({
      query: (requestId) => ({
        url: `/v1/Product/Request/Develop/GetByRequestId/${requestId}`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [
        { type: "developRequestDetails", id: requestId },
      ],
    }),
    sendMessage: builder.mutation<any, MessageRequest>({
      query: ({ body }) => ({
        url: `/engine-rest/message`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Message", "developRequestDetails"],
    }),

    getProcessUserManager: builder.query<GeneralResponse<any>, number>({
      query: (personnelId) => ({
        url: `/v2/Product/Request/Develop/GetProcessUserManager/${personnelId}`,
        method: "GET",
        headers: {
          accept: "text/plain",
        },
      }),
      providesTags: (result, error, personnelId) => [
        { type: "developRequestDetails", id: personnelId },
      ],
    }),
    createDevelop: builder.mutation<
      GeneralResponse<null>,
      CreateDevelopRequest
    >({
      query: (body) => ({
        url: `/v1/Product/Request/Develop/Create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["developRequestDetails"],
    }),
    getAllDevelop: builder.query<GeneralResponse<GetAllDevelopDetails[]>, void>(
      {
        query: () => ({
          url: `/v3/Product/Request/Develop/GetAll`,
          method: "GET",
        }),
        providesTags: ["developRequestDetails"],
      }
    ),
    editDevelop: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: EditDevelopRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v1/Product/Request/Develop/Edit/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["developRequestDetails"],
    }),
    getProcessUserManagerV1: builder.query<
      GeneralResponse<UserInfoDetails>,
      number
    >({
      query: (id) => ({
        url: `/v1/Product/Request/Develop/GetProcessUserManager/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "developRequestDetails", id },
      ],
    }),
  }),
});

export const {
  useGetDevelopmentTicketQuery,
  useLazyGetDevelopmentTicketQuery,
  useGetDevelopmentRequestDetailsQuery,
  useLazyGetDevelopmentRequestDetailsQuery,
  useSendMessageMutation,
  useGetProcessUserManagerQuery,
  useLazyGetProcessUserManagerQuery,
  useCreateDevelopMutation,
  useGetAllDevelopQuery,
  useLazyGetAllDevelopQuery,
  useEditDevelopMutation,
  useGetProcessUserManagerV1Query,
  useLazyGetProcessUserManagerV1Query,
  useGetDevelopmentRequestDetailsV1Query,
  useLazyGetDevelopmentRequestDetailsV1Query,
} = developmentApi;

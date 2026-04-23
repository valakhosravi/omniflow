import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CreateDevelopRequest,
  EditDevelopRequest,
  GetAllDevelopDetails,
  GetDevelopmentRequestDetailsModel,
  DevelopmetDetailsType,
  UserInfoDetails,
  MessageRequest,
} from "./development.types";

// --- Development API ---

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
      GeneralResponse<DevelopmetDetailsType>,
      number
    >({
      query: (requestId) => ({
        url: `/v2/Process/Operation/Request/GetByRequestId/${requestId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, requestId) => [
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
      providesTags: (___result, ___error, requestId) => [
        { type: "developRequestDetails", id: requestId },
      ],
    }),
    getAllDevelopmentDetails: builder.query<
      GeneralResponse<GetAllDevelopDetails>,
      number
    >({
      query: (requestId) => ({
        url: `/v1/Product/Request/Develop/GetByRequestId/${requestId}`,
        method: "GET",
      }),
      providesTags: (__result, __error, requestId) => [
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
      providesTags: (_result, _error, personnelId) => [
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
      },
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
    getProcessUserManagerInfo: builder.query<
      GeneralResponse<UserInfoDetails>,
      number
    >({
      query: (id) => ({
        url: `/v1/Product/Request/Develop/GetProcessUserManager/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
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
  useGetProcessUserManagerInfoQuery,
  useLazyGetProcessUserManagerInfoQuery,
  useGetAllDevelopmentDetailsQuery,
  useLazyGetAllDevelopmentDetailsQuery,
} = developmentApi;

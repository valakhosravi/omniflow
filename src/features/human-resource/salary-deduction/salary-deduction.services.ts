import { createApi } from "@reduxjs/toolkit/query/react";
import {
  BankListResponse,
  BooleanResponse,
  CreateRequestDto,
  GeneralResponse,
  Int64Response,
  RequestResponse,
  ValidSalaryDeductionDto,
} from "./salary-deduction.types";
import { baseQueryWithReauth } from "@/store/core/baseQuery";

export const salaryDeductionApi = createApi({
  reducerPath: "salaryDeductionApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Bank", "Request"],
  endpoints: (builder) => ({
    /* ---------- Bank ---------- */

    getBanks: builder.query<BankListResponse, void>({
      query: () => ({
        url: "/v1/HumanResource/SalaryDeduction/Bank/GetBanks",
        method: "GET",
      }),
      providesTags: ["Bank"],
    }),

    /* ---------- Request ---------- */

    createRequest: builder.mutation<GeneralResponse, CreateRequestDto>({
      query: (body) => ({
        url: "/v1/HumanResource/SalaryDeduction/Request/Create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Request"],
    }),

    getRequestByProcessRequestId: builder.query<
      RequestResponse,
      { requestId: string; trackingCode: string; processName: string }
    >({
      query: ({ requestId, trackingCode, processName }) => ({
        url: "/v1/HumanResource/SalaryDeduction/Request/GetByProcessRequestId",
        method: "GET",
        headers: {
          "X-Tracking-Code": trackingCode,
          "X-Process-Name": processName,
        },
        params: { requestId },
      }),
      providesTags: ["Request"],
    }),

    updateRequestActivation: builder.mutation<GeneralResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/v1/HumanResource/SalaryDeduction/Request/UpdateRequestActivation/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Request"],
    }),

    hasValidSalaryDeduction: builder.mutation<
      BooleanResponse,
      ValidSalaryDeductionDto
    >({
      query: (body) => ({
        url: "/v1/HumanResource/SalaryDeduction/Request/HasValidSalaryDeduction",
        method: "POST",
        body,
      }),
    }),

    hasValidSalaryDeductionForUser: builder.mutation<
      BooleanResponse,
      ValidSalaryDeductionDto
    >({
      query: (body) => ({
        url: "/v1/HumanResource/SalaryDeduction/Request/HasValidSalaryDeductionForUser",
        method: "POST",
        body,
      }),
    }),

    getMaxDeductionAmount: builder.query<Int64Response, void>({
      query: () => ({
        url: "/v1/HumanResource/SalaryDeduction/Request/MaxDeductionAmount",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetBanksQuery,
  useCreateRequestMutation,
  useGetRequestByProcessRequestIdQuery,
  useUpdateRequestActivationMutation,
  useHasValidSalaryDeductionMutation,
  useHasValidSalaryDeductionForUserMutation,
  useGetMaxDeductionAmountQuery,
} = salaryDeductionApi;

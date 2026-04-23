import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import {
  UnterminatedProcess,
  SalaryAdvancedPaidRequestGroup,
  ProcessRule,
  AmountRatio,
  LoanRequestDetails,
  TimelineItem,
} from "../salary-advance.types";

export const advanceMoneyApi = createApi({
  reducerPath: "advanceMoneyApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "loanCapacity",
    "unterminatedProcess",
    "salaryAdvancedPaidRequest",
    "processRule",
    "amountRatio",
    "loanRequestDetails",
    "timeline",
    "requestHistory",
  ],
  endpoints: (builder) => ({
    getLoanCapacityPerMonth: builder.query<
      GeneralResponse<boolean>,
      {
        CapacityCount: string;
        ProcessTypeId: string;
        StatusCode: string;
      }
    >({
      query: (params) => ({
        url: `/v2/HumanResource/Request/Loan/GetCapacityPerMonth`,
        method: "GET",
        params,
      }),
      providesTags: ["loanCapacity"],
    }),
    getUnterminatedProcess: builder.query<
      GeneralResponse<UnterminatedProcess>,
      number
    >({
      query: (processTypeId) => ({
        url: `/v2/Process/Operation/Request/GetUnterminatedProcess/${processTypeId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, processTypeId) => [
        { type: "unterminatedProcess", id: processTypeId },
      ],
    }),
    getSalaryAdvancedPaidRequestPerYear: builder.query<
      GeneralResponse<SalaryAdvancedPaidRequestGroup[]>,
      void
    >({
      query: () => ({
        url: `/v2/HumanResource/Request/Loan/GetSalaryAdvancedPaidRequestPerYear`,
        method: "GET",
      }),
    }),
    getProcessRuleByProcessTypeId: builder.query<
      GeneralResponse<ProcessRule[]>,
      number
    >({
      query: (processTypeId) => ({
        url: `/v2/Process/Operation/Rule/GetByProcessTypeId/${processTypeId}`,
        method: "GET",
      }),
      providesTags: (__result, __error, processTypeId) => [
        { type: "processRule", id: processTypeId },
      ],
    }),
    getAmountRatio: builder.query<GeneralResponse<AmountRatio[]>, void>({
      query: () => ({
        url: `/v1/Loan/SalaryAdvance/AmountRatio/GetAll`,
        method: "GET",
      }),
      providesTags: ["amountRatio"],
    }),
    getLoanRequestByRequestId: builder.query<
      GeneralResponse<LoanRequestDetails>,
      number
    >({
      query: (requestId) => ({
        url: `/v1/Loan/SalaryAdvance/Request/GetByProcessRequestId?processRequestId=${requestId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, requestId) => [
        { type: "loanRequestDetails", id: requestId },
      ],
    }),
    getTimeline: builder.query<GeneralResponse<TimelineItem[]>, number>({
      query: (id) => ({
        url: `/v2/Process/Operation/Request/GetTimeline/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "timeline", id }],
    }),
  }),
});

export const {
  useLazyGetLoanCapacityPerMonthQuery,
  useGetUnterminatedProcessQuery,
  useGetSalaryAdvancedPaidRequestPerYearQuery,
  useGetProcessRuleByProcessTypeIdQuery,
  useGetAmountRatioQuery,
  useGetLoanRequestByRequestIdQuery,
  useGetTimelineQuery,
} = advanceMoneyApi;

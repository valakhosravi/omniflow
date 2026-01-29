import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import GeneralResponse from "@/models/general-response/general_response";
import { UnterminatedProcess } from "@/models/advance-money/UnterminatedProcess";
import { SalaryAdvancedPaidRequest, SalaryAdvancedPaidRequestGroup } from "@/models/advance-money/SalaryAdvancedPaidRequest";
import { ProcessRule } from "@/models/advance-money/ProcessRule";
import { AmountRatio } from "@/models/advance-money/AmountRatio";
import { LoanRequestDetails } from "@/models/advance-money/LoanRequestDetails";
import { TimelineItem } from "@/models/advance-money/Timeline";
import { RequestHistoryItem } from "@/models/advance-money/RequestHistory";

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
      providesTags: (result, error, processTypeId) => [
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
      providesTags: (result, error, processTypeId) => [
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
      providesTags: (result, error, requestId) => [
        { type: "loanRequestDetails", id: requestId },
      ],
    }),
    getTimeline: builder.query<
      GeneralResponse<TimelineItem[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Process/Operation/Request/GetTimeline/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "timeline", id },
      ],
    }),
    getRequestHistory: builder.query<
      GeneralResponse<RequestHistoryItem[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Process/Operation/Request/GetHistory/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "requestHistory", id },
      ],
    }),
  }),
});

export const {
  useGetLoanCapacityPerMonthQuery,
  useLazyGetLoanCapacityPerMonthQuery,
  useGetUnterminatedProcessQuery,
  useLazyGetUnterminatedProcessQuery,
  useGetSalaryAdvancedPaidRequestPerYearQuery,
  useLazyGetSalaryAdvancedPaidRequestPerYearQuery,
  useGetProcessRuleByProcessTypeIdQuery,
  useLazyGetProcessRuleByProcessTypeIdQuery,
  useGetAmountRatioQuery,
  useLazyGetAmountRatioQuery,
  useGetLoanRequestByRequestIdQuery,
  useLazyGetLoanRequestByRequestIdQuery,
  useGetTimelineQuery,
  useLazyGetTimelineQuery,
  useGetRequestHistoryQuery,
  useLazyGetRequestHistoryQuery,
} = advanceMoneyApi;

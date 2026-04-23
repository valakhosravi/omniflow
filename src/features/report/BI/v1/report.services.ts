import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import {
  CategoryDetails,
  DataScopeDetails,
  PriorityDetails,
  OutputFormatDetails,
  DataAccessClearanceDetails,
  ReportUpdatePeriodDetails,
  AIMLTargetModelDetails,
  ModelLimitationDetails,
  ReportRequest,
  SaveReportRequest,
  SaveAIMLReportRequest,
  EditReportRequest,
} from "./reportV1.types";

export const ReportApi = createApi({
  reducerPath: "generalReportApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Report", "groupUserByProperty"],
  endpoints: (builder) => ({
    getCategories: builder.query<GeneralResponse<CategoryDetails[]>, void>({
      query: () => ({
        url: "/v1/Report/BasicInfo/Category/GetCategories",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getDataScopes: builder.query<GeneralResponse<DataScopeDetails[]>, void>({
      query: () => ({
        url: "/v1/Report/BasicInfo/DataScope/GetDataScopes",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getPriorities: builder.query<GeneralResponse<PriorityDetails[]>, void>({
      query: () => ({
        url: "/v1/Report/BasicInfo/General/GetPriorities",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getOutputFormats: builder.query<
      GeneralResponse<OutputFormatDetails[]>,
      void
    >({
      query: () => ({
        url: "/v1/Report/BasicInfo/General/GetOutputFormats",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getDataAccessClearances: builder.query<
      GeneralResponse<DataAccessClearanceDetails[]>,
      void
    >({
      query: () => ({
        url: "/v1/Report/BasicInfo/General/GetDataAccessClearances",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getReportUpdatePeriods: builder.query<
      GeneralResponse<ReportUpdatePeriodDetails[]>,
      void
    >({
      query: () => ({
        url: "/v1/Report/BasicInfo/General/GetReportUpdatePeriods",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getAIMLTargetModels: builder.query<
      GeneralResponse<AIMLTargetModelDetails[]>,
      void
    >({
      query: () => ({
        url: "/v1/Report/BasicInfo/General/GetAIMLTargetModels",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getModelLimitations: builder.query<
      GeneralResponse<ModelLimitationDetails[]>,
      void
    >({
      query: () => ({
        url: "/v1/Report/BasicInfo/General/GetModelLimitations",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getReportByRequestId: builder.query<
      GeneralResponse<ReportRequest>,
      {
        requestId: string;
        trackingCode: string;
        processName: string;
      }
    >({
      query: ({ requestId, trackingCode, processName }) => ({
        url: `/v1/Report/BI/Request/GetByProcessRequestId?processrequestid=${requestId}`,
        method: "GET",
        headers: {
          "X-Tracking-Code": trackingCode,
          "X-Process-Name": processName,
        },
      }),
      providesTags: ["Report"],
    }),
    saveReport: builder.mutation<GeneralResponse<null>, SaveReportRequest>({
      query: (body) => ({
        url: `/v1/Product/Request/Report/SaveReport`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Report"],
    }),
    saveAIMLReport: builder.mutation<
      GeneralResponse<null>,
      SaveAIMLReportRequest
    >({
      query: (body) => ({
        url: `/v1/Product/Request/Report/SaveAIMLReport`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Report"],
    }),
    editReport: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: EditReportRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v1/Product/Request/Report/Edit/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Report"],
    }),
  }),
});

export const {
  useGetAIMLTargetModelsQuery,
  useGetCategoriesQuery,
  useGetDataAccessClearancesQuery,
  useGetDataScopesQuery,
  useGetModelLimitationsQuery,
  useGetOutputFormatsQuery,
  useGetPrioritiesQuery,
  useGetReportUpdatePeriodsQuery,
  useGetReportByRequestIdQuery,
  useSaveReportMutation,
  useSaveAIMLReportMutation,
  useEditReportMutation,
} = ReportApi;

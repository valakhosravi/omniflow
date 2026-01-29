import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import GeneralResponse from "@/packages/core/types/api/general_response";
import {
  AIMLTargetModelDetails,
  CategoryDetails,
  CreateApplicationRequest,
  DataAccessClearanceDetails,
  DataScopeDetails,
  EditApplicationRequest,
  EditReportRequest,
  GetAllApplicationRequest,
  KpiDetails,
  ModelLimitationDetails,
  OutputFormatDetails,
  PriorityDetails,
  ReportUpdatePeriodDetails,
  ReportRequest,
  SaveAIMLReportRequest,
  SaveReportRequest,
} from "../types/ReportModels";

export const ReportApi = createApi({
  reducerPath: "generalReportApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Program", "Report", "groupUserByProperty"],
  endpoints: (builder) => ({
    getPrograms: builder.query<
      GeneralResponse<GetAllApplicationRequest[]>,
      void
    >({
      query: () => ({
        url: "/v2/Product/BasicInfo/Program/GetAll",
        method: "GET",
      }),
      providesTags: ["Program"],
    }),

    createProgram: builder.mutation<
      GeneralResponse<null>,
      CreateApplicationRequest
    >({
      query: (body) => ({
        url: "/v2/Product/BasicInfo/Program/Create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Program"],
    }),

    editProgram: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: EditApplicationRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Product/BasicInfo/Program/Edit/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Program"],
    }),

    deleteProgram: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Product/BasicInfo/Program/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Program"],
    }),

    getCategories: builder.query<GeneralResponse<CategoryDetails[]>, void>({
      query: () => ({
        url: "/v2/Product/BasicInfo/Report/GetCategories",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getDataScopes: builder.query<GeneralResponse<DataScopeDetails[]>, void>({
      query: () => ({
        url: "/v2/Product/BasicInfo/Report/GetDataScopes",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getKpis: builder.query<GeneralResponse<KpiDetails[]>, void>({
      query: () => ({
        url: "/v2/Product/BasicInfo/Report/GetKpis",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getPriorities: builder.query<GeneralResponse<PriorityDetails[]>, void>({
      query: () => ({
        url: "/v2/Product/BasicInfo/Report/GetPriorities",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getOutputFormats: builder.query<
      GeneralResponse<OutputFormatDetails[]>,
      void
    >({
      query: () => ({
        url: "/v2/Product/BasicInfo/Report/GetOutputFormats",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getDataAccessClearances: builder.query<
      GeneralResponse<DataAccessClearanceDetails[]>,
      void
    >({
      query: () => ({
        url: "/v2/Product/BasicInfo/Report/GetDataAccessClearances",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getReportUpdatePeriods: builder.query<
      GeneralResponse<ReportUpdatePeriodDetails[]>,
      void
    >({
      query: () => ({
        url: "/v2/Product/BasicInfo/Report/GetReportUpdatePeriods",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getAIMLTargetModels: builder.query<
      GeneralResponse<AIMLTargetModelDetails[]>,
      void
    >({
      query: () => ({
        url: "/v2/Product/BasicInfo/Report/GetAIMLTargetModels",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getModelLimitations: builder.query<
      GeneralResponse<ModelLimitationDetails[]>,
      void
    >({
      query: () => ({
        url: "/v2/Product/BasicInfo/Report/GetModelLimitations",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getReportByRequestId: builder.query<GeneralResponse<ReportRequest>, number>(
      {
        query: (requestId) => ({
          url: `/v2/Product/Request/Report/GetByRequestId/${requestId}`,
          method: "GET",
        }),
        providesTags: ["Report"],
      }
    ),
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
    getReportByRequestIdV1: builder.query<
      GeneralResponse<ReportRequest>,
      number
    >({
      query: (requestId) => ({
        url: `/v1/Product/Request/Report/GetByRequestId/${requestId}`,
        method: "GET",
      }),
      providesTags: ["Report"],
    }),
  }),
});

export const {
  useCreateProgramMutation,
  useDeleteProgramMutation,
  useEditProgramMutation,
  useGetAIMLTargetModelsQuery,
  useGetCategoriesQuery,
  useGetDataAccessClearancesQuery,
  useGetDataScopesQuery,
  useGetKpisQuery,
  useGetModelLimitationsQuery,
  useGetOutputFormatsQuery,
  useGetPrioritiesQuery,
  useGetProgramsQuery,
  useGetReportUpdatePeriodsQuery,
  useGetReportByRequestIdQuery,
  useSaveReportMutation,
  useSaveAIMLReportMutation,
  useEditReportMutation,
  useGetReportByRequestIdV1Query,
  useLazyGetReportByRequestIdV1Query,
} = ReportApi;

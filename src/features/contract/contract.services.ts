import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  Category,
  SubCategory,
  SubCategoryField,
  Configuration,
  GetContractInfo,
  ContractDetails,
  ContractFieldValueDetails,
  ClauseDetails,
  ContractClauseDetails,
  GetTermsRequestByClauseId,
  GetSubClauses,
  GetTermAssigneeDetails,
  GetContractAssigneeDetails,
  SaveContractDetail,
  SaveClauseRequest,
  SaveTermRequest,
  SaveFinalTermRequest,
  SaveSubClauseRequest,
  EditContractRequest,
  UpdateRequestIdRequest,
  UpdateClauseRequest,
  UpdateTermRequest,
  UpdateSubClauseRequest,
  FullEditContractRequest,
  FullSaveRequest,
  UpdateContractTermRequest,
  ContractDepartments,
  saveTermAssigneeRequest,
  SaveContractAssigneeRequest,
  UpdateContractAssigneeRequest,
  UpdateTermAssigneeRequest,
  UpdateTermSortRequest,
  UpdateClauseSortRequest,
  ContractTemplate,
  SaveSubCategoryTemplateRequest,
  SaveSubCategoryWithFieldsRequest,
  UpdateSubCategoryWithFieldsRequest,
  SubCategoryTemplate,
  ApprovalHistoryItem,
  SaveContractFieldValues,
  SaveContractRequest,
  Library,
} from "./contract.types";

export const contractApi = createApi({
  reducerPath: "contractApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Contract",
    "Clause",
    "Term",
    "SubClause",
    "TermAssignee",
    "ContractAssignee",
  ],
  endpoints: (builder) => ({
    // Existing endpoints
    getContractCategories: builder.query<GeneralResponse<Category[]>, void>({
      query: () => ({
        url: `/v2/Contract/BasicInfo/Generation/GetCategories`,
        method: "GET",
      }),
    }),
    getSubCategoriesByCategoryId: builder.query<
      GeneralResponse<SubCategory[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/BasicInfo/Generation/GetSubCategoriesByCategoryId/${id}`,
        method: "GET",
      }),
    }),
    getAllSubCategories: builder.query<GeneralResponse<SubCategory[]>, void>({
      query: () => ({
        url: `/v2/Contract/BasicInfo/Generation/GetAllSubCategories`,
        method: "GET",
      }),
    }),
    getSubCategoryFieldsBySubCategoryId: builder.query<
      GeneralResponse<SubCategoryField[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/BasicInfo/Generation/GetSubCategoryFieldsBySubCategoryId/${id}`,
        method: "GET",
      }),
    }),
    getConfigurationBySubCategoryId: builder.query<
      GeneralResponse<Configuration[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/BasicInfo/Configuration/GetBySubCategoryId/${id}`,
        method: "GET",
      }),
    }),
    getContractFieldValuesByContractId: builder.query<
      GeneralResponse<ContractFieldValueDetails>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/GetContractFieldValuesByContractId/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Contract", id }],
    }),

    // Contract Management Endpoints
    saveContractRequest: builder.mutation<
      GeneralResponse<SaveContractDetail>,
      SaveContractRequest
    >({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/Save`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),
    getContractByRequestId: builder.query<
      GeneralResponse<ContractDetails>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/GetByRequestId/${id}`,
        method: "GET",
      }),
      providesTags: (__result, __error, id) => [{ type: "Contract", id }],
    }),
    getContractInfoByContractId: builder.query<
      GeneralResponse<GetContractInfo>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/GetContractInfoByContractId/${id}`,
        method: "GET",
      }),
      providesTags: (__result, __error, id) => [{ type: "Contract", id }],
    }),
    getContractInfoByRequestId: builder.query<
      GeneralResponse<GetContractInfo>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/GetContractInfoByRequestId/${id}`,
        method: "GET",
      }),
      providesTags: (__result, __error, id) => [{ type: "Contract", id }],
    }),
    saveContractFieldValues: builder.mutation<
      GeneralResponse<null>,
      SaveContractFieldValues
    >({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/SaveContractFieldValues`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),
    deleteContract: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contract"],
    }),
    editContract: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: EditContractRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Contract/Request/Generation/Edit/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),
    updateRequestIdByContractId: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateRequestIdRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Contract/Request/Generation/UpdateRequestIdByContractId/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),
    fullEditContract: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: FullEditContractRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Contract/Request/Generation/FullEdit/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),

    // Clause Management Endpoints
    saveClauseRequest: builder.mutation<
      GeneralResponse<null>,
      SaveClauseRequest
    >({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/SaveClauseRequest`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Clause"],
    }),
    getClausesByContractId: builder.query<
      GeneralResponse<ClauseDetails[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/GetClausesByContractId/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Clause", id }],
    }),
    updateClause: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateClauseRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Contract/Request/Generation/UpdateClause/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Clause"],
    }),
    deleteClause: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/DeleteClause/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clause"],
    }),
    updateClauseSort: builder.mutation<
      GeneralResponse<null>,
      UpdateClauseSortRequest[]
    >({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/UpdateClauseSort`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Clause"],
    }),

    // Term Management Endpoints
    saveTerm: builder.mutation<GeneralResponse<null>, SaveTermRequest>({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/SaveTerm`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Term"],
    }),
    saveFinalDescriptionByTermId: builder.mutation<
      GeneralResponse<null>,
      SaveFinalTermRequest
    >({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/SaveFinalDescriptionByTermId`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Term"],
    }),
    resetFinalDescriptionByTermId: builder.mutation<
      GeneralResponse<null>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/ResetFinalDescriptionByTermId/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Term"],
    }),
    updateTermRequest: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateTermRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Contract/Request/Generation/UpdateTermRequest/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Term"],
    }),
    deleteTerm: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/DeleteTerm/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Term"],
    }),
    getTermsByClauseId: builder.query<
      GeneralResponse<GetTermsRequestByClauseId[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/GetTermsByClauseId/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Term", id }],
    }),

    // SubClause Management Endpoints
    saveSubClauseRequest: builder.mutation<
      GeneralResponse<null>,
      SaveSubClauseRequest
    >({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/SaveSubClauseRequest`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubClause"],
    }),
    getSubClausesByTermId: builder.query<
      GeneralResponse<GetSubClauses[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/GetSubClausesByTermId/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "SubClause", id }],
    }),
    updateSubClause: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateSubClauseRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Contract/Request/Generation/UpdateSubClause/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SubClause"],
    }),
    deleteSubClause: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/DeleteSubClause/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubClause"],
    }),

    // Term Assignee Management Endpoints
    getTermAssigneeWithContractIdAndUserId: builder.query<
      GeneralResponse<GetTermAssigneeDetails[]>,
      { contractId: number; assignerUserId: number }
    >({
      query: ({ contractId, assignerUserId }) => ({
        url: `/v2/Contract/Request/Generation/GetTermAssigneeByContractIdAndUserId`,
        method: "GET",
        params: { contractId, assignerUserId },
      }),
      providesTags: ["TermAssignee"],
    }),
    getTermAssigneeWithContractIdAndAssignerUserId: builder.query<
      GeneralResponse<GetTermAssigneeDetails[]>,
      { contractId: number; userId: number }
    >({
      query: ({ contractId, userId }) => ({
        url: `/v2/Contract/Request/Generation/GetTermAssigneeByContractIdAndAssignerUserId`,
        method: "GET",
        params: { contractId, userId },
      }),
      providesTags: ["TermAssignee"],
    }),
    saveTermAssignee: builder.mutation<
      GeneralResponse<null>,
      saveTermAssigneeRequest
    >({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/SaveTermAssignee`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["TermAssignee"],
    }),
    updateTermAssignee: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateTermAssigneeRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Contract/Request/Generation/UpdateTermAssignee/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TermAssignee"],
    }),
    getTermAssigneeWithContractId: builder.query<
      GeneralResponse<GetTermAssigneeDetails[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/GetTermAssigneeWithContractId/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "TermAssignee", id }],
    }),
    getTermLibrariesByCategotyId: builder.query<
      GeneralResponse<Library[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/BasicInfo/Generation/GetLibrariesByCategotyId/${id}`,
        method: "GET",
      }),
    }),
    fullSave: builder.mutation<
      GeneralResponse<SaveContractDetail>,
      FullSaveRequest
    >({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/FullSave`,
        method: "POST",
        body,
      }),
    }),
    updateFullTermRequest: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateContractTermRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Contract/Request/Generation/UpdateTermRequest/${id}`,
        method: "PUT",
        body,
      }),
    }),
    softDeleteTerm: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/SoftDeleteTerm/${id}`,
        method: "DELETE",
      }),
    }),
    updateTermSort: builder.mutation<
      GeneralResponse<null>,
      UpdateTermSortRequest[]
    >({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/UpdateTermSort`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Term"],
    }),
    getContractDepartments: builder.query<
      GeneralResponse<ContractDepartments[]>,
      void
    >({
      query: () => ({
        url: `/v2/Contract/BasicInfo/Generation/GetContractDepartments`,
        method: "GET",
      }),
    }),

    // Contract Assignee Management Endpoints
    saveContractAssignee: builder.mutation<
      GeneralResponse<null>,
      SaveContractAssigneeRequest
    >({
      query: (body) => ({
        url: `/v2/Contract/Request/Generation/SaveContractAssignee`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ContractAssignee"],
    }),
    updateContractAssignee: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateContractAssigneeRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Contract/Request/Generation/UpdateContractAssignee/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ContractAssignee"],
    }),
    getContractAssigneeWithContractIdAndUserId: builder.query<
      GeneralResponse<GetContractAssigneeDetails[]>,
      { contractId: number; userId: number }
    >({
      query: ({ contractId, userId }) => ({
        url: `/v2/Contract/Request/Generation/GetContractAssigneeByContractIdAndUserId`,
        method: "GET",
        params: { contractId, userId },
      }),
      providesTags: ["ContractAssignee"],
    }),
    getContractAssigneeWithContractId: builder.query<
      GeneralResponse<GetContractAssigneeDetails[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/Request/Generation/GetContractAssigneeByContractId/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ContractAssignee", id }],
    }),
    getContractAssigneeWithContractIdAndAssignerUserId: builder.query<
      GeneralResponse<GetContractAssigneeDetails[]>,
      { id: string; contractId?: number; assignerUserId?: number }
    >({
      query: ({ id, contractId, assignerUserId }) => ({
        url: `/v2/Contract/Request/Generation/GetContractAssigneeByContractIdAndAssignerUserId/${id}`,
        method: "GET",
        params: contractId ? { contractId, assignerUserId } : {},
      }),
      providesTags: ["ContractAssignee"],
    }),
    getApprovmentHistoryByContractId: builder.query<
      GeneralResponse<ApprovalHistoryItem[]>,
      number
    >({
      query: (contractId) => ({
        url: `/v1/Contract/Request/ContractAssignee/GetApprovmentHistoryByContractId/${contractId}`,
        method: "GET",
      }),
      providesTags: ["ContractAssignee"],
    }),

    // SubCategory Template Management
    saveSubCategoryTemplate: builder.mutation<
      GeneralResponse<SubCategory>,
      SaveSubCategoryTemplateRequest
    >({
      query: (body) => ({
        url: `/v2/Contract/BasicInfo/SubCategory/Save`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),
    saveSubCategoryPersonalTemplate: builder.mutation<
      GeneralResponse<SubCategory>,
      SaveSubCategoryTemplateRequest
    >({
      query: (body) => ({
        url: `/v2/Contract/BasicInfo/SubCategory/SavePersonal`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),
    updateSubCategoryTemplate: builder.mutation<
      GeneralResponse<SubCategory>,
      { subCategoryId: number; body: SaveSubCategoryTemplateRequest }
    >({
      query: ({ subCategoryId, body }) => ({
        url: `/v2/Contract/BasicInfo/SubCategory/Update/${subCategoryId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),
    updateSubCategoryPersonalTemplate: builder.mutation<
      GeneralResponse<SubCategory>,
      { subCategoryId: number; body: SaveSubCategoryTemplateRequest }
    >({
      query: ({ subCategoryId, body }) => ({
        url: `/v2/Contract/BasicInfo/SubCategory/UpdatePersonal/${subCategoryId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),
    deleteSubCategoryTemplate: builder.mutation<GeneralResponse<null>, number>({
      query: (subCategoryId) => ({
        url: `/v2/Contract/BasicInfo/SubCategory/Delete/${subCategoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contract"],
    }),
    getSubCategoryTemplate: builder.query<
      GeneralResponse<SubCategoryTemplate>,
      number
    >({
      query: (id) => ({
        url: `/v2/Contract/BasicInfo/SubCategory/GetTemplate/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Contract", id }],
    }),

    // SubCategory with Fields Management
    saveSubCategoryWithFields: builder.mutation<
      GeneralResponse<SubCategory>,
      SaveSubCategoryWithFieldsRequest
    >({
      query: (body) => ({
        url: `/v2/Contract/BasicInfo/SubCategory/Save`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),
    updateSubCategoryWithFields: builder.mutation<
      GeneralResponse<SubCategory>,
      { id: number; body: UpdateSubCategoryWithFieldsRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Contract/BasicInfo/SubCategory/Update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Contract"],
    }),
    deleteBySubCategoryId: builder.mutation<GeneralResponse<null>, number>({
      query: (subCategoryId) => ({
        url: `/v2/Contract/BasicInfo/Configuration/DeleteBySubCategoryId/${subCategoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contract"],
    }),

    // Contract Template Management
    getContractTemplates: builder.query<
      GeneralResponse<ContractTemplate[]>,
      void
    >({
      queryFn: async () => {
        // Mock data - replace with actual API call when backend is ready
        const mockTemplates: ContractTemplate[] = [
          {
            TemplateId: 1,
            Name: "قرارداد استاندارد",
            Description: "قالب پایه شامل مواد و بندهای استاندارد",
            ClausesCount: 2,
            TermsCount: 2,
            SubClausesCount: 1,
            CreatedDate: new Date("2024-01-15").toISOString(),
          },
          {
            TemplateId: 2,
            Name: "قرارداد خدمات",
            Description: "قالب مناسب برای قراردادهای ارائه خدمات",
            ClausesCount: 3,
            TermsCount: 3,
            SubClausesCount: 0,
            CreatedDate: new Date("2024-02-20").toISOString(),
          },
          {
            TemplateId: 3,
            Name: "قرارداد استخدام",
            Description: "قالب مخصوص قراردادهای استخدام و کار",
            ClausesCount: 4,
            TermsCount: 5,
            SubClausesCount: 2,
            CreatedDate: new Date("2024-03-10").toISOString(),
          },
          {
            TemplateId: 4,
            Name: "قرارداد پیمانکاری",
            Description: "قالب مناسب برای قراردادهای پیمانکاری و پروژه‌ای",
            ClausesCount: 5,
            TermsCount: 7,
            SubClausesCount: 3,
            CreatedDate: new Date("2024-04-05").toISOString(),
          },
          {
            TemplateId: 5,
            Name: "قرارداد خرید",
            Description: "قالب مخصوص قراردادهای خرید و فروش",
            ClausesCount: 3,
            TermsCount: 4,
            SubClausesCount: 1,
            CreatedDate: new Date("2024-05-12").toISOString(),
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
          data: {
            ResponseCode: 100,
            ResponseMessage: "Success",
            Description: "",
            Data: mockTemplates,
          },
        };
      },
      providesTags: ["Contract"],
    }),
    saveContractTemplate: builder.mutation<
      GeneralResponse<ContractTemplate>,
      { Name: string; Description: string; Clauses: ContractClauseDetails[] }
    >({
      queryFn: async (body) => {
        // Mock implementation - replace with actual API call when backend is ready
        await new Promise((resolve) => setTimeout(resolve, 500));

        const clausesCount = body.Clauses.length;
        const termsCount = body.Clauses.reduce(
          (sum, clause) => sum + clause.Terms.length,
          0,
        );
        const subClausesCount = body.Clauses.reduce(
          (sum, clause) =>
            sum +
            clause.Terms.reduce(
              (termSum, term) => termSum + term.SubClauses.length,
              0,
            ),
          0,
        );

        const newTemplate: ContractTemplate = {
          TemplateId: Date.now(),
          Name: body.Name,
          Description: body.Description,
          ClausesCount: clausesCount,
          TermsCount: termsCount,
          SubClausesCount: subClausesCount,
          CreatedDate: new Date().toISOString(),
          Clauses: body.Clauses,
        };

        return {
          data: {
            ResponseCode: 100,
            ResponseMessage: "Template saved successfully",
            Description: "",
            Data: newTemplate,
          },
        };
      },
      invalidatesTags: ["Contract"],
    }),
  }),
});

export const {
  // Existing exports
  useGetContractCategoriesQuery,
  useGetSubCategoriesByCategoryIdQuery,
  useGetAllSubCategoriesQuery,
  useGetSubCategoryFieldsBySubCategoryIdQuery,
  useGetConfigurationBySubCategoryIdQuery,
  useGetContractFieldValuesByContractIdQuery,
  useGetContractInfoByContractIdQuery,
  useSaveContractFieldValuesMutation,
  useSaveContractRequestMutation,
  useGetContractInfoByRequestIdQuery,

  // Contract Management
  useGetContractByRequestIdQuery,
  useDeleteContractMutation,
  useEditContractMutation,
  useUpdateRequestIdByContractIdMutation,
  useFullEditContractMutation,

  // Clause Management
  useSaveClauseRequestMutation,
  useGetClausesByContractIdQuery,
  useUpdateClauseMutation,
  useDeleteClauseMutation,
  useUpdateClauseSortMutation,

  // Term Management
  useSaveTermMutation,
  useSaveFinalDescriptionByTermIdMutation,
  useResetFinalDescriptionByTermIdMutation,
  useUpdateTermRequestMutation,
  useDeleteTermMutation,
  useGetTermsByClauseIdQuery,
  useUpdateFullTermRequestMutation,
  useSoftDeleteTermMutation,
  useUpdateTermSortMutation,

  // SubClause Management
  useSaveSubClauseRequestMutation,
  useGetSubClausesByTermIdQuery,
  useUpdateSubClauseMutation,
  useDeleteSubClauseMutation,

  // Term Assignee Management
  useGetTermAssigneeWithContractIdAndUserIdQuery,
  useGetTermAssigneeWithContractIdAndAssignerUserIdQuery,
  useSaveTermAssigneeMutation,
  useUpdateTermAssigneeMutation,
  useGetTermAssigneeWithContractIdQuery,
  useGetTermLibrariesByCategotyIdQuery,

  useFullSaveMutation,
  useGetContractDepartmentsQuery,

  // SubCategory Template Management
  useSaveSubCategoryTemplateMutation,
  useSaveSubCategoryPersonalTemplateMutation,
  useUpdateSubCategoryTemplateMutation,
  useUpdateSubCategoryPersonalTemplateMutation,
  useDeleteSubCategoryTemplateMutation,
  useGetSubCategoryTemplateQuery,
  useLazyGetSubCategoryTemplateQuery,

  // SubCategory with Fields Management
  useSaveSubCategoryWithFieldsMutation,
  useUpdateSubCategoryWithFieldsMutation,
  useDeleteBySubCategoryIdMutation,

  // Contract Assignee Management
  useSaveContractAssigneeMutation,
  useUpdateContractAssigneeMutation,
  useGetContractAssigneeWithContractIdAndUserIdQuery,
  useGetContractAssigneeWithContractIdQuery,
  useGetContractAssigneeWithContractIdAndAssignerUserIdQuery,
  useGetApprovmentHistoryByContractIdQuery,

  // Contract Template Management
  useGetContractTemplatesQuery,
  useSaveContractTemplateMutation,
} = contractApi;

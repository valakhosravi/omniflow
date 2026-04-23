import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { Pagination } from "@/models/general-response/pagination";
import {
  CategoryDetails,
  ContractorDetails,
  CreateContractorRequest,
  CreateProjectRequest,
  GetContractorInfo,
  GetContractorProjects,
  GetContractorsQuery,
  ProjectDetails,
  UpdateProjectRequest,
} from "./contractors.type";

function toFormData<TRecord extends Record<string, unknown>>(
  record: TRecord,
): FormData {
  const formData = new FormData();

  Object.entries(record).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (value instanceof File) {
      formData.append(key, value, value.name);
      return;
    }

    if (value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}

export default toFormData;
export const contractorApi = createApi({
  reducerPath: "contractorApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Contractor",
    "ContractorList",
    "ContractorInfo",
    "ContractorCategory",
    "Project",
    "ProjectList",
    "ContractorProjectList",
  ],
  endpoints: (builder) => ({
    getInvoiceCategories: builder.query<
      GeneralResponse<CategoryDetails[]>,
      void
    >({
      query: () => ({
        url: `/v1/Invoice/BasicInfo/Category/GetAll`,
        method: "GET",
      }),
      providesTags: ["ContractorCategory"],
    }),

    // Contractors
    getContractors: builder.query<
      GeneralResponse<Pagination<ContractorDetails>>,
      GetContractorsQuery | void
    >({
      query: (queryParams) => ({
        url: `/v1/Invoice/BasicInfo/Contractor/GetAll`,
        method: "GET",
        params: queryParams ?? {},
      }),
      providesTags: ["ContractorList"],
    }),

    getContractorProjectsByContractorId: builder.query<
      GeneralResponse<Pagination<GetContractorProjects>>,
      { queryParams?: GetContractorsQuery }
    >({
      query: ({ queryParams }) => ({
        url: `/v1/Invoice/BasicInfo/Project/GetContractorProjectsByContractorId`,
        method: "GET",
        params: queryParams ?? {},
      }),
      providesTags: ["ContractorProjectList"],
    }),

    getContractorById: builder.query<
      GeneralResponse<ContractorDetails>,
      number
    >({
      query: (id) => ({
        url: `/v1/Invoice/BasicInfo/Contractor/GetById/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Contractor", id }],
    }),

    getContractorInfo: builder.query<
      GeneralResponse<GetContractorInfo>,
      number
    >({
      query: (id) => ({
        url: `/v1/Invoice/BasicInfo/Contractor/GetInfo/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ContractorInfo", id }],
    }),

    saveContractor: builder.mutation<
      GeneralResponse<null>,
      CreateContractorRequest
    >({
      query: (body) => {
        const formData = toFormData({
          CategoryId: body.CategoryId,
          Name: body.Name,
          Address: body.Address,
          StartDate: body.StartDate,
          Mobile: body.Mobile,
          Phone: body.Phone,
          ContactPoint: body.ContactPoint,
          LogoFile: body.LogoFile ?? undefined,
          VatcertificateFile: body.VatcertificateFile ?? undefined,
          VatstartDate: body.VatstartDate,
          VatendDate: body.VatendDate,
        });

        return {
          url: `/v1/Invoice/BasicInfo/Contractor/Create`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ContractorList"],
    }),

    updateContractor: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: any }
    >({
      query: ({ id, body }) => {
        const formData = toFormData({
          CategoryId: body.CategoryId,
          Name: body.Name,
          Address: body.Address,
          StartDate: body.StartDate,
          Mobile: body.Mobile,
          Phone: body.Phone,
          ContactPoint: body.ContactPoint,
          LogoFile: body.logoFile ?? undefined,
          VatcertificateFile: body.VatCertificateFile ?? undefined,
          VatstartDate: body.VATStartDate,
          VatendDate: body.VATEndDate,
        });
        return {
          url: `/v1/Invoice/BasicInfo/Contractor/Update/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        "ContractorList",
        { type: "Contractor", id },
        { type: "ContractorInfo", id },
      ],
    }),

    deleteContractor: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v1/Invoice/BasicInfo/Contractor/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContractorList"],
    }),

    // Projects
    // getProjects: builder.query<
    //   GeneralResponse<Pagination<ProjectDetails>>,
    //   GetProjectsQuery | void
    // >({
    //   query: (queryParams) => ({
    //     url: `/v2/Invoice/BasicInfo/Project/GetAll`,
    //     method: "GET",
    //     params: queryParams ?? {},
    //   }),
    //   providesTags: ["ProjectList"],
    // }),

    getProjectById: builder.query<GeneralResponse<ProjectDetails>, number>({
      query: (id) => ({
        url: `/v1/Invoice/BasicInfo/Project/GetById/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),
    getProvidedItems: builder.query<
      GeneralResponse<
        {
          ProvidedItemId: number;
          Name: string;
          CreatedDate: string;
        }[]
      >,
      void
    >({
      query: () => ({
        url: `/v1/Invoice/BasicInfo/ProvidedItem/GetAll`,
        method: "GET",
      }),
    }),

    createProject: builder.mutation<
      GeneralResponse<null>,
      CreateProjectRequest
    >({
      query: (body) => {
        const formData = toFormData({
          ApproverGroupKey: body.ApproverGroupKey,
          ProvidedItemId: body.ProvidedItemId,
          BeneficiaryName: body.BeneficiaryName,
          ContractorId: body.ContractorId,
          ContractStatus: body.ContractStatus,
          IBAN: body.IBAN,
          Name: body.Name,
          WarehouseFile: body.WarehouseFile,
          ProvidedItemDescription: body.ProvidedItemDescription,
          WarehouseRequired: body.WarehouseRequired,
        });
        return {
          url: `/v1/Invoice/BasicInfo/Project/Create`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ProjectList", "ContractorProjectList"],
    }),

    updateProject: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateProjectRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v1/Invoice/BasicInfo/Project/Update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "ProjectList",
        "ContractorProjectList",
        { type: "Project", id },
      ],
    }),

    deleteProject: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v1/Invoice/BasicInfo/Project/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProjectList", "ContractorProjectList"],
    }),
  }),
});

export const {
  useGetInvoiceCategoriesQuery,
  useGetProvidedItemsQuery,
  useGetContractorsQuery,
  useGetContractorByIdQuery,
  useGetContractorInfoQuery,
  useSaveContractorMutation,
  useUpdateContractorMutation,
  // useUpdateContractorVATMutation,
  useDeleteContractorMutation,
  // useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetContractorProjectsByContractorIdQuery,
} = contractorApi;

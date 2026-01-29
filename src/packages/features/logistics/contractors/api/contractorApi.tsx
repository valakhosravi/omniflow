import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { Pagination } from "@/packages/core/types/api/pagination";

export interface CategoryDetails {
  Name: string | null;
  CategoryId: number;
  CreatedDate: string; // ISO date-time
}

export interface ContractorDetails {
  ContractorId: number;
  CategoryId: number;
  UserId: number;
  Name: string | null;
  Address: string | null;
  Mobile: string | null;
  Phone: string | null;
  StartDate: string; // ISO date-time
  ContactPoint: string | null;
  LogoAddress: string | null;
  VatcertificateAddress: string | null;
  VatstartDate: string | null; // ISO date-time | null
  VatendDate: string | null; // ISO date-time | null
  CreatedDate: string; // ISO date-time
  LastCollabrationDate: string;
}

export interface GetContractorProjects {
  ProjectId: number;
  ContractorId: number;
  UserId: number;
  Name: string;
  BeneficiaryName: string;
  ContractNumber: string;
  ContractStartDate: string;
  ContractEndDate: string;
  ContractStatus: number;
  ContractAmount: number;
  IBAN: string;
  CreatedDate: string;
}

export interface GetContractorInfo {
  Name: string;
  Address: string;
  LogoAddress: string;
  VATCertificateAddress: string;
  TotalProjects: number;
  VATStartDate: string;
  VATEndDate: string;
  Phones: string;
  CategoryName: string;
  CategoryId: number;
  FirstCollabrationDate: string;
  LastCollabrationDate: string;
}

export interface ProjectDetails {
  ProjectId: number;
  ContractorId: number;
  UserId: number;
  Name: string | null;
  BeneficiaryName: string | null;
  ContractNumber: string | null;
  ContractStartDate: string | null;
  ContractEndDate: string | null;
  ContractStatus: number;
  ContractAmount: number | null;
  IBAN: string | null;
  CreatedDate: string;
}

export interface SaveProjectRequest {
  ContractorId: number;
  Name?: string | null;
  BeneficiaryName?: string | null;
  ContractNumber?: string | null;
  ContractStartDate?: string | null;
  ContractEndDate?: string | null;
  ContractStatus: number;
  ContractAmount?: number | null;
  IBAN?: string | null;
}

export interface UpdateProjectRequest {
  Name?: string | null;
  BeneficiaryName?: string | null;
  ContractNumber?: string | null;
  ContractStartDate?: string | null;
  ContractEndDate?: string | null;
  ContractStatus?: number | null;
  ContractAmount?: number | null;
  IBAN?: string | null;
}

export interface GetProjectsQuery {
  SearchTerm?: string;
  PageNumber?: number;
  PageSize?: number;
  SortOrder?: string;
  Status?: number;
  StartDate?: string;
  EndDate?: string;
}

// Request models
export interface SaveContractorRequest {
  CategoryId?: number;
  Name: string;
  Address: string;
  StartDate: string; // ISO date-time
  Mobile?: string;
  Phone?: string;
  ContactPoint: string;
  logoFile?: File | null;
  VatCertificateFile?: File | null;
  VATStartDate?: string; // ISO date-time
  VATEndDate?: string; // ISO date-time
}

export type UpdateContractorRequest = SaveContractorRequest;

export interface UpdateVatRequest {
  vatcertificateFile?: File | null;
  vatstartDate?: string; // ISO date-time
  vatendDate?: string; // ISO date-time
}

export interface GetContractorsQuery {
  SearchTerm?: string;
  PageNumber?: number;
  PageSize?: number;
  SortOrder?: string;
}

function toFormData<TRecord extends Record<string, unknown>>(
  record: TRecord
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
    // Category
    getInvoiceCategories: builder.query<
      GeneralResponse<CategoryDetails[]>,
      void
    >({
      query: () => ({
        url: `/v2/Invoice/BasicInfo/Category/GetCategories`,
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
        url: `/v2/Invoice/BasicInfo/Contractor/GetAll`,
        method: "GET",
        params: queryParams ?? {},
      }),
      providesTags: ["ContractorList"],
    }),

    getContractorProjectsByContractorId: builder.query<
      GeneralResponse<Pagination<GetContractorProjects>>,
      { id: number; queryParams?: GetContractorsQuery }
    >({
      query: ({ id, queryParams }) => ({
        url: `/v2/Invoice/BasicInfo/Project/GetContractorProjectsByContractorId/${id}`,
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
        url: `/v2/Invoice/BasicInfo/Contractor/GetById/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Contractor", id }],
    }),

    getContractorInfo: builder.query<
      GeneralResponse<GetContractorInfo>,
      number
    >({
      query: (id) => ({
        url: `/v2/Invoice/BasicInfo/Contractor/GetInfo/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ContractorInfo", id }],
    }),

    saveContractor: builder.mutation<
      GeneralResponse<null>,
      SaveContractorRequest
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
          LogoFile: body.logoFile ?? undefined,
          VatcertificateFile: body.VatCertificateFile ?? undefined,
          VatstartDate: body.VATStartDate,
          VatendDate: body.VATEndDate,
        });
        return {
          url: `/v2/Invoice/BasicInfo/Contractor/Save`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ContractorList"],
    }),

    updateContractor: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateContractorRequest }
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
          url: `/v2/Invoice/BasicInfo/Contractor/Update/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "ContractorList",
        { type: "Contractor", id },
        { type: "ContractorInfo", id },
      ],
    }),

    updateContractorVAT: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateVatRequest }
    >({
      query: ({ id, body }) => {
        const formData = toFormData({
          VatcertificateFile: body.vatcertificateFile ?? undefined,
          VatstartDate: body.vatstartDate,
          VatendDate: body.vatendDate,
        });
        return {
          url: `/v2/Invoice/BasicInfo/Contractor/UpdateVAT/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Contractor", id },
        { type: "ContractorInfo", id },
      ],
    }),

    deleteContractor: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Invoice/BasicInfo/Contractor/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContractorList"],
    }),

    // Projects
    getProjects: builder.query<
      GeneralResponse<Pagination<ProjectDetails>>,
      GetProjectsQuery | void
    >({
      query: (queryParams) => ({
        url: `/v2/Invoice/BasicInfo/Project/GetAll`,
        method: "GET",
        params: queryParams ?? {},
      }),
      providesTags: ["ProjectList"],
    }),

    getProjectById: builder.query<GeneralResponse<ProjectDetails>, number>({
      query: (id) => ({
        url: `/v2/Invoice/BasicInfo/Project/GetById/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),

    saveProject: builder.mutation<GeneralResponse<null>, SaveProjectRequest>({
      query: (body) => ({
        url: `/v2/Invoice/BasicInfo/Project/Save`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProjectList", "ContractorProjectList"],
    }),

    updateProject: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateProjectRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Invoice/BasicInfo/Project/Update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "ProjectList",
        "ContractorProjectList",
        { type: "Project", id },
      ],
    }),

    deleteProject: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Invoice/BasicInfo/Project/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProjectList", "ContractorProjectList"],
    }),
  }),
});

export const {
  useGetInvoiceCategoriesQuery,
  useGetContractorsQuery,
  useGetContractorByIdQuery,
  useGetContractorInfoQuery,
  useSaveContractorMutation,
  useUpdateContractorMutation,
  useUpdateContractorVATMutation,
  useDeleteContractorMutation,
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useSaveProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetContractorProjectsByContractorIdQuery
} = contractorApi;

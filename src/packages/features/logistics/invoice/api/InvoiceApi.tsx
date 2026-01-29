import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import GeneralResponse from "@/packages/core/types/api/general_response";
import {
  getInvoiceApprover,
  getInvoiceByRequestId,
  SaveInvoiceRequest,
  UpdateInvoiceRequest,
  UpdatePaymentStatusRequest,
  SaveInvoiceDetailRequest,
  GetAllInvoiceDetailsPagination,
  GetProvidedItems,
  GetDeputyUsersModel,
  GetRejectionReasons,
  GetUserInGroup,
} from "../types/InvoiceModels";

export const InvoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["InvoiceById"],
  endpoints: (builder) => ({
    getInvoiceByRequestId: builder.query<
      GeneralResponse<getInvoiceByRequestId>,
      number
    >({
      query: (id) => ({
        url: `/v2/Invoice/Request/Invoice/GetByRequestId/${id}`,
        method: "GET",
      }),
      providesTags: ["InvoiceById"],
    }),

    getInvoiceApprover: builder.query<
      GeneralResponse<getInvoiceApprover[]>,
      void
    >({
      query: () => ({
        url: `/v2/Invoice/Request/Invoice/GetInvoiceApprover`,
        method: "GET",
      }),
    }),

    saveInvoice: builder.mutation<GeneralResponse<void>, SaveInvoiceRequest>({
      query: (body) => ({
        url: `/v2/Invoice/Request/Invoice/Save`,
        method: "POST",
        body,
      }),
    }),

    updateInvoice: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdateInvoiceRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Invoice/Request/Invoice/Update/${id}`,
        method: "PUT",
        body,
      }),
    }),

    updatePaymentStatus: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: UpdatePaymentStatusRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Invoice/Request/Invoice/UpdatePaymentStatus/${id}`,
        method: "PUT",
        body,
      }),
    }),

    getAllInvoices: builder.query<
      GeneralResponse<GetAllInvoiceDetailsPagination>,
      {
        SearchTerm?: string;
        StartDate?: string;
        EndDate?: string;
        PageNumber?: number;
        PageSize?: number;
        SortColumn?: string;
        SortOrder?: string;
      }
    >({
      query: (params) => ({
        url: `/v2/Invoice/Request/Invoice/GetAll`,
        method: "GET",
        params,
      }),
    }),

    getInvoicesByProjectId: builder.query<
      GeneralResponse<GetAllInvoiceDetailsPagination>,
      {
        id: number;
        SearchTerm?: string;
        StartDate?: string;
        EndDate?: string;
        PageNumber?: number;
        PageSize?: number;
        SortColumn?: string;
        SortOrder?: string;
      }
    >({
      query: ({ id, ...params }) => ({
        url: `/v2/Invoice/Request/Invoice/GetInvoicesByProjectId/${id}`,
        method: "GET",
        params,
      }),
    }),

    saveInvoiceDetail: builder.mutation<
      GeneralResponse<null>,
      SaveInvoiceDetailRequest & { WarehouseFile?: File }
    >({
      query: ({ WarehouseFile, ...data }) => {
        const formData = new FormData();
        if (WarehouseFile) formData.append("WarehouseFile", WarehouseFile);
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) formData.append(key, String(value));
        });

        return {
          url: `/v2/Invoice/Request/InvoiceDetail/Save`,
          method: "POST",
          body: formData,
        };
      },
    }),

    getProvidedItems: builder.query<GeneralResponse<GetProvidedItems[]>, void>({
      query: () => ({
        url: `/v2/Invoice/Request/Invoice/GetProvidedItems`,
        method: "GET",
      }),
    }),

    getDeputyUsers: builder.query<
      GeneralResponse<GetDeputyUsersModel[]>,
      number
    >({
      query: (id) => ({
        url: `/v2/HumanResource/Personnel/BasicInfo/GetDeputyUsers/${id}`,
        method: "GET",
      }),
    }),

    updateWarehouseReceipeFile: builder.mutation<
      GeneralResponse<null>,
      { id: number; receipeFile: File }
    >({
      query: ({ id, receipeFile }) => {
        const formData = new FormData();
        if (receipeFile) {
          formData.append("WarehouseReceipeFile", receipeFile);
        }

        return {
          url: `/v2/Invoice/Request/InvoiceDetail/UpdateWarehouseReceipeFile/${id}`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    getRejectionReasons: builder.query<
      GeneralResponse<GetRejectionReasons[]>,
      void
    >({
      query: () => ({
        url: `/v2/Invoice/Request/Invoice/GetRejectionReasons`,
        method: "GET",
      }),
    }),
    getUserInGroup: builder.query<GeneralResponse<GetUserInGroup[]>, string>({
      query: (GroupKey) => ({
        url: `/v2/User/BasicInfo/Account/GetUserInGroup?GroupKey=${GroupKey}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetInvoiceByRequestIdQuery,
  useGetInvoiceApproverQuery,
  useSaveInvoiceMutation,
  useUpdateInvoiceMutation,
  useUpdatePaymentStatusMutation,
  useGetAllInvoicesQuery,
  useGetInvoicesByProjectIdQuery,
  useSaveInvoiceDetailMutation,
  useGetProvidedItemsQuery,
  useGetDeputyUsersQuery,
  useUpdateWarehouseReceipeFileMutation,
  useGetRejectionReasonsQuery,
  useGetUserInGroupQuery,
} = InvoiceApi;

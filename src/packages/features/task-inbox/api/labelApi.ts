import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { CreateLabelRequest } from "../types/CreateLabelRequest";
import { LabelType } from "../types/labelType";

interface CreateLabelResponse {
  ResponseCode: string;
  ResponseMessage: string;
}

type EditLabelRequest = CreateLabelRequest;

export const labelApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Label"],
  endpoints: (builder) => ({
    getAllLabels: builder.query<GeneralResponse<LabelType[]>, void>({
      query: () => ({
        url: "/v2/Process/Operation/Label/GetAll",
        method: "GET",
      }),
      providesTags: [{ type: "Label", id: "LIST" }],
    }),

    createLabel: builder.mutation<GeneralResponse<null>, CreateLabelRequest>({
      query: (body) => ({
        url: "/v2/Process/Operation/Label/Create",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      }),
      invalidatesTags: [{ type: "Label", id: "LIST" }],
    }),
    editLabel: builder.mutation<
      CreateLabelResponse,
      { id: number; body: EditLabelRequest }
    >({
      query: ({ id, body }) => ({
        url: `/v2/Process/Operation/Label/Edit/${id}`,
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      }),
      invalidatesTags: [{ type: "Label", id: "LIST" }],
    }),
    deleteLabel: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Process/Operation/Label/Delete/${id}`,
        method: "DELETE",
        headers: {
          Accept: "text/plain",
        },
      }),
      invalidatesTags: [{ type: "Label", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllLabelsQuery,
  useCreateLabelMutation,
  useEditLabelMutation,
  useDeleteLabelMutation,
} = labelApi;

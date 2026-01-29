import GeneralResponse from "@/models/general-response/general_response";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AttachmentByRequestId,
  GetDeputyUsersModel,
  GroupUser,
  SaveAndUploadRequestType,
  SaveProcessAttachmentModel,
  StackHolder,
  StackHolderDirector,
} from "./commonApi.type";
import { buildSaveProcessAttachmentFormData } from "@/utils/saveAttachmentBuilder";

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["attachmentByRequestId", "groupUserByProperty"],
  endpoints: (builder) => ({
    // Application endpoints
    getAttachmentByRequestId: builder.query<
      GeneralResponse<AttachmentByRequestId[]>,
      number
    >({
      query: (requestId) => ({
        url: `/v2/Process/Operation/Attachment/GetByRequestId/${requestId}`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [
        { type: "attachmentByRequestId", id: requestId },
      ],
    }),
    deleteAttachmentAndFileByAttachmentId: builder.mutation<
      GeneralResponse<null>,
      number
    >({
      query: (attachmentId) => ({
        url: `/v2/Process/Operation/Attachment/DeleteAttachmentAndFile/${attachmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["attachmentByRequestId"],
    }),

    saveProcessAttachment: builder.mutation<any, SaveProcessAttachmentModel>({
      query: (data) => {
        const formData = buildSaveProcessAttachmentFormData(data);

        return {
          url: `/v2/Process/Operation/Attachment/SaveProcessAttachment`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["attachmentByRequestId"],
    }),
    uploadAndSaveAttachment: builder.mutation<any, SaveAndUploadRequestType>({
      query: (data) => {
        const formData = buildSaveProcessAttachmentFormData(data);

        return {
          url: `/v2/Process/Operation/Attachment/UploadAndSaveAttachment`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["attachmentByRequestId"],
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

    getStackHolders: builder.query<GeneralResponse<StackHolder[]>, void>({
      query: () => ({
        url: `/v2/Process/jira/Issue/GetStackHolders`,
        method: "GET",
      }),
      providesTags: () => [{ type: "groupUserByProperty" }],
    }),

    getStackHolderDirectors: builder.query<
      GeneralResponse<StackHolderDirector[]>,
      void
    >({
      query: () => ({
        url: `/v2/Process/Jira/Issue/GetStackHolderDirectors`,
        method: "GET",
      }),
      providesTags: () => [{ type: "groupUserByProperty" }],
    }),
    getGroupUserByProperty: builder.query<GeneralResponse<GroupUser>, string>({
      query: (property) => ({
        url: `/v2/Process/Jira/User/GetGroupUsersByProperty?Department=${property}&PropertyType=1`,
        method: "GET",
      }),
      providesTags: () => [{ type: "groupUserByProperty" }],
    }),
  }),
});

export const {
  useDeleteAttachmentAndFileByAttachmentIdMutation,
  useSaveProcessAttachmentMutation,
  useUploadAndSaveAttachmentMutation,
  useGetAttachmentByRequestIdQuery,
  useGetDeputyUsersQuery,
  useGetStackHoldersQuery,
  useGetStackHolderDirectorsQuery,
  useGetGroupUserByPropertyQuery
} = commonApi;

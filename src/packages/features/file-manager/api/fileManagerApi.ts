import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import GeneralResponse from "@/packages/core/types/api/general_response";

// Types for the upload file request
export interface UploadFileRequest {
  FileUpload: File;
  BucketName: string;
  Path: string;
  FileName: string;
}

// Types for the upload file response data
export interface UploadFileResponseData {
  Message: string;
  FilePath: string;
  FileUrl: string;
  FileContent: string;
}

export interface DeleteFileRequest {
  BucketName: string;
  Path: string;
}

export const fileManagerApi = createApi({
  reducerPath: "fileManagerApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["File", "DeleteFile"],
  endpoints: (builder) => ({
    uploadFile: builder.mutation<
      GeneralResponse<UploadFileResponseData>,
      UploadFileRequest
    >({
      query: ({ FileUpload, BucketName, Path, FileName }) => {
        // Create FormData for multipart/form-data request
        const formData = new FormData();
        formData.append("FileUpload", FileUpload);
        formData.append("BucketName", BucketName);
        formData.append("Path", Path);
        formData.append("FileName", FileName);

        return {
          url: "/v2/FileManager/UploadFile",
          method: "POST",
          body: formData,
          // Don't set Content-Type header, let the browser set it with boundary for multipart/form-data
        };
      },
      invalidatesTags: ["File"],
    }),
    deleteFile: builder.mutation<GeneralResponse<null>, DeleteFileRequest>({
      query: ({ BucketName, Path }) => {
        return {
          url: `/v2/FileManager/DeleteFile?bucketName=${BucketName}&path=${Path}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["DeleteFile"],
    }),
  }),
});

export const { useUploadFileMutation, useDeleteFileMutation } = fileManagerApi;

import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { GetUnRead } from "../types/UnReadTasks";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";

interface UpdateIsReadRequest {
  UserId: number;
  RequestId: number;
}

interface UpdateGroupIsReadRequest {
  RequestId: number;
  GroupKey: string;
}

interface GetUnreadCount {
  GroupCount: number;
  UserCount: number;
  TotalCount: number;
}

export const ReadApi = createApi({
  reducerPath: "readApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["unReads", "unReadcount"],
  endpoints: (builder) => ({
    updateIsRead: builder.mutation<GeneralResponse<null>, UpdateIsReadRequest>({
      query: (body) => ({
        url: "/v2/Process/Operation/Observed/UpdateIsRead",
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      }),
      invalidatesTags: ["unReadcount", "unReads"],
    }),
    updateGroupIsRead: builder.mutation<
      GeneralResponse<null>,
      UpdateGroupIsReadRequest
    >({
      query: (body) => ({
        url: "/v2/Process/Operation/Observed/UpdateGroupIsRead",
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      }),
      invalidatesTags: ["unReadcount", "unReads"],
    }),
    getUnread: builder.query<GeneralResponse<GetUnRead[]>, void>({
      query: () => ({
        url: `/v2/Process/Operation/Observed/GetUnRead`,
        method: "GET",
      }),
      providesTags: ["unReads"],
    }),
    getUnreadCount: builder.query<GeneralResponse<GetUnreadCount>, void>({
      query: () => ({
        url: `/v2/Process/Operation/Observed/GetUnReadCount`,
        method: "GET",
      }),
      providesTags: ["unReadcount"],
    }),
  }),
});

export const {
  useUpdateIsReadMutation,
  useUpdateGroupIsReadMutation,
  useGetUnreadQuery,
  useGetUnreadCountQuery,
} = ReadApi;

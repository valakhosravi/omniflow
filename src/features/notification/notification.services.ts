import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { allNotification } from "../../packages/features/task-inbox/types/NotificationModels";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["notification"],
  endpoints: (builder) => ({
    getAllUserNotification: builder.query<
      GeneralResponse<allNotification[]>,
      boolean | void
    >({
      query: (isRead) => {
        const params = typeof isRead === "boolean" ? `?isRead=${isRead}` : "";

        return {
          url: `/v2/Site/Setting/Notification/GetAllUserNotifications${params}`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        };
      },
    }),
    updateIsRead: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Site/Setting/Notification/UpdateIsRead/${id}`,
        method: "PUT",
        headers: {
          Accept: "application/json",
        },
      }),
    }),
  }),
});

export const { useGetAllUserNotificationQuery, useUpdateIsReadMutation } =
  notificationApi;

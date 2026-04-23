import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { CreateSnoozeRequest } from "../types/CreateSnoozeRequest";
import { camundaApi } from "@/packages/camunda";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";

export const SnoozeApi = createApi({
  reducerPath: "snoozeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Snooze"],
  endpoints: (builder) => ({
    createSnooze: builder.mutation<GeneralResponse<null>, CreateSnoozeRequest>({
      query: (body) => ({
        url: "/v2/Process/Operation/Snooze/Create",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(camundaApi.util.invalidateTags(["Task", "Request"]));
        } catch (err) {
          console.error("Error invalidating tags:", err);
        }
      },
      // invalidatesTags: [{ type: "Snooze", id: "LIST" }],
    }),
    editSnooze: builder.mutation<GeneralResponse<null>, CreateSnoozeRequest>({
      query: (body) => ({
        url: `/v2/Process/Operation/Snooze/Edit`,
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(camundaApi.util.invalidateTags(["Task", "Request"]));
        } catch (err) {
          console.error("Error invalidating tags:", err);
        }
      },
    }),
    deleteSnooze: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/Process/Operation/Snooze/Delete/${id}`,
        method: "DELETE",
        headers: {
          Accept: "text/plain",
        },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(camundaApi.util.invalidateTags(["Task", "Request"]));
        } catch (err) {
          console.error("Error invalidating tags:", err);
        }
      },
    }),
  }),
});

export const {
  useCreateSnoozeMutation,
  useDeleteSnoozeMutation,
  useEditSnoozeMutation,
} = SnoozeApi;

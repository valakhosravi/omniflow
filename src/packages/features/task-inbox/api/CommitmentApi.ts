import GeneralResponse from "@/packages/core/types/api/general_response";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { GetCommitments, saveCommitment } from "../types/CommitmentModels";

export const commitmentApi = createApi({
  reducerPath: "commitmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["commitment"],
  endpoints: (builder) => ({
    getCommitmentLetter: builder.query<GeneralResponse<GetCommitments>, void>(
      {
        query: () => {
          return {
            url: `/v2/Site/Setting/CommitmentLetter/GetCommitmenetLetter`,
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          };
        },
      }
    ),
    saveCommitmentLetter: builder.mutation<
      GeneralResponse<null>,
      saveCommitment
    >({
      query: (body) => {
        return {
          url: `/v2/Site/Setting/CommitmentLetter/SaveCommitmentLetter`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body, 
        };
      },
    }),
  }),
});

export const { useGetCommitmentLetterQuery, useSaveCommitmentLetterMutation } =
  commitmentApi;

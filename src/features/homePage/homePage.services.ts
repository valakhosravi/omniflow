import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import CreateFavoriteInput, {
  favoriteModel,
  searchRequestModel,
  UpdateFavorite,
  urlSearchResponseModel,
} from "./homePage.types";
import { SearchResponseModel } from "@/components/common/AppHeader/Header.type";

export const homePageApi = createApi({
  reducerPath: "homePageApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["favoriteList"],
  endpoints: (builder) => ({
    search: builder.mutation<SearchResponseModel[], searchRequestModel>({
      query: (body) => ({
        url: `search`,
        method: "POST",
        body,
      }),
    }),
    searchURL: builder.query<GeneralResponse<urlSearchResponseModel>, string>({
      query: (url) => ({
        url: `/api/v2/site/setting/menu/GetByUrl?url=${url}`,
        method: "GET",
      }),
    }),

    getAllFavorite: builder.query<GeneralResponse<favoriteModel[]>, void>({
      query: () => ({
        url: `/v2/site/setting/Favorite/GetAll`,
        method: "GET",
      }),
      providesTags: ["favoriteList"],
    }),

    updateFavoriteOrder: builder.mutation<
      GeneralResponse<null>,
      {
        body: UpdateFavorite[];
      }
    >({
      query: ({ body }) => ({
        url: `/v1/site/setting/Favorite/UpdateOrders`,
        method: "PUT",
        body,
      }),
      invalidatesTags: () => ["favoriteList"],
    }),

    editFavorite: builder.mutation<
      GeneralResponse<null>,
      { id: number; body: { MenuId: number; ColorCode: string } }
    >({
      query: ({ id, body }) => ({
        url: `/v2/site/setting/Favorite/Edit/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: () => ["favoriteList"],
    }),

    deleteFavorite: builder.mutation<GeneralResponse<null>, number>({
      query: (id) => ({
        url: `/v2/site/setting/Favorite/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ["favoriteList"],
    }),
    createFavorite: builder.mutation<
      GeneralResponse<null>,
      CreateFavoriteInput
    >({
      query: (body) => ({
        url: `/v2/site/setting/Favorite/Create`,
        method: "POST",
        body,
      }),
      invalidatesTags: () => ["favoriteList"],
    }),
  }),
});
export const {
  useSearchMutation,
  useSearchURLQuery,
  useEditFavoriteMutation,
  useGetAllFavoriteQuery,
  useUpdateFavoriteOrderMutation,
  useDeleteFavoriteMutation,
  useCreateFavoriteMutation,
} = homePageApi;

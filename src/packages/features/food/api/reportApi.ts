import { createApi } from "@reduxjs/toolkit/query/react";
import { GetOrderByPlanId } from "@/models/food/report/OrderByPlanId";
import { DailyOrders } from "@/models/food/report/MealOrderByPlanId";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { baseQueryWithReauth } from "@/store/core/baseQuery";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Report"],
  endpoints: (builder) => ({
    getOrderByPlanId: builder.query<GeneralResponse<GetOrderByPlanId>, number>({
      query: (planId) => ({
        url: `/admin/v2/Food/Management/Report/GetOrderReportByPlanId/${planId}`,
        method: "GET",
      }),
      providesTags: (_result, _errors, planId) => [
        { type: "Report", id: `order-${planId}` },
      ],
    }),

    getMealOrderByPlanId: builder.query<GeneralResponse<DailyOrders[]>, number>(
      {
        query: (planId) => ({
          url: `/admin/v2/Food/Management/Report/GetMealOrdersReportByPlanId/${planId}`,
          method: "GET",
        }),
        providesTags: (_result, _error, planId) => [
          { type: "Report", id: `meal-order-${planId}` },
        ],
      },
    ),
  }),
});

export const {
  useGetOrderByPlanIdQuery,
  useGetMealOrderByPlanIdQuery,
  useLazyGetOrderByPlanIdQuery,
  useLazyGetMealOrderByPlanIdQuery,
} = reportApi;

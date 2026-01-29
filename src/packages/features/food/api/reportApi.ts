import { createApi } from '@reduxjs/toolkit/query/react';
import { GetOrderByPlanId } from '@/models/food/report/OrderByPlanId';
import { DailyOrders } from '@/models/food/report/MealOrderByPlanId';
import GeneralResponse from '@/models/general-response/general_response';
import { baseQueryWithReauth } from '@/store/core/baseQuery';

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Report'],
  endpoints: (builder) => ({
    getOrderByPlanId: builder.query<GeneralResponse<GetOrderByPlanId>, number>({
      query: (planId) => ({
        url: `/admin/v2/Food/Management/Report/GetOrderReportByPlanId/${planId}`,
        method: 'GET',
      }),
      providesTags: (result, error, planId) => [
        { type: 'Report', id: `order-${planId}` }
      ],
    }),
    
    getMealOrderByPlanId: builder.query<GeneralResponse<DailyOrders[]>, number>({
      query: (planId) => ({
        url: `/admin/v2/Food/Management/Report/GetMealOrdersReportByPlanId/${planId}`,
        method: 'GET',
      }),
      providesTags: (result, error, planId) => [
        { type: 'Report', id: `meal-order-${planId}` }
      ],
    }),
  }),
});

export const {
  useGetOrderByPlanIdQuery,
  useGetMealOrderByPlanIdQuery,
  useLazyGetOrderByPlanIdQuery,
  useLazyGetMealOrderByPlanIdQuery,
} = reportApi;
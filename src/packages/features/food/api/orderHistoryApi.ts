import { createApi } from '@reduxjs/toolkit/query/react';
import { OrderHistoryResponse } from '@/models/food/order/OrderHistory';
import { baseQueryWithReauth } from '@/store/core/baseQuery';

interface GetOrderHistoryParams {
  pageNumber: number;
  pageSize: number;
}

export const orderHistoryApi = createApi({
  reducerPath: 'orderHistoryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['OrderHistory'],
  endpoints: (builder) => ({
    getOrderHistory: builder.query<
      OrderHistoryResponse,
      GetOrderHistoryParams
    >({
      query: ({ pageNumber, pageSize }) => ({
        url: `/v2/Food/Client/Order/History?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'OrderHistory', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetOrderHistoryQuery,
  useLazyGetOrderHistoryQuery,
} = orderHistoryApi;

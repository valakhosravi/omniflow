import { createApi } from '@reduxjs/toolkit/query/react';
import { SigninRequest, SigninResponse } from '../types';
import GeneralResponse from '@/packages/core/types/api/general_response';
import { baseQueryWithReauth } from '@/store/core/baseQuery';
import { UserDetail } from '../types/UserDetail';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    signin: builder.mutation<GeneralResponse<SigninResponse>, SigninRequest>({
      query: (credentials) => ({
        url: '/v2/User/Authentication/Identity/ldapLogin',
        method: 'POST',
        body: {
          ...credentials,
          domain: 'test',
        },
      }),
      invalidatesTags: ['User'],
    }),
    signinTest: builder.mutation<GeneralResponse<SigninResponse>, SigninRequest>({
      query: (credentials) => ({
        url: '/v2/User/Authentication/Identity/login',
        method: 'POST',
        body: {
          ...credentials,
          domain: 'test',
        },
      }),
      invalidatesTags: ['User'],
    }),
    
    logout: builder.mutation<GeneralResponse<null>, void>({
      query: () => ({
        url: '/v2/User/Authentication/Identity/Logout',
        method: 'POST',
      }),
      // Don't invalidate User tag on logout since we manually clear the state
      // This prevents GetUserDetail from being triggered after logout
    }),
    
    getUser: builder.query<GeneralResponse<UserDetail>, void>({
      query: () => '/v2/User/BasicInfo/Account/GetUserDetail',
      providesTags: ['User'],
    }),
    
    getUserById: builder.query<GeneralResponse<UserDetail>, number>({
      query: (userId) => `/v2/User/BasicInfo/Account/GetUserDetailByUserId/${userId}`,
      providesTags: ['User'],
    }),
  }),
});

export const {
  useSigninMutation,
  useSigninTestMutation,
  useLogoutMutation,
  useGetUserQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
} = authApi;

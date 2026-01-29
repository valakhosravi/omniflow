import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include'
});

// Transform FetchBaseQueryError to Axios-like error format for getErrorMessage
const transformErrorForGetErrorMessage = (error: FetchBaseQueryError, originalArgs: string | FetchArgs) => {
  const url = typeof originalArgs === 'string' ? originalArgs : originalArgs.url;
  
  return {
    isAxiosError: true,
    response: {
      status: error.status,
      data: error.data
    },
    config: {
      url: url
    },
    message: error.data && typeof error.data === 'string' ? error.data : 'Request failed'
  };
};

// Track ongoing refresh token request
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Transform error for getErrorMessage if there's an error
  if (result.error) {
    const transformedError = transformErrorForGetErrorMessage(result.error, args);
    const errorMessage = getErrorMessage(transformedError);
    
    // If getErrorMessage returns an empty string for 401 (non-refresh token), 
    // we still want to handle the refresh logic
    if (result.error.status === 401) {
      // If we're already refreshing, wait for the existing refresh to complete
      if (isRefreshing && refreshPromise) {
        await refreshPromise;
        // Retry the original query after refresh completes
        result = await baseQuery(args, api, extraOptions);
      } else if (!isRefreshing) {
        // Start a new refresh process
        isRefreshing = true;
        refreshPromise = Promise.resolve(baseQuery(
          {
            url: '/v2/User/Authentication/Identity/RefreshToken',
            method: 'POST',
          },
          api,
          extraOptions
        ));

        try {
          const refreshResult = await refreshPromise;
          
          if (refreshResult.data) {
            // Check if refresh was successful based on ResponseCode
            const refreshData = refreshResult.data as any;
            if (refreshData.ResponseCode === 103 || refreshData.ResponseCode === 106) {
              // Invalid refresh token, navigate to logout
              console.error('Invalid refresh token:', refreshData.ResponseMessage);
              window.location.href = '/logout';
              return result; // Return the original 401 error
            }
            
            // Retry the original query with new token
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Refresh failed, navigate to logout
            console.error('Token refresh failed');
            window.location.href = '/logout';
          }
        } finally {
          // Reset the refresh state
          isRefreshing = false;
          refreshPromise = null;
        }
      }
    }
  }

  return result;
};

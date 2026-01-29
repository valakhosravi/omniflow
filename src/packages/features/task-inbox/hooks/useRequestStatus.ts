import { useGetLastRequestStatusQuery } from "../api/RequestApi";

interface UseRequestStatusParams {
  requestId: number;
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean;
}

export const useRequestStatus = ({ 
  requestId, 
  skip = false, 
  refetchOnMountOrArgChange = true 
}: UseRequestStatusParams) => {
  const { 
    data, 
    error, 
    isLoading, 
    refetch, 
    isFetching, 
    isError,
    isSuccess 
  } = useGetLastRequestStatusQuery(requestId, {
    skip: !requestId || skip,
    refetchOnMountOrArgChange,
  });

  return {
    requestStatus: data?.Data,
    error,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch,
    hasData: !!data?.Data,
  };
};

// Alternative hook for when you just need the requestId as a parameter
export const useRequestStatusById = (requestId: number) => {
  return useRequestStatus({ requestId });
};

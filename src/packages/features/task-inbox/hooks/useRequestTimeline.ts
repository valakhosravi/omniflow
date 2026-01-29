import { useGetRequestTimelineQuery } from "../api/RequestApi";

interface useRequestTimelineParams {
  requestId: number;
}

export const useRequestTimeline = ({ requestId }: useRequestTimelineParams) => {
  const { data, error, isLoading, refetch } = useGetRequestTimelineQuery(
    requestId,
    {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    }
  );
  return {
    requestTimeline: data,
    isLoading,
    refetch,
    error,
  };
};

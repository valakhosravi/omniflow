import { useGetEmploymentCertificateByRequestIdQuery } from "../api/employmentCertificateApi";

export const useEmploymentCertificate = (requestId: string) => {
  const { data, error, isLoading, refetch, isFetching } =
    useGetEmploymentCertificateByRequestIdQuery(requestId, {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    });

  return {
    employmentCertificateData: data?.Data,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};
import {
  GetBasicInfoByPersonnelId,
  GetByRequestId,
} from "@/services/process/humanResource";
import { useGetRequestByIdQuery } from "@/packages/features/task-inbox/api/RequestApi";
import { useGetEmployeeInfoByPersonnelIdQuery } from "@/packages/features/task-inbox/api/employmentCertificateApi";
import { useGuardedQuery } from "../useGuardedQuery";

export function useGetBasicInfoByPersonnelId(
  personnelId: string | null | undefined
) {
  const { data: basicInfoData, isLoading: basicInfoIsLoading } =
    useGuardedQuery({
      queryFn: () => GetBasicInfoByPersonnelId(personnelId!),
      queryKey: ["GetBasicInfoByPersonnelId", personnelId],
      enabled: !!personnelId,
      retry: false,
      staleTime: 0,
    });

  return { basicInfoData, basicInfoIsLoading };
}

export function useGetByRequestId(requestId: number | null | undefined) {
  const { data: requestData, isLoading: requestIsLoading } = useGuardedQuery({
    queryFn: () => GetByRequestId(requestId!),
    queryKey: ["requestId", requestId],
    enabled: !!requestId,
    retry: false,
    staleTime: 0,
  });

  return { requestData, requestIsLoading: requestIsLoading };
}

// Hook for the new GetEmployeeInfoByPersonnelId API endpoint
export function useGetEmployeeInfoByPersonnelId(
  personnelId: number | null | undefined
) {
  const {
    data: employeeInfoData,
    isLoading: employeeInfoIsLoading,
    error: employeeInfoError,
    refetch: refetchEmployeeInfo,
    isFetching: isFetchingEmployeeInfo,
    isError: isEmployeeInfoError,
    isSuccess: isEmployeeInfoSuccess,
  } = useGetEmployeeInfoByPersonnelIdQuery(personnelId!, {
    skip: !personnelId,
    refetchOnMountOrArgChange: true,
  });

  return {
    employeeInfoData,
    employeeInfoIsLoading,
    employeeInfoError,
    refetchEmployeeInfo,
    isFetchingEmployeeInfo,
    isEmployeeInfoError,
    isEmployeeInfoSuccess,
    hasEmployeeInfoData: !!employeeInfoData?.Data,
  };
}

// New hook for the Process Operation Request API
export function useGetRequestByIdProcess(requestId: number | null | undefined) {
  const {
    data: requestData,
    isLoading: requestIsLoading,
    error: requestError,
    refetch: refetchRequest,
  } = useGetRequestByIdQuery(requestId!, {
    skip: !requestId,
  });

  return {
    requestData,
    requestIsLoading,
    requestError,
    refetchRequest,
  };
}

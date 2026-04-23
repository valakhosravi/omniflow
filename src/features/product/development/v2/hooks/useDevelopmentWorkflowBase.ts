"use client";

import { useMemo } from "react";
import { useWorkflowBase } from "@/hooks/workflow";
import { useGetDevelopmentDetailsQuery } from "../development.services";
import {
  useGetLastRequestStatusQuery,
  useGetEmployeeInfoByPersonnelIdQuery,
} from "@/services/commonApi/commonApi";

/**
 * Shared base for all Development V2 workflow pages.
 *
 * Composes `useWorkflowBase` with development-specific data fetching
 * (development details + employee info + request status).
 */
export function useDevelopmentWorkflowBase() {
  const base = useWorkflowBase();

  const { data: requestStatus, refetch: refetchRequestStatus } =
    useGetLastRequestStatusQuery(base.requestIdNumber, {
      skip: !base.requestId,
      refetchOnMountOrArgChange: true,
    });

  const {
    data: developmentData,
    isLoading: isDevelopmentDataLoading,
  } = useGetDevelopmentDetailsQuery(
    {
      requestId: base.requestIdNumber,
      trackingCode: base.trackingCode,
      processName: "Development",
    },
    { skip: !base.requestId || !base.trackingCode },
  );

  const { data: employeeInfoData } = useGetEmployeeInfoByPersonnelIdQuery(
    base.requestData?.Data?.PersonnelId ?? -1,
    { skip: !base.requestData?.Data?.PersonnelId },
  );

  const isInitialDataLoading = useMemo(
    () =>
      !!base.requestId &&
      (base.isRequestDataLoading || isDevelopmentDataLoading),
    [base.requestId, base.isRequestDataLoading, isDevelopmentDataLoading],
  );

  return {
    ...base,
    isInitialDataLoading,
    developmentData,
    isDevelopmentDataLoading,
    requestStatus,
    refetchRequestStatus,
    employeeInfoData,
  };
}

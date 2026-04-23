"use client";

import { useMemo } from "react";
import { useWorkflowBase } from "@/hooks/workflow";
import { useGetBugInfoByRequestIdQuery } from "../Bug.services";
import { useGetLastRequestStatusQuery } from "@/services/commonApi/commonApi";

export function useBugWorkflowBase() {
  const base = useWorkflowBase();

  const { data: requestStatus, refetch: refetchRequestStatus } =
    useGetLastRequestStatusQuery(base.requestIdNumber, {
      skip: !base.requestId,
      refetchOnMountOrArgChange: true,
    });

  const {
    data: bugData,
    isLoading: isBugDataLoading,
  } = useGetBugInfoByRequestIdQuery(
    {
      requestId: String(base.requestIdNumber),
      processName: "Bug",
      trackingCode: base.trackingCode,
    },
    { skip: !base.requestId || !base.trackingCode },
  );

  const isInitialDataLoading = useMemo(
    () =>
      !!base.requestId &&
      (base.isRequestDataLoading || isBugDataLoading),
    [base.requestId, base.isRequestDataLoading, isBugDataLoading],
  );

  return {
    ...base,
    isInitialDataLoading,
    bugData,
    isBugDataLoading,
    requestStatus,
    refetchRequestStatus,
  };
}

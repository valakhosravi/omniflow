"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetRequestByIdQuery, useGetLastRequestStatusQuery } from "@/services/commonApi/commonApi";

/**
 * Shared base hook for all workflow pages.
 *
 * Extracts URL params and fetches the common request-level data
 * (requestById) — things every single workflow page needs.
 *
 * Request detail sidebar (items, timeline, flow modal) is now
 * handled internally by `<AppWorkflowRequestDetail requestId={…} />`.
 */
export function useWorkflowBase() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams?.get("requestId");
  const taskId = searchParams?.get("taskId");
  const requestIdNumber = requestId ? Number(requestId) : 0;

  const {
    data: requestData,
    isLoading: isRequestDataLoading,
    refetch: refetchRequestById,
  } = useGetRequestByIdQuery(requestIdNumber, { skip: !requestId });

  const trackingCode = String(requestData?.Data?.TrackingCode ?? "");

  const {
    data: lastRequestStatusResult,
    refetch: refetchLastRequestStatus,
  } = useGetLastRequestStatusQuery(requestIdNumber, {
    skip: !requestId,
    refetchOnMountOrArgChange: true,
  });

  const isInitialDataLoading = useMemo(
    () => !!requestId && isRequestDataLoading,
    [requestId, isRequestDataLoading],
  );

  return {
    router,
    requestId,
    taskId,
    requestIdNumber,
    requestData,
    isRequestDataLoading,
    refetchRequestById,
    trackingCode,
    isInitialDataLoading,
    lastRequestStatusResult,
    refetchLastRequestStatus,
  };
}

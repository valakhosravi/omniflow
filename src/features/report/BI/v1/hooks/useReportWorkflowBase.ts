"use client";

import { useMemo } from "react";
import { useWorkflowBase } from "@/hooks/workflow";
import { useGetReportByRequestIdQuery } from "../report.services";
import { useGetLastRequestStatusQuery } from "@/services/commonApi/commonApi";

/**
 * Shared base for all Report workflow pages.
 *
 * Composes `useWorkflowBase` with report-specific data fetching
 * (report data query + request status).
 */
export function useReportWorkflowBase() {
  const base = useWorkflowBase();

  const { data: requestStatus, refetch: refetchRequestStatus } =
    useGetLastRequestStatusQuery(base.requestIdNumber, {
      skip: !base.requestId || !base.trackingCode,
      refetchOnMountOrArgChange: true,
    });

  const { data: reportData, isLoading: isReportDataLoading } =
    useGetReportByRequestIdQuery(
      {
        requestId: base.requestId || "",
        processName: "Report",
        trackingCode: base.trackingCode,
      },
      { skip: !base.requestId || !base.trackingCode },
    );

  const isInitialDataLoading = useMemo(
    () =>
      !!base.requestId && (base.isRequestDataLoading || isReportDataLoading),
    [base.requestId, base.isRequestDataLoading, isReportDataLoading],
  );

  const updatedAt = requestStatus?.Data?.CreatedDate;

  return {
    ...base,
    isInitialDataLoading,
    reportData,
    isReportDataLoading,
    requestStatus,
    refetchRequestStatus,
    updatedAt,
  };
}

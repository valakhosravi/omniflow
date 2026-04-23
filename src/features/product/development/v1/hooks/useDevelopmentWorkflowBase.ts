"use client";

import { useMemo } from "react";
import { useWorkflowBase } from "@/hooks/workflow";
import { useGetDevelopmentTicketQuery, useGetDevelopmentRequestDetailsQuery } from "../development.services";
import { useGetLastRequestStatusQuery, useGetEmployeeInfoByPersonnelIdQuery } from "@/services/commonApi/commonApi";

/**
 * Shared base for all Development V1 workflow pages.
 *
 * Composes `useWorkflowBase` with V1-specific data fetching:
 * - `useGetDevelopmentTicketQuery` (request-level data by requestId)
 * - `useGetDevelopmentRequestDetailsQuery` (development ticket details)
 * - Employee info
 * - Last request status
 */
export function useDevelopmentWorkflowBase() {
  const base = useWorkflowBase();

  const { data: requestStatus, refetch: refetchRequestStatus } =
    useGetLastRequestStatusQuery(base.requestIdNumber, {
      skip: !base.requestId,
      refetchOnMountOrArgChange: true,
    });

  const {
    data: developmentTicket,
    isLoading: isTicketLoading,
  } = useGetDevelopmentTicketQuery(base.requestIdNumber, {
    skip: !base.requestId,
  });

  const {
    data: developmentDetails,
    isLoading: isDetailsLoading,
  } = useGetDevelopmentRequestDetailsQuery(base.requestIdNumber, {
    skip: !base.requestId,
  });

  const { data: employeeInfoData } = useGetEmployeeInfoByPersonnelIdQuery(
    developmentTicket?.Data?.PersonnelId ?? -1,
    { skip: !developmentTicket?.Data?.PersonnelId },
  );

  const isInitialDataLoading = useMemo(
    () =>
      !!base.requestId &&
      (base.isRequestDataLoading || isTicketLoading || isDetailsLoading),
    [base.requestId, base.isRequestDataLoading, isTicketLoading, isDetailsLoading],
  );

  return {
    ...base,
    isInitialDataLoading,
    developmentTicket,
    developmentDetails,
    isTicketLoading,
    isDetailsLoading,
    requestStatus,
    refetchRequestStatus,
    employeeInfoData,
  };
}

"use client";
import { useDisclosure } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import {
  useGetRequestByIdQuery,
  useGetRequestTimelineQuery,
} from "@/services/commonApi/commonApi";
import { useGetReportByRequestIdQuery } from "../report.services";
import { ReportComponentType } from "../reportV1.types";

export function useReportStart(type: ReportComponentType) {
  const isEditMode = type === ReportComponentType.EDIT;
  const searchParams = useSearchParams();
  const requestId = searchParams?.get("requestId") ?? undefined;
  const numericRequestId = requestId ? Number(requestId) : 0;

  const { data: requestData, isLoading: isRequestLoading } =
    useGetRequestByIdQuery(numericRequestId, {
      skip: !requestId || !isEditMode,
    });

  const trackingCode = String(requestData?.Data?.TrackingCode ?? "");

  const {
    data: reportData,
    isLoading: isReportDataLoading,
    error: reportDataError,
    isUninitialized: isReportUninitialized,
  } = useGetReportByRequestIdQuery(
    {
      requestId: requestId!,
      processName: "Report",
      trackingCode,
    },
    {
      skip: !requestId || !trackingCode || !isEditMode,
    },
  );

  const { data: requestTimeline } = useGetRequestTimelineQuery(
    numericRequestId,
    {
      skip: !requestId || !isEditMode,
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

  const title = isEditMode ? "ویرایش تیکت گزارش" : "ثبت تیکت گزارش";
  const reportInfo = reportData?.Data ?? null;

  const isLoading =
    isEditMode &&
    (isRequestLoading || isReportDataLoading || isReportUninitialized);

  const hasError =
    isEditMode && !isLoading && (!!reportDataError || !reportData);

  return {
    isEditMode,
    title,
    reportInfo,
    isLoading,
    hasError,
    requestTimeline,
    isRequestFlowOpen,
    onRequestFlowOpen,
    onOpenChangeRequestFlow,
  };
}

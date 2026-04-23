"use client";

import { useMemo } from "react";
import { useDisclosure } from "@heroui/react";
import { useCancelWorkflow, defineWorkflowHook } from "@/hooks/workflow";
import { useReportWorkflowBase } from "./useReportWorkflowBase";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import type { ReportFollowUpData } from "../reportV1.types";
import { reportFollowUpDetailsConfig } from "../utils/follow-up-schema";

export const useReportFollowUpWorkflow =
  defineWorkflowHook<ReportFollowUpData>()(() => {
    const base = useReportWorkflowBase();

    const canCancel = base.requestStatus?.Data?.CanBeCanceled ?? false;

    const { onConfirmCancel, isSendingMessage } = useCancelWorkflow({
      requestId: base.requestId,
      instanceId: base.requestData?.Data?.InstanceId || "",
      trackingCode: base.trackingCode,
      messageName: "Report-Terminate-Request-Message",
      processName: "Report",
    });

    /* ---- Modals ---- */
    const {
      isOpen: isCancelOpen,
      onOpen: onCancelOpen,
      onOpenChange: onCancelOpenChange,
      onClose: onCancelClose,
    } = useDisclosure();

    /* ---- Actions ---- */
    const actions: ActionButton[] = [
      {
        id: "cancel-request",
        label: "لغو درخواست",
        variant: "outline",
        color: "danger",
        hidden: base.isInitialDataLoading || !canCancel,
        onPress: onCancelOpen,
        modalConfig: {
          title: "تایید لغو درخواست",
          isOpen: isCancelOpen,
          onClose: () => onCancelOpenChange(),
          content: (
            <AppConfirmModalContent
              message="این عمل قابل بازگشت نیست."
              onClose={() => onCancelClose()}
              onConfirm={() => onConfirmCancel()}
              isSubmitting={isSendingMessage}
              confirmLabel="تایید لغو درخواست"
              submittingLabel="در حال لغو..."
            />
          ),
        },
      },
    ];

    /* ---- Title ---- */
    const title = "درخواست گزارش";

    /* ---- Data ---- */
    const data = useMemo<ReportFollowUpData>(() => {
      const report = base.reportData?.Data;
      return {
        requestId: base.requestId || "",
        requestTitle: base.requestData?.Data?.Title || "",
        categoryName: report?.CategoryName || "",
        priorityName: report?.PriorityName || "",
        target: report?.Target || "",
        description: report?.Description || "",
        outputFormatName: report?.OutputFormatName || "",
        dataScopeName: report?.DataScopeName || "",
        kpiName: report?.KpiName || "",
        filters: report?.Filters || "",
        dataAccessName: report?.DataAccessName || "",
        reportUpdateName: report?.ReportUpdateName || "",
        deliveryDate: report?.DeliveryDate || "",
        modelLimitationName: report?.ModelLimitationName || "",
        trackingCode: base.trackingCode,
        jiraIssueKey: report?.JiraIssueKey || "",
      };
    }, [
      base.requestId,
      base.requestData?.Data,
      base.reportData?.Data,
      base.trackingCode,
    ]);

    return {
      title,
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: reportFollowUpDetailsConfig,
    };
  });

"use client";

import { useCallback, useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { addToaster } from "@/ui/Toaster";
import { useTaskCompletion, defineWorkflowHook } from "@/hooks/workflow";
import { useReportWorkflowBase } from "./useReportWorkflowBase";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import type { ReportManagerReviewData } from "../reportV1.types";
import { reportManagerReviewDetailsConfig } from "../utils/manager-review-schema";

export const useReportManagerReviewWorkflow =
  defineWorkflowHook<ReportManagerReviewData>()(() => {
    const base = useReportWorkflowBase();
    const { completeTask, isCompletingTask } = useTaskCompletion({
      taskId: base.taskId,
      trackingCode: base.trackingCode,
      onSuccess: base.refetchRequestStatus,
    });

    /* ---- Form state ---- */
    const [managerDescription, setManagerDescription] = useState("");

    /* ---- Action callbacks ---- */
    const onConfirmApprove = useCallback(() => {
      completeTask({
        ManagerApprove: true,
        ManagerEdit: false,
        ManagerDescription: managerDescription,
        ReportId: base.reportData?.Data?.RequestId ?? 0,
      });
    }, [completeTask, managerDescription, base.reportData?.Data?.RequestId]);

    const onConfirmReject = useCallback(() => {
      completeTask({
        ManagerApprove: false,
        ManagerEdit: false,
        ManagerDescription: managerDescription,
        ReportId: base.reportData?.Data?.RequestId ?? 0,
      });
    }, [completeTask, managerDescription, base.reportData?.Data?.RequestId]);

    const onConfirmEdit = useCallback(() => {
      completeTask({
        ManagerApprove: false,
        ManagerEdit: true,
        ManagerDescription: managerDescription,
        ReportId: base.reportData?.Data?.RequestId ?? 0,
      });
    }, [completeTask, managerDescription, base.reportData?.Data?.RequestId]);

    /* ---- Modal ---- */
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [activeModal, setActiveModal] = useState<
      "approve" | "reject" | "edit" | null
    >(null);

    const openModal = useCallback(
      (modal: "approve" | "reject" | "edit") => {
        setActiveModal(modal);
        onOpen();
      },
      [onOpen],
    );

    const closeModal = useCallback(() => {
      onClose();
      setActiveModal(null);
    }, [onClose]);

    /* ---- Validation helpers ---- */
    const validateDescription = useCallback(() => {
      if (!managerDescription.trim()) {
        addToaster({
          color: "danger",
          title: "توضیحات را وارد کنید",
        });
        return false;
      }
      return true;
    }, [managerDescription]);

    /* ---- Modal content map ---- */
    const modalMap = {
      approve: {
        title: "تایید درخواست",
        content: (
          <AppConfirmModalContent
            message="آیا از تایید این درخواست مطمئن هستید؟"
            onClose={closeModal}
            onConfirm={() => onConfirmApprove()}
            isSubmitting={isCompletingTask}
            confirmLabel="تایید"
            confirmColor="primary"
          />
        ),
      },
      reject: {
        title: "رد درخواست",
        content: (
          <AppConfirmModalContent
            message="آیا از رد این درخواست مطمئن هستید؟"
            onClose={closeModal}
            onConfirm={() => onConfirmReject()}
            isSubmitting={isCompletingTask}
            confirmLabel="رد درخواست"
            confirmColor="danger"
          />
        ),
      },
      edit: {
        title: "ویرایش درخواست",
        content: (
          <AppConfirmModalContent
            message="آیا از ارجاع این درخواست برای ویرایش مطمئن هستید؟"
            onClose={closeModal}
            onConfirm={() => onConfirmEdit()}
            isSubmitting={isCompletingTask}
            confirmLabel="تایید"
            confirmColor="primary"
          />
        ),
      },
    };

    const currentModal = activeModal ? modalMap[activeModal] : null;

    /* ---- Actions ---- */
    const actions: ActionButton[] = [
      {
        id: "edit-request",
        label: "نیازمند اقدام درخواست‌دهنده",
        variant: "outline",
        color: "secondary",
        hidden: base.isInitialDataLoading,
        disabled: isCompletingTask,
        onPress: () => {
          if (validateDescription()) openModal("edit");
        },
        modalConfig:
          currentModal && activeModal === "edit"
            ? {
                title: currentModal.title,
                isOpen,
                onClose: () => onOpenChange(),
                content: currentModal.content,
              }
            : undefined,
      },
      {
        id: "reject-request",
        label: "رد درخواست",
        variant: "outline",
        color: "danger",
        hidden: base.isInitialDataLoading,
        disabled: isCompletingTask,
        onPress: () => {
          if (validateDescription()) openModal("reject");
        },
        modalConfig:
          currentModal && activeModal === "reject"
            ? {
                title: currentModal.title,
                isOpen,
                onClose: () => onOpenChange(),
                content: currentModal.content,
              }
            : undefined,
      },
      {
        id: "approve-request",
        label: "تایید درخواست",
        variant: "contained",
        color: "primary",
        hidden: base.isInitialDataLoading,
        disabled: isCompletingTask,
        onPress: () => openModal("approve"),
        modalConfig:
          currentModal && activeModal === "approve"
            ? {
                title: currentModal.title,
                isOpen,
                onClose: () => onOpenChange(),
                content: currentModal.content,
              }
            : undefined,
      },
    ];

    /* ---- Title ---- */
    const title = "بررسی درخواست گزارش";

    /* ---- Data ---- */
    const data = useMemo<ReportManagerReviewData>(() => {
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
        needToCompare: report?.NeedCompare || false,
        isAiml: report?.IsAiml || false,
        reportRequestId: report?.RequestId ?? 0,
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
      detailsConfig: reportManagerReviewDetailsConfig,
      managerDescription,
      setManagerDescription,
    };
  });

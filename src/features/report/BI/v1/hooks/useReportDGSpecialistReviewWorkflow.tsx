"use client";

import { useCallback, useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { addToaster } from "@/ui/Toaster";
import {
  useGetStackHolderDirectorsQuery,
  useGetStackHoldersQuery,
} from "@/services/commonApi/commonApi";
import { useTaskCompletion, defineWorkflowHook } from "@/hooks/workflow";
import { useReportWorkflowBase } from "./useReportWorkflowBase";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import type { DGReviewData, JiraApproveFormData } from "../reportV1.types";
import { dgReviewDetailsConfig } from "../utils/dg-review-schema";
import JiraApproveModalContent from "../components/JiraApproveModalContent";

export const useReportDGSpecialistReviewWorkflow =
  defineWorkflowHook<DGReviewData>()(() => {
    const base = useReportWorkflowBase();
    const { completeTask, isCompletingTask } = useTaskCompletion({
      taskId: base.taskId,
      processName: "Report",
      trackingCode: base.trackingCode,
      onSuccess: base.refetchRequestStatus,
    });

    /* ---- Form state ---- */
    const [managerDescription, setManagerDescription] = useState("");

    const {
      isOpen: isJiraModalOpen,
      onOpen: onJiraModalOpen,
      onClose: onJiraModalClose,
    } = useDisclosure();

    const { data: stackHolders, isLoading: isLoadingStackHolders } =
      useGetStackHoldersQuery();
    const {
      data: stackHolderDirectors,
      isLoading: isLoadingStackHolderDirectors,
    } = useGetStackHolderDirectorsQuery();

    /* ---- Action callbacks ---- */
    const onConfirmReject = useCallback(() => {
      completeTask({
        DeApprove: false,
        DeEdit: false,
        DeDescription: managerDescription,
        HasExpertAssignee: false,
        ExpertAssigneePersonnelId: "",
        Summary: "",
        JiraDescription: "",
        StackHolder: "",
        StackHolderContactPoint: "",
        StackHolderContactDirector: "",
        ReportId: base.reportData?.Data?.RequestId || 0,
      });
    }, [completeTask, managerDescription]);

    const onConfirmEdit = useCallback(() => {
      completeTask({
        DeApprove: false,
        DeEdit: true,
        DeDescription: managerDescription,
        HasExpertAssignee: false,
        ExpertAssigneePersonnelId: "",
        Summary: "",
        JiraDescription: "",
        StackHolder: "",
        StackHolderContactPoint: "",
        StackHolderContactDirector: "",
        ReportId: base.reportData?.Data?.RequestId || 0,
      });
    }, [completeTask, managerDescription]);

    const onConfirmApproveWithJira = useCallback(
      async (jiraData: JiraApproveFormData) => {
        await completeTask({
          DeApprove: true,
          DeEdit: false,
          DeDescription: managerDescription,
          Summary: jiraData.summary,
          JiraDescription: jiraData.jiraDescription,
          StackHolder: jiraData.stackHolder,
          StackHolderContactPoint: jiraData.taskFollower,
          StackHolderContactDirector: jiraData.reportRecipient,
          ReportId: base.reportData?.Data?.RequestId || 0,
        });
      },
      [completeTask, managerDescription],
    );

    /* ---- Confirm modal ---- */
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [activeModal, setActiveModal] = useState<"reject" | "edit" | null>(
      null,
    );

    const openModal = useCallback(
      (modal: "reject" | "edit") => {
        setActiveModal(modal);
        onOpen();
      },
      [onOpen],
    );

    const closeModal = useCallback(() => {
      onClose();
      setActiveModal(null);
    }, [onClose]);

    /* ---- Validation ---- */
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
        onPress: () => onJiraModalOpen(),
        modalConfig: {
          title: "تایید گزارش",
          isOpen: isJiraModalOpen,
          onClose: onJiraModalClose,
          modalContentClassName:
            "!w-[746px] max-w-[746px] max-h-[90vh] flex flex-col",
          content: (
            <JiraApproveModalContent
              onClose={onJiraModalClose}
              onConfirm={onConfirmApproveWithJira}
              stackHolders={stackHolders?.Data ?? []}
              stackHolderDirectors={stackHolderDirectors?.Data ?? []}
              isLoadingStackHolders={isLoadingStackHolders}
              isLoadingStackHolderDirectors={isLoadingStackHolderDirectors}
              isSubmitting={isCompletingTask}
            />
          ),
        },
      },
    ];

    /* ---- Title ---- */
    const title = "بررسی مدیر حاکمیتی داده و مبارزه با پولشویی";

    /* ---- Data ---- */
    const data = useMemo<DGReviewData>(() => {
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
      };
    }, [base.requestId, base.requestData?.Data, base.reportData?.Data]);

    return {
      title,
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: dgReviewDetailsConfig,
      managerDescription,
      setManagerDescription,
    };
  });

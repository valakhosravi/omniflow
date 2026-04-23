"use client";

import { useCallback, useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useGetTaskByIdQuery } from "@/packages/camunda";
import { useTaskCompletion, defineWorkflowHook } from "@/hooks/workflow";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { addToaster } from "@/ui/Toaster";
import { useDevelopmentWorkflowBase } from "./useDevelopmentWorkflowBase";
import { useDevelopmentReviewData } from "./useDevelopmentReviewData";
import { developmentDetailsConfig } from "../utils/details-schema";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import ReferralToOtherSpecialistModalContent from "../Components/ReferralToOtherSpecialistModalContent";
import SubmitJiraTicketModalContent from "../Components/SubmitJiraTicketModalContent";
import CreateJiraIssueModalContent from "../Components/CreateJiraIssueModalContent";
import { DevelopmentPagesEnum } from "../development.types";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { DevelopmentReviewData } from "../development.types";

export const useDevelopmentSpecialistWorkflow =
  defineWorkflowHook<DevelopmentReviewData>()(() => {
    const base = useDevelopmentWorkflowBase();
    const data = useDevelopmentReviewData(base);
    const userData = useAuth();

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState<string | null>(
      null,
    );

    const { data: taskData } = useGetTaskByIdQuery(base.taskId || "", {
      skip: !base.taskId,
    });

    const isTaskClaimed = useMemo(
      () => Boolean(taskData?.assignee),
      [taskData],
    );

    const { completeTask, isCompletingTask } = useTaskCompletion({
      taskId: base.taskId,
      processName: "Development",
      trackingCode: base.trackingCode,
    });

    /* ---- Disclosure hooks for modals ---- */
    const {
      isOpen: isReferralModalOpen,
      onOpen: onReferralModalOpen,
      onClose: onReferralModalClose,
    } = useDisclosure();

    const {
      isOpen: isJiraModalOpen,
      onOpen: onJiraModalOpen,
      onClose: onJiraModalClose,
    } = useDisclosure();

    const {
      isOpen: isJiraForSelfModalOpen,
      onOpen: onJiraForSelfModalOpen,
      onClose: onJiraForSelfModalClose,
    } = useDisclosure();

    /* ---- Confirm modal (shared for confirmEdit) ---- */
    const {
      isOpen: isConfirmOpen,
      onOpen: onConfirmOpen,
      onClose: onConfirmClose,
    } = useDisclosure();

    const {
      isOpen: isRejectConfirmOpen,
      onOpen: onRejectConfirmOpen,
      onClose: onRejectConfirmClose,
    } = useDisclosure();

    /* ---- Validation helpers ---- */
    const requireClaim = useCallback(() => {
      if (!isTaskClaimed) {
        addToaster({
          color: "warning",
          title: "ابتدا باید وظیفه را دریافت کنید",
        });
        return false;
      }
      return true;
    }, [isTaskClaimed]);

    const requireDescription = useCallback(
      (msg: string) => {
        if (!description || description.trim().length === 0) {
          setDescriptionError(msg);
          return false;
        }
        return true;
      },
      [description],
    );

    /* ---- Action callbacks ---- */
    const onReject = useCallback(() => {
      if (!requireClaim()) return;
      if (!requireDescription("توضیحات رد درخواست را وارد کنید")) return;
      onRejectConfirmOpen();
    }, [requireClaim, requireDescription, onRejectConfirmOpen]);

    const onConfirmReject = useCallback(() => {
      completeTask({
        PeApprove: false,
        PeDescription: description,
        PeEdit: false,
        DevelopId: Number(base.developmentData?.Data?.RequestId),
      });
    }, [completeTask, description, base.developmentData]);

    const onEditNeeded = useCallback(() => {
      if (!requireClaim()) return;
      if (
        !requireDescription("توضیحات نیازمند اقدام درخواست دهنده را وارد کنید")
      )
        return;
      completeTask({
        PeApprove: false,
        PeDescription: description,
        PeEdit: true,
        DevelopId: Number(base.developmentData?.Data?.RequestId),
      });
    }, [
      requireClaim,
      requireDescription,
      completeTask,
      description,
      base.developmentData,
    ]);

    const onApproveWithoutJira = useCallback(() => {
      completeTask({
        PeApprove: true,
        PeDescription: description,
        PeEdit: false,
        DevelopId: Number(base.developmentData?.Data?.RequestId),
      });
    }, [completeTask, description, base.developmentData]);

    const isSelfAssigned = useMemo(
      () =>
        String(base.developmentData?.Data?.JiraTaskAssignee) ===
        String(userData.user?.PersonnelId),
      [base.developmentData, userData.user],
    );

    /* ---- Actions ---- */
    const actions: ActionButton[] = [
      {
        id: "referral",
        label: "ارسال به سایر کارشناسان",
        variant: "outline",
        onPress: () => onReferralModalOpen(),
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: "ارجاع درخواست",
          isOpen: isReferralModalOpen,
          onClose: onReferralModalClose,
          modalContentClassName: "!w-[746px] max-w-[746px] max-h-[613px]",
          content: (
            <ReferralToOtherSpecialistModalContent
              onClose={onReferralModalClose}
              trackingCode={base.trackingCode}
              processRequestId={data.requestId}
            />
          ),
        },
      },
      {
        id: "need-edit",
        label: "نیازمند اقدام درخواست‌دهنده",
        variant: "outline",
        onPress: () => {
          if (!requireDescription("توضیحات الزامیست")) return;
          onConfirmOpen();
        },
        hidden: base.isInitialDataLoading,
        modalConfig: isConfirmOpen
          ? {
              title: "تایید ارسال درخواست",
              isOpen: isConfirmOpen,
              onClose: onConfirmClose,
              content: (
                <AppConfirmModalContent
                  message="آیا از ارسال این درخواست مطمئن هستید؟"
                  onClose={onConfirmClose}
                  onConfirm={onEditNeeded}
                  isSubmitting={isCompletingTask}
                  confirmLabel="تایید"
                  confirmColor="danger"
                />
              ),
            }
          : undefined,
      },
      {
        id: "create-jira-self",
        label: "ایجاد تیکت",
        variant: "outline",
        onPress: () => onJiraForSelfModalOpen(),
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: "ایجاد تیکت جیرا",
          isOpen: isJiraForSelfModalOpen,
          onClose: onJiraForSelfModalClose,
          modalContentClassName: "!w-[746px] max-w-[746px] max-h-[700px]",
          content: (
            <CreateJiraIssueModalContent
              onClose={onJiraForSelfModalClose}
              developTicketDetail={base.developmentData}
              requestId={data.requestId}
            />
          ),
        },
      },
      {
        id: "reject",
        label: "رد درخواست",
        variant: "contained",
        color: "danger",
        onPress: onReject,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
        modalConfig: isRejectConfirmOpen
          ? {
              title: "رد درخواست",
              isOpen: isRejectConfirmOpen,
              onClose: onRejectConfirmClose,
              content: (
                <AppConfirmModalContent
                  message="آیا از رد این درخواست مطمئن هستید؟"
                  onClose={onRejectConfirmClose}
                  onConfirm={onConfirmReject}
                  isSubmitting={isCompletingTask}
                  confirmLabel="رد درخواست"
                  confirmColor="danger"
                />
              ),
            }
          : undefined,
      },
      {
        id: "approve",
        label: "تایید درخواست",
        variant: "contained",
        color: "primary",
        onPress: () => {
          if (isSelfAssigned) {
            onJiraModalOpen();
          } else {
            onApproveWithoutJira();
          }
        },
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
        modalConfig: isSelfAssigned
          ? {
              title: "تایید درخواست و ایجاد تیکت JIRA",
              isOpen: isJiraModalOpen,
              onClose: onJiraModalClose,
              modalContentClassName: "!w-[746px] max-w-[746px] max-h-[700px]",
              content: (
                <SubmitJiraTicketModalContent
                  onClose={onJiraModalClose}
                  taskId={base.taskId}
                  managerDescription={description}
                  setDescriptionError={setDescriptionError}
                  pageType={DevelopmentPagesEnum.PRODUCT_SPECIALIST}
                  requestId={data.requestId}
                  requestDetails={base.requestData}
                  developmentDetails={base.developmentData?.Data}
                />
              ),
            }
          : undefined,
      },
    ];

    return {
      title: "درخواست تیکت توسعه",
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: developmentDetailsConfig,
      description,
      setDescription,
      descriptionError,
      setDescriptionError,
    };
  });

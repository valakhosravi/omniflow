"use client";

import { useCallback, useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useGetTaskByIdQuery } from "@/packages/camunda";
import { useTaskCompletion, defineWorkflowHook } from "@/hooks/workflow";
import { useGetAttachmentByRequestIdQuery } from "@/services/commonApi/commonApi";
import { addToaster } from "@/ui/Toaster";
import { useDevelopmentWorkflowBase } from "./useDevelopmentWorkflowBase";
import { useDevelopmentReviewData } from "./useDevelopmentReviewData";
import { developmentDetailsConfig } from "../utils/details-schema";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import ReferralModalContent from "../Components/ReferralModalContent";
import SubmitJiraTicketModalContent from "../Components/SubmitJiraTicketModalContent";
import { DevelopmentPagesEnum } from "../development.types";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { DevelopmentReviewData } from "../development.types";

export const useDevelopmentPMWorkflow =
  defineWorkflowHook<DevelopmentReviewData>()(() => {
    const base = useDevelopmentWorkflowBase();
    const data = useDevelopmentReviewData(base);

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState<string | null>(
      null,
    );

    const { data: taskData } = useGetTaskByIdQuery(base.taskId || "", {
      skip: !base.taskId,
    });

    const { data: attachments } = useGetAttachmentByRequestIdQuery(
      base.requestIdNumber,
      { skip: !base.requestIdNumber },
    );

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
        PmApprove: false,
        PmDescription: description,
        PmEdit: false,
        HasExpertAssignee: false,
        ExpertAssigneePersonnelId: "",
        Summary: "",
        JiraDescription: "",
        StackHolder: "",
        DevelopId: base.developmentData?.Data?.RequestId || 0,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completeTask, description]);

    const onEditNeeded = useCallback(() => {
      if (!requireClaim()) return;
      if (
        !requireDescription("توضیحات نیازمند اقدام درخواست دهنده را وارد کنید")
      )
        return;
      completeTask({
        PmApprove: false,
        ManagerDescription: description,
        PmEdit: true,
        HasExpertAssignee: false,
        DevelopId: Number(base.developmentData?.Data?.RequestId),
        Attachment: attachments?.Data?.[0]?.AttachmentAddress,
      });
    }, [
      requireClaim,
      requireDescription,
      completeTask,
      description,
      base.developmentData,
      attachments,
    ]);

    /* ---- Actions ---- */
    const actions: ActionButton[] = [
      {
        id: "referral",
        label: "ارجاع",
        variant: "outline",
        onPress: () => onReferralModalOpen(),
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: "ارجاع درخواست",
          isOpen: isReferralModalOpen,
          onClose: onReferralModalClose,
          modalContentClassName: "!w-[746px] max-w-[746px] max-h-[613px]",
          content: (
            <ReferralModalContent
              onClose={onReferralModalClose}
              developmentDetails={base.developmentData?.Data}
              trackingCode={base.trackingCode}
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
        onPress: () => onJiraModalOpen(),
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: "تایید درخواست و ایجاد تیکت JIRA",
          isOpen: isJiraModalOpen,
          onClose: onJiraModalClose,
          modalContentClassName: "!w-[746px] max-w-[746px]",
          content: (
            <SubmitJiraTicketModalContent
              onClose={onJiraModalClose}
              taskId={base.taskId}
              managerDescription={description}
              setDescriptionError={setDescriptionError}
              pageType={DevelopmentPagesEnum.PRODUCT_MANAGER}
              requestId={data.requestId}
              requestDetails={base.requestData}
              developmentDetails={base.developmentData?.Data}
            />
          ),
        },
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

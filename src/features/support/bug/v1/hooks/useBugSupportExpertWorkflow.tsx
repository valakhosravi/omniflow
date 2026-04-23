"use client";

import { useCallback, useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useGetTaskByIdQuery } from "@/packages/camunda";
import { useTaskCompletion, defineWorkflowHook } from "@/hooks/workflow";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { addToaster } from "@/ui/Toaster";
import { useUpdateBatchGroupIsReadMutation } from "@/services/commonApi/commonApi";
import { useBugWorkflowBase } from "./useBugWorkflowBase";
import { useBugReviewData } from "./useBugReviewData";
import { bugDetailsConfig } from "../utils/details-schema";
import { useLazyGetAllBugReasonsQuery } from "../Bug.services";
import { createPayload } from "../Bug.utils";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import ActionSelectModalContent from "../components/ActionSelectModalContent";
import { BugFixPagesTypes, SupportExpertEnum } from "../Bug.types";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { BugReviewData, BugFixFormData } from "../Bug.types";

export const useBugSupportExpertWorkflow =
  defineWorkflowHook<BugReviewData>()(() => {
    const base = useBugWorkflowBase();
    const data = useBugReviewData(base);
    const { userDetail } = useAuth();

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState<string | null>(null);
    const [selectedBugReasonId, setSelectedBugReasonId] = useState<number>(0);

    const { data: taskData } = useGetTaskByIdQuery(base.taskId || "", {
      skip: !base.taskId,
    });
    const isTaskClaimed = useMemo(() => Boolean(taskData?.assignee), [taskData]);

    const { completeTask, claimTask, isCompletingTask, isClaimingTask } =
      useTaskCompletion({
        taskId: base.taskId,
        processName: "Bug",
        trackingCode: base.trackingCode,
      });

    const [updateBatchGroupIsRead] = useUpdateBatchGroupIsReadMutation();
    const [getBugReasons, { data: bugReasons, isFetching: isBugReasonsFetching }] =
      useLazyGetAllBugReasonsQuery();

    const bugReasonOptions = useMemo(
      () =>
        bugReasons?.Data?.map((item) => ({
          label: item.Title ?? "",
          value: String(item.ReasonId),
        })) ?? [],
      [bugReasons],
    );

    const {
      isOpen: isConfirmNeedUserActionOpen,
      onOpen: onConfirmNeedUserActionOpen,
      onClose: onConfirmNeedUserActionClose,
    } = useDisclosure();
    const {
      isOpen: isRejectModalOpen,
      onOpen: onRejectModalOpen,
      onClose: onRejectModalClose,
    } = useDisclosure();
    const handleRejectModalOpen = useCallback(() => {
      getBugReasons();
      onRejectModalOpen();
    }, [getBugReasons, onRejectModalOpen]);

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

    const handleClaim = useCallback(() => {
      const personnelId = userDetail?.UserDetail.PersonnelId;
      if (!personnelId) {
        addToaster({ color: "danger", title: "اطلاعات شخصی یافت نشد" });
        return;
      }
      claimTask(String(personnelId), { requestId: base.requestIdNumber }).then(
        () => {
          updateBatchGroupIsRead({
            requestId: String(base.requestIdNumber),
            groupKeys: userDetail?.UserDetail.GroupKeys || [],
          });
          base.refetchRequestStatus();
        },
      );
    }, [userDetail, claimTask, base, updateBatchGroupIsRead]);

    const buildFormData = useCallback(
      (action: SupportExpertEnum | "need-user-action"): BugFixFormData => ({
        bugFixAction: action,
        selectValue: { id: selectedBugReasonId },
        additionalDescription: description,
        fileAddress:
          base.bugData?.Data?.Attachments?.[0]?.AttachmentAddress || "",
      }),
      [selectedBugReasonId, description, base.bugData],
    );

    const onApprove = useCallback(() => {
      const payload = createPayload({
        pageType: BugFixPagesTypes.SUPPORT_EXPERT,
        data: buildFormData(SupportExpertEnum.FIXED),
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [buildFormData, completeTask]);

    const onReject = useCallback(() => {
      if (!selectedBugReasonId) {
        addToaster({ color: "warning", title: "دلیل رفع نشدن باگ را انتخاب کنید" });
        return;
      }
      const payload = createPayload({
        pageType: BugFixPagesTypes.SUPPORT_EXPERT,
        data: buildFormData(SupportExpertEnum.NOT_FIXED),
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [selectedBugReasonId, buildFormData, completeTask]);

    const onNeedUserAction = useCallback(() => {
      const payload = createPayload({
        pageType: BugFixPagesTypes.SUPPORT_EXPERT,
        data: buildFormData("need-user-action"),
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [buildFormData, completeTask]);

    const actions: ActionButton[] = [
      ...(isTaskClaimed
        ? []
        : [
            {
              id: "claim",
              label: isClaimingTask ? "در حال دریافت وظیفه..." : "دریافت وظیفه",
              variant: "contained" as const,
              color: "primary" as const,
              onPress: handleClaim,
              loading: isClaimingTask,
              hidden: base.isInitialDataLoading,
            },
          ]),
      {
        id: "need-user-action",
        label: "نیازمند اقدام درخواست‌دهنده",
        variant: "outline",
        onPress: () => {
          if (!requireDescription("توضیحات الزامیست")) return;
          onConfirmNeedUserActionOpen();
        },
        disabled: !isTaskClaimed,
        hidden: base.isInitialDataLoading,
        modalConfig: isConfirmNeedUserActionOpen
          ? {
              title: "تایید ارسال درخواست",
              isOpen: isConfirmNeedUserActionOpen,
              onClose: onConfirmNeedUserActionClose,
              content: (
                <AppConfirmModalContent
                  message="آیا از ارسال این درخواست مطمئن هستید؟ این عمل قابل بازگشت نیست."
                  onClose={onConfirmNeedUserActionClose}
                  onConfirm={onNeedUserAction}
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
        label: "باگ برطرف نشد",
        variant: "contained",
        color: "danger",
        onPress: handleRejectModalOpen,
        loading: isCompletingTask,
        disabled: !isTaskClaimed,
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: "ثبت دلیل رفع نشدن باگ",
          isOpen: isRejectModalOpen,
          onClose: onRejectModalClose,
          content: (
            <ActionSelectModalContent
              message="لطفا دلیل رفع نشدن باگ را انتخاب کنید."
              selectLabel="دلیل رفع نشدن باگ"
              options={bugReasonOptions}
              selectedValue={
                selectedBugReasonId ? String(selectedBugReasonId) : ""
              }
              onSelectChange={(value) => {
                setSelectedBugReasonId(Number(value));
              }}
              onClose={onRejectModalClose}
              onConfirm={() => {
                onReject();
                onRejectModalClose();
              }}
              isSubmitting={isCompletingTask}
              isConfirmDisabled={isBugReasonsFetching || !selectedBugReasonId}
              confirmLabel="ثبت نتیجه"
              submittingLabel="در حال ثبت..."
            />
          ),
        },
      },
      {
        id: "approve",
        label: "باگ برطرف شد",
        variant: "contained",
        color: "primary",
        onPress: onApprove,
        loading: isCompletingTask,
        disabled: !isTaskClaimed,
        hidden: base.isInitialDataLoading,
      },
    ];

    return {
      title: "درخواست رفع باگ",
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: bugDetailsConfig,
      description,
      setDescription,
      descriptionError,
      setDescriptionError,
      bugReasonOptions,
      selectedBugReasonId,
      setSelectedBugReasonId,
    };
  });

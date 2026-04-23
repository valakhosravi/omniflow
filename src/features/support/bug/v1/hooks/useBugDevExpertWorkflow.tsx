"use client";

import { useCallback, useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useGetTaskByIdQuery } from "@/packages/camunda";
import { useTaskCompletion } from "@/hooks/workflow";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { addToaster } from "@/ui/Toaster";
import { useUpdateBatchGroupIsReadMutation } from "@/services/commonApi/commonApi";
import { useBugWorkflowBase } from "./useBugWorkflowBase";
import { useBugReviewData } from "./useBugReviewData";
import { bugDetailsConfig } from "../utils/details-schema";
import { useLazyGetAllBugReasonsQuery } from "../Bug.services";
import { createPayload } from "../Bug.utils";
import { priorityNames, refToManager } from "../Bug.const";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import AddInJiraModalContent from "../components/AddInJiraModalContent";
import ActionSelectModalContent from "../components/ActionSelectModalContent";
import {
  BugFixPagesTypes,
  DevelopmentExpertEnum,
} from "../Bug.types";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { BugFixFormData } from "../Bug.types";

export function useBugDevExpertWorkflow(unit: "infra" | "payment") {
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
      isOpen: isJiraModalOpen,
      onOpen: onJiraModalOpen,
      onClose: onJiraModalClose,
    } = useDisclosure();

    const {
      isOpen: isConfirmNeedUserActionOpen,
      onOpen: onConfirmNeedUserActionOpen,
      onClose: onConfirmNeedUserActionClose,
    } = useDisclosure();
    const {
      isOpen: isReferManagerModalOpen,
      onOpen: onReferManagerModalOpen,
      onClose: onReferManagerModalClose,
    } = useDisclosure();
    const handleReferManagerModalOpen = useCallback(() => {
      getBugReasons();
      onReferManagerModalOpen();
    }, [getBugReasons, onReferManagerModalOpen]);

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

    const onJiraConfirm = useCallback(
      (jiraData: {
        JiraTitle: string;
        JiraPersonnelId: string;
        Stakeholder: string;
        StakeholderDirector: string;
        StakeholderContatctPoint: string;
        JiraDescription: string;
      }) => {
        const formData: BugFixFormData = {
          bugFixAction: DevelopmentExpertEnum.FIXED,
          selectValue: { id: 0 },
          additionalDescription: description,
          JiraTitle: jiraData.JiraTitle,
          JiraPersonnelId: jiraData.JiraPersonnelId,
          Stakeholder: jiraData.Stakeholder,
          StakeholderDirector: jiraData.StakeholderDirector,
          StakeholderContatctPoint: jiraData.StakeholderContatctPoint,
          JiraDescription: jiraData.JiraDescription,
          fileAddress:
            base.bugData?.Data?.Attachments?.[0]?.AttachmentAddress || "",
        };
        const payload = createPayload({
          pageType: BugFixPagesTypes.DEVELOPMENT_EXPERT,
          data: formData,
          unit,
        });
        completeTask(payload as unknown as Record<string, unknown>);
        onJiraModalClose();
      },
      [description, base.bugData, unit, completeTask, onJiraModalClose],
    );

    const onDevProcessRequest = useCallback(() => {
      const formData: BugFixFormData = {
        bugFixAction: DevelopmentExpertEnum.DEVELOPMENT_PROCESS_REQUEST,
        selectValue: { id: 0 },
        additionalDescription: description,
      };
      const payload = createPayload({
        pageType: BugFixPagesTypes.DEVELOPMENT_EXPERT,
        data: formData,
        unit,
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [description, unit, completeTask]);

    const onReferToManager = useCallback(() => {
      if (!selectedBugReasonId) {
        addToaster({
          color: "warning",
          title: "دلیل ارجاع را انتخاب کنید",
        });
        return;
      }
      const formData: BugFixFormData = {
        bugFixAction: DevelopmentExpertEnum.REFERRAL_TO_DEVELOPMENT_MANAGER,
        selectValue: { id: selectedBugReasonId },
        additionalDescription: description,
      };
      const payload = createPayload({
        pageType: BugFixPagesTypes.DEVELOPMENT_EXPERT,
        data: formData,
        unit,
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [selectedBugReasonId, description, unit, completeTask]);

    const onNeedUserAction = useCallback(() => {
      const formData: BugFixFormData = {
        bugFixAction: "need-user-action",
        selectValue: { id: 0 },
        additionalDescription: description,
      };
      const payload = createPayload({
        pageType: BugFixPagesTypes.DEVELOPMENT_EXPERT,
        data: formData,
        unit,
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [description, unit, completeTask]);

    const jiraInitialData = useMemo(
      () => ({
        JiraTitle: base.bugData?.Data?.Title || "",
        JiraDescription: base.bugData?.Data?.Description || "",
        bugPriority: base.bugData?.Data?.Priority
          ? (priorityNames as Record<number, string>)[base.bugData.Data.Priority] || ""
          : "",
      }),
      [base.bugData],
    );

    const actions: ActionButton[] = [
      ...(isTaskClaimed
        ? []
        : [
            {
              id: "claim",
              label: isClaimingTask
                ? "در حال دریافت وظیفه..."
                : "دریافت وظیفه",
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
        id: "dev-process-request",
        label: "درخواست فرآیند توسعه",
        variant: "outline",
        onPress: onDevProcessRequest,
        loading: isCompletingTask,
        disabled: !isTaskClaimed,
        hidden: base.isInitialDataLoading,
      },
      {
        id: "refer-manager",
        label: `ارجاع به مدیر ${refToManager[unit]}`,
        variant: "outline",
        onPress: handleReferManagerModalOpen,
        loading: isCompletingTask,
        disabled: !isTaskClaimed,
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: `ارجاع به مدیر ${refToManager[unit]}`,
          isOpen: isReferManagerModalOpen,
          onClose: onReferManagerModalClose,
          content: (
            <ActionSelectModalContent
              message={`لطفا دلیل ارجاع به مدیر ${refToManager[unit]} را انتخاب کنید.`}
              selectLabel={`دلیل ارجاع به مدیر ${refToManager[unit]}`}
              options={bugReasonOptions}
              selectedValue={
                selectedBugReasonId ? String(selectedBugReasonId) : ""
              }
              onSelectChange={(value) => {
                setSelectedBugReasonId(Number(value));
              }}
              onClose={onReferManagerModalClose}
              onConfirm={() => {
                onReferToManager();
                onReferManagerModalClose();
              }}
              isSubmitting={isCompletingTask}
              isConfirmDisabled={isBugReasonsFetching || !selectedBugReasonId}
              confirmLabel="ارجاع"
              submittingLabel="در حال ثبت..."
            />
          ),
        },
      },
      {
        id: "approve-jira",
        label: "باگ برطرف شد (ثبت در جیرا)",
        variant: "contained",
        color: "primary",
        onPress: () => onJiraModalOpen(),
        loading: isCompletingTask,
        disabled: !isTaskClaimed,
        hidden: base.isInitialDataLoading,
        modalConfig: {
          title: "تایید درخواست و ایجاد تیکت JIRA",
          isOpen: isJiraModalOpen,
          onClose: onJiraModalClose,
          modalContentClassName: "!w-[600px] max-w-[600px]",
          content: (
            <AddInJiraModalContent
              onClose={onJiraModalClose}
              onConfirm={onJiraConfirm}
              isSubmitting={isCompletingTask}
              unit={unit}
              initialData={jiraInitialData}
            />
          ),
        },
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
}

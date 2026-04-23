"use client";

import { useCallback, useState } from "react";
import { useTaskCompletion } from "@/hooks/workflow";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import { useSalaryAdvanceWorkflowBase } from "./useSalaryAdvanceWorkflowBase";
import { useSalaryAdvanceReviewData } from "./useSalaryAdvanceReviewData";
import { getCheckDetailsConfig } from "../utils/details-schema";

export function useSalaryAdvanceFmCheckWorkflow() {
  const base = useSalaryAdvanceWorkflowBase();
  const data = useSalaryAdvanceReviewData(base);
  const { user } = useAuth();

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const { completeTask, claimTask, isCompletingTask, isClaimingTask } =
    useTaskCompletion({ taskId: base.taskId });

  const [activeModal, setActiveModal] = useState<"reject" | "approve" | null>(
    null,
  );
  const closeModal = useCallback(() => setActiveModal(null), []);

  const handleClaim = useCallback(() => {
    claimTask(String(Number(user?.PersonnelId)), {
      requestId: base.requestIdNumber,
    });
    base.refetchLastRequestStatus();
  }, [claimTask, user?.PersonnelId, base]);

  const handleReject = useCallback(async () => {
    if (!description.trim()) {
      setDescriptionError("در صورت رد درخواست باید توضیحات مربوطه وارد شود.");
      return;
    }
    setActiveModal("reject");
  }, [description]);

  const onConfirmReject = useCallback(async () => {
    await completeTask({
      FMApprove: false,
      FMDescription: description,
    });
  }, [completeTask, description]);

  const onConfirmApprove = useCallback(async () => {
    await completeTask({
      FMApprove: true,
      FMDescription: description,
    });
  }, [completeTask, description]);

  const actions: ActionButton[] = [
    {
      id: "claim",
      label: "دریافت وظیفه",
      variant: "contained",
      color: "primary",
      hidden: base.isInitialDataLoading || base.isTaskClaimed,
      onPress: handleClaim,
      loading: isClaimingTask,
    },
    {
      id: "reject",
      label: "رد درخواست",
      variant: "outline",
      color: "danger",
      hidden: base.isInitialDataLoading || !base.isTaskClaimed,
      onPress: handleReject,
      modalConfig:
        activeModal === "reject"
          ? {
              title: "رد درخواست",
              isOpen: true,
              onClose: closeModal,
              content: (
                <AppConfirmModalContent
                  message="آیا از رد این درخواست مطمئن هستید؟"
                  onClose={closeModal}
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
      hidden: base.isInitialDataLoading || !base.isTaskClaimed,
      onPress: () => setActiveModal("approve"),
      modalConfig:
        activeModal === "approve"
          ? {
              title: "تایید درخواست",
              isOpen: true,
              onClose: closeModal,
              content: (
                <AppConfirmModalContent
                  message="آیا از تایید این درخواست مطمئن هستید؟"
                  onClose={closeModal}
                  onConfirm={onConfirmApprove}
                  isSubmitting={isCompletingTask}
                  confirmLabel="تایید درخواست"
                  confirmColor="primary"
                />
              ),
            }
          : undefined,
    },
  ];

  return {
    title: "درخواست مساعده",
    actions,
    isInitialDataLoading: base.isInitialDataLoading,
    requestId: base.requestIdNumber,
    data,
    detailsConfig: getCheckDetailsConfig("salary-advance-request-fm-check"),
    isTaskClaimed: base.isTaskClaimed,
    description,
    setDescription: (val: string) => {
      if (descriptionError) setDescriptionError(null);
      setDescription(val);
    },
    descriptionError,
  };
}

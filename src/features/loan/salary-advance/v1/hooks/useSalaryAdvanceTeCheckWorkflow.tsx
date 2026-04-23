"use client";

import { useCallback, useState } from "react";
import { useTaskCompletion } from "@/hooks/workflow";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import { useSalaryAdvanceWorkflowBase } from "./useSalaryAdvanceWorkflowBase";
import { useSalaryAdvanceReviewData } from "./useSalaryAdvanceReviewData";
import { getCheckDetailsConfig } from "../utils/details-schema";

export function useSalaryAdvanceTeCheckWorkflow() {
  const base = useSalaryAdvanceWorkflowBase();
  const data = useSalaryAdvanceReviewData(base);
  const { user } = useAuth();

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState("");
  const [paymentIdError, setPaymentIdError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentStatusError, setPaymentStatusError] = useState<string | null>(
    null,
  );

  const { completeTask, claimTask, isCompletingTask, isClaimingTask } =
    useTaskCompletion({ taskId: base.taskId });

  const [activeModal, setActiveModal] = useState<"approve" | null>(null);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const handleClaim = useCallback(() => {
    claimTask(String(Number(user?.PersonnelId)), {
      requestId: base.requestIdNumber,
    });
    base.refetchLastRequestStatus();
  }, [claimTask, user?.PersonnelId, base]);

  const validatePaymentFields = useCallback((): boolean => {
    let valid = true;
    if (!paymentId.trim()) {
      setPaymentIdError("کد پیگیری الزامی است");
      valid = false;
    }
    if (!paymentStatus) {
      setPaymentStatusError("وضعیت پرداخت الزامی است");
      valid = false;
    }
    return valid;
  }, [paymentId, paymentStatus]);

  const handleApprove = useCallback(async () => {
    if (!validatePaymentFields()) return;
    setActiveModal("approve");
  }, [validatePaymentFields]);

  const onConfirmApprove = useCallback(async () => {
    await completeTask({
      IsPaid: paymentStatus === "success",
      TEDescription: description,
      ReferenceCode: paymentId,
    });
  }, [completeTask, description, paymentId, paymentStatus]);

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
      id: "approve",
      label: "تایید درخواست",
      variant: "contained",
      color: "primary",
      hidden: base.isInitialDataLoading || !base.isTaskClaimed,
      onPress: handleApprove,
      loading: isCompletingTask,
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
    detailsConfig: getCheckDetailsConfig("salary-advance-request-te-check"),
    isTaskClaimed: base.isTaskClaimed,
    description,
    setDescription: (val: string) => {
      if (descriptionError) setDescriptionError(null);
      setDescription(val);
    },
    descriptionError,
    paymentId,
    setPaymentId: (val: string) => {
      if (paymentIdError) setPaymentIdError(null);
      setPaymentId(val);
    },
    paymentIdError,
    paymentStatus,
    setPaymentStatus: (val: string) => {
      if (paymentStatusError) setPaymentStatusError(null);
      setPaymentStatus(val);
    },
    paymentStatusError,
  };
}

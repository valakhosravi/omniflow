"use client";

import { useCallback, useEffect, useState } from "react";
import { useTaskCompletion } from "@/hooks/workflow";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { removeCommas } from "@/utils/formatNumber";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import { useSalaryAdvanceWorkflowBase } from "./useSalaryAdvanceWorkflowBase";
import { useSalaryAdvanceReviewData } from "./useSalaryAdvanceReviewData";
import { getCheckDetailsConfig } from "../utils/details-schema";

export function useSalaryAdvancePreCheckWorkflow() {
  const base = useSalaryAdvanceWorkflowBase();
  const data = useSalaryAdvanceReviewData(base);
  const { user } = useAuth();

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [ibanNumber, setIbanNumber] = useState("");
  const [ibanError, setIbanError] = useState<string | null>(null);

  useEffect(() => {
    const loan = base.loanRequestDetails?.Data;
    if (loan) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIbanNumber(loan.Destination ?? "");
    }
  }, [base.loanRequestDetails?.Data]);

  const { completeTask, claimTask, isCompletingTask, isClaimingTask } =
    useTaskCompletion({
      taskId: base.taskId,
      redirectTo: "/task-inbox/completed-tasks",
    });

  const [activeModal, setActiveModal] = useState<"reject" | "approve" | null>(
    null,
  );
  const closeModal = useCallback(() => setActiveModal(null), []);

  const handleClaim = useCallback(() => {
    claimTask(String(Number(user?.PersonnelId)), {
      requestId: base.requestIdNumber,
    })
      .then(() => {
        base.refetchLastRequestStatus();
      })
      .catch(() => {});
  }, [claimTask, user?.PersonnelId, base]);

  const validateIban = useCallback((): boolean => {
    const cleaned = ibanNumber.replace("IR", "");
    if (!cleaned) {
      setIbanError("شماره حساب الزامی است");
      return false;
    }
    setIbanError(null);
    return true;
  }, [ibanNumber]);

  const handleReject = useCallback(async () => {
    if (!description.trim()) {
      setDescriptionError("توضیحات الزامی است");
      return;
    }
    setActiveModal("reject");
  }, [description]);

  const onConfirmReject = useCallback(async () => {
    const numericAmount = data.amount
      ? Number(removeCommas(String(data.amount)))
      : 0;
    await completeTask({
      PREApprove: false,
      PREDescription: description,
      Amount: numericAmount,
      Destination: ibanNumber,
    });
  }, [completeTask, description, data.amount, ibanNumber]);

  const handleApprove = useCallback(async () => {
    if (!validateIban()) return;
    setActiveModal("approve");
  }, [validateIban]);

  const onConfirmApprove = useCallback(async () => {
    const numericAmount = data.amount
      ? Number(removeCommas(String(data.amount)))
      : 0;
    await completeTask({
      PREApprove: true,
      PREDescription: description,
      Amount: numericAmount,
      Destination: ibanNumber,
    });
  }, [completeTask, description, data.amount, ibanNumber]);

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
      onPress: handleApprove,
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
    detailsConfig: getCheckDetailsConfig("salary-advance-request-pre-check"),
    isTaskClaimed: base.isTaskClaimed,
    description,
    setDescription: (val: string) => {
      if (descriptionError) setDescriptionError(null);
      setDescription(val);
    },
    descriptionError,
    ibanNumber,
    setIbanNumber: (val: string) => {
      if (ibanError) setIbanError(null);
      setIbanNumber(val);
    },
    ibanError,
  };
}

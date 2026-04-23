"use client";

import { useCallback, useEffect, useState } from "react";
import { useTaskCompletion } from "@/hooks/workflow";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { formatNumberWithCommas, removeCommas } from "@/utils/formatNumber";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import { useSalaryAdvanceWorkflowBase } from "./useSalaryAdvanceWorkflowBase";
import { useSalaryAdvanceReviewData } from "./useSalaryAdvanceReviewData";
import { getCheckDetailsConfig } from "../utils/details-schema";

export function useSalaryAdvanceHrhCheckWorkflow() {
  const base = useSalaryAdvanceWorkflowBase();
  const data = useSalaryAdvanceReviewData(base);
  const { user, userDetail } = useAuth();

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [ibanNumber, setIbanNumber] = useState("");

  useEffect(() => {
    const loan = base.loanRequestDetails?.Data;
    if (loan) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAmount(loan.Amount ? formatNumberWithCommas(String(loan.Amount)) : "");
      setIbanNumber(loan.Destination ?? "");
    }
  }, [base.loanRequestDetails?.Data]);

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

  const validateAmount = useCallback((): boolean => {
    const raw = removeCommas(amount);
    if (!raw) {
      setAmountError("مبلغ الزامی است");
      return false;
    }
    if (!/^\d+$/.test(raw)) {
      setAmountError("فقط عدد مجاز است");
      return false;
    }
    setAmountError(null);
    return true;
  }, [amount]);

  const handleReject = useCallback(async () => {
    if (!description.trim()) {
      setDescriptionError("توضیحات الزامی است");
      return;
    }
    setActiveModal("reject");
  }, [description]);

  const onConfirmReject = useCallback(async () => {
    const numericAmount = amount ? parseInt(removeCommas(amount), 10) : 0;
    await completeTask({
      HRHApprove: false,
      HRHDescription: description,
      HRHEdit: false,
      Amount: numericAmount,
      Destination: ibanNumber,
      Assign: false,
      SalaryAdvanceId: Number(data.salaryAdvanceId),
    });
  }, [completeTask, description, amount, ibanNumber, data.salaryAdvanceId]);

  const handleApprove = useCallback(async () => {
    if (!validateAmount()) return;
    setActiveModal("approve");
  }, [validateAmount]);

  const isStandard = base.loanRequestDetails?.Data?.IsStandard ?? true;

  const onConfirmApprove = useCallback(async () => {
    const numericAmount = amount ? parseInt(removeCommas(amount), 10) : 0;
    await completeTask({
      HRHApprove: isStandard,
      HRHDescription: description,
      HRHEdit: false,
      Amount: numericAmount,
      Destination: ibanNumber,
      Assign: !isStandard,
      HRHPersonnelId: Number(user?.PersonnelId || "0"),
      HRHUserId: Number(userDetail?.UserDetail?.UserId || "0"),
      SalaryAdvanceId: Number(data.salaryAdvanceId),
    });
  }, [
    completeTask,
    description,
    amount,
    ibanNumber,
    isStandard,
    user,
    userDetail,
    data.salaryAdvanceId,
  ]);

  const approveLabel = isStandard
    ? "تایید درخواست"
    : "ارسال به مدیر منابع انسانی";

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
      label: approveLabel,
      variant: "contained",
      color: "primary",
      hidden: base.isInitialDataLoading || !base.isTaskClaimed,
      onPress: handleApprove,
      modalConfig:
        activeModal === "approve"
          ? {
              title: approveLabel,
              isOpen: true,
              onClose: closeModal,
              content: (
                <AppConfirmModalContent
                  message="آیا از تایید این درخواست مطمئن هستید؟"
                  onClose={closeModal}
                  onConfirm={onConfirmApprove}
                  isSubmitting={isCompletingTask}
                  confirmLabel={approveLabel}
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
    detailsConfig: getCheckDetailsConfig("salary-advance-request-hrh-check"),
    isTaskClaimed: base.isTaskClaimed,
    description,
    setDescription: (val: string) => {
      if (descriptionError) setDescriptionError(null);
      setDescription(val);
    },
    descriptionError,
    amount,
    setAmount: (val: string) => {
      if (amountError) setAmountError(null);
      setAmount(val);
    },
    amountError,
  };
}

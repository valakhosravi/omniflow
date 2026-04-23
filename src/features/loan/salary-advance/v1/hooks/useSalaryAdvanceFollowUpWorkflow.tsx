"use client";

import { useCallback, useMemo, useState } from "react";
import { useCancelWorkflow } from "@/hooks/workflow";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import type { SalaryAdvanceFollowUpData } from "../salary-advance.types";
import { salaryAdvanceFollowUpDetailsConfig } from "../utils/follow-up-schema";
import { useSalaryAdvanceWorkflowBase } from "./useSalaryAdvanceWorkflowBase";

export function useSalaryAdvanceFollowUpWorkflow() {
  const base = useSalaryAdvanceWorkflowBase();

  const canCancel =
    base.lastRequestStatusResult?.Data?.CanBeCanceled ?? false;

  const { onConfirmCancel, isSendingMessage } = useCancelWorkflow({
    requestId: base.requestId,
    instanceId: base.requestData?.Data?.InstanceId || "",
    trackingCode: base.trackingCode,
    messageName: "Salary-Advance-Request-Terminate-Request-Massage",
    processName: "SalaryAdvanceRequest",
  });

  const [activeModal, setActiveModal] = useState<"cancel" | null>(null);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const actions: ActionButton[] = [
    {
      id: "cancel-request",
      label: "لغو درخواست",
      variant: "outline",
      color: "danger",
      hidden: base.isInitialDataLoading || !canCancel,
      onPress: () => setActiveModal("cancel"),
      modalConfig: activeModal === "cancel"
        ? {
            title: "تایید لغو درخواست",
            isOpen: true,
            onClose: closeModal,
            content: (
              <AppConfirmModalContent
                message="این عمل قابل بازگشت نیست."
                onClose={closeModal}
                onConfirm={() => onConfirmCancel()}
                isSubmitting={isSendingMessage}
                confirmLabel="لغو درخواست"
                submittingLabel="در حال لغو..."
              />
            ),
          }
        : undefined,
    },
  ];

  const data = useMemo<SalaryAdvanceFollowUpData>(() => {
    const loan = base.loanRequestDetails?.Data;
    const employee = base.userData?.Data;
    const paidCount = base.salaryAdvancedPaidRequest?.Data?.length ?? 0;

    return {
      requestId: base.requestId || "",
      fullName: employee?.FullName || "",
      personnelId: employee?.PersonnelId || "",
      trackingCode: base.trackingCode,
      amountRatio: loan?.Ratio || 0,
      repaymentMonth: loan?.RepaymentMonth || 0,
      isStandard: loan?.IsStandard ?? true,
      paidRequestsCount: paidCount,
      employmentDate: employee?.EmploymentDate || "",
      jobTitle: employee?.Title || "",
      nationalCode: employee?.NationalCode || "",
    };
  }, [
    base.loanRequestDetails?.Data,
    base.userData?.Data,
    base.salaryAdvancedPaidRequest?.Data,
    base.requestId,
    base.trackingCode,
  ]);

  return {
    title: "درخواست مساعده",
    actions,
    isInitialDataLoading: base.isInitialDataLoading,
    requestId: base.requestIdNumber,
    data,
    detailsConfig: salaryAdvanceFollowUpDetailsConfig,
  };
}

"use client";

import { useMemo } from "react";
import type { SalaryAdvanceReviewData } from "../salary-advance.types";
import type { useSalaryAdvanceWorkflowBase } from "./useSalaryAdvanceWorkflowBase";

type BaseResult = ReturnType<typeof useSalaryAdvanceWorkflowBase>;

export function useSalaryAdvanceReviewData(base: BaseResult) {
  return useMemo<SalaryAdvanceReviewData>(() => {
    const loan = base.loanRequestDetails?.Data;
    const employee = base.userData?.Data;
    const paidCount = base.salaryAdvancedPaidRequest?.Data?.length ?? 0;

    return {
      requestId: base.requestId || "",
      fullName: employee?.FullName || "",
      personnelId: employee?.PersonnelId || "",
      trackingCode: base.trackingCode,
      jobTitle: employee?.Title || "",
      amount: loan?.Amount || 0,
      amountRatio: loan?.Ratio || 0,
      maxLoansPerMonth: loan?.MaxLoansPerMonth || 0,
      isStandard: loan?.IsStandard ?? true,
      repaymentMonth: loan?.RepaymentMonth || 0,
      paidRequestsCount: paidCount,
      employmentDate: employee?.EmploymentDate || "",
      nationalCode: employee?.NationalCode || "",
      destination: loan?.Destination || "",
      salaryAdvanceId: loan?.RequestId || "",
    };
  }, [
    base.loanRequestDetails?.Data,
    base.userData?.Data,
    base.salaryAdvancedPaidRequest?.Data,
    base.requestId,
    base.trackingCode,
  ]);
}

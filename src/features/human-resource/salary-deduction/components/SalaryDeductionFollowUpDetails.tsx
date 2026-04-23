"use client";

import React from "react";
import DetailsList from "@/components/common/AppWorkflowPage/components/DetailsList";
import { salaryDeductionDetailsConfig } from "../utils/follow-up-schema";
import type { RequestDto } from "../salary-deduction.types";

interface salaryDeductionFollowUpDetailsProps {
  data?: { Data?: RequestDto };
  isLoading: boolean;
}

export default function salaryDeductionFollowUpDetails({
  data,
  isLoading,
}: salaryDeductionFollowUpDetailsProps) {
  const request = data?.Data;

  const detailsData = {
    fullName: request?.FullName || "",
    jobPositionName: request?.JobPosition || request?.Title || "",
    personnelId: request?.ProcessRequestId ? String(request.ProcessRequestId) : "",
    nationalCode: request?.NationalCode || "",
    receiverOrganizationName: request?.BankName || "",
    facilityType: request?.IsGuarantee ? "ضمانت" : "تسهیلات عادی",
    amount: request?.Amount,
    installmentAmount: request?.InstallmentAmount,
    installmentCount: request?.InstallmentCount,
    visibleItems: [
      request?.HasJobPosition ? "سمت شغلی" : null,
      request?.HasEmploymentStartDate ? "تاریخ استخدام" : null,
      request?.HasPhoneNumber ? "شماره تماس" : null,
    ].filter(Boolean) as string[],
  };

  return (
    <DetailsList
      title="مشخصه درخواست صدور گواهی کسر از حقوق/ضمانت"
      rows={salaryDeductionDetailsConfig}
      data={detailsData}
      isLoading={isLoading}
    />
  );
}

"use client";

import { useMemo } from "react";
import type { DevelopmentReviewData } from "../development.types";
import type { useDevelopmentWorkflowBase } from "./useDevelopmentWorkflowBase";

type BaseResult = ReturnType<typeof useDevelopmentWorkflowBase>;

/**
 * Maps V1 API responses into the flat `DevelopmentReviewData` shape
 * consumed by detail schemas.
 */
export function useDevelopmentReviewData(base: BaseResult) {
  return useMemo<DevelopmentReviewData>(() => {
    const ticket = base.developmentTicket?.Data;
    const details = base.developmentDetails?.Data;
    const emp = base.employeeInfoData?.Data;
    return {
      requestId: base.requestId || "",
      fullName: emp?.FullName || "",
      jobTitle: emp?.Title || "",
      personnelId: emp?.PersonnelId || "",
      requestTypeName: details?.RequestTypeName || "",
      priorityName: details?.PriorityName || "",
      requestTitle: ticket?.Title || "",
      trackingCode: String(ticket?.TrackingCode || ""),
      description: details?.Description || "",
      extraDescription: details?.ExtraDescription || null,
      deputyName: details?.DeputyName || "",
      hasSimilarProcessName: details?.HasSimilarProcessName || "",
      hasSimilarProcess: details?.HasSimilarProcess ?? 0,
      similarProcessDescription: details?.SimilarProcessDescription || "",
      isRegulatoryCompliantName: details?.IsRegulatoryCompliantName || "",
      isRegulatoryCompliant: details?.IsRegulatoryCompliant ?? 0,
      regulatoryCompliantDescription: details?.RegulatoryCompliantDescription || null,
      beneficialCustomers: details?.BeneficialCustomers || "",
      customerUsageDescription: details?.CustomerUsageDescription || "",
      requestedFeatures: details?.RequestedFeatures || "",
      isReportRequired: details?.IsReportRequired ?? false,
      expectedOutput: details?.ExpectedOutput || "",
      technicalDetails: details?.TechnicalDetails || null,
      kpi: details?.Kpi || null,
      letterNumber: details?.LetterNumber || null,
      jiraTaskAssignee: details?.JiraTaskAssignee || null,
    };
  }, [
    base.requestId,
    base.developmentTicket?.Data,
    base.developmentDetails?.Data,
    base.employeeInfoData?.Data,
  ]);
}

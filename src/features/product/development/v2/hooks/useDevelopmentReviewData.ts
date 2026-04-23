"use client";

import { useMemo } from "react";
import type { DevelopmentReviewData } from "../development.types";
import type { useDevelopmentWorkflowBase } from "./useDevelopmentWorkflowBase";

type BaseResult = ReturnType<typeof useDevelopmentWorkflowBase>;

/**
 * Maps raw API responses from the workflow base into the flat
 * `DevelopmentReviewData` shape consumed by detail schemas.
 */
export function useDevelopmentReviewData(base: BaseResult) {
  return useMemo<DevelopmentReviewData>(() => {
    const dev = base.developmentData?.Data;
    const emp = base.employeeInfoData?.Data;
    const req = base.requestData?.Data;
    return {
      requestId: base.requestId || "",
      fullName: emp?.FullName || dev?.FullName || "",
      jobTitle: emp?.Title || "",
      personnelId: emp?.PersonnelId || "",
      requestTypeName: dev?.RequestTypeName || "",
      priorityName: dev?.PriorityName || "",
      requestTitle: req?.Title || "",
      trackingCode: base.trackingCode,
      deputyName: dev?.DeputyName || "",
      hasSimilarProcessName: dev?.HasSimilarProcessName || "",
      hasSimilarProcess: dev?.HasSimilarProcess ?? 0,
      similarProcessDescription: dev?.SimilarProcessDescription || "",
      isRegulatoryCompliantName: dev?.IsRegulatoryCompliantName || "",
      isRegulatoryCompliant: dev?.IsRegulatoryCompliant ?? 0,
      regulatoryCompliantDescription:
        dev?.RegulatoryCompliantDescription || null,
      beneficialCustomers: dev?.BeneficialCustomers || "",
      customerUsageDescription: dev?.CustomerUsageDescription || "",
      requestedFeatures: dev?.RequestedFeatures || "",
      isReportRequired: dev?.IsReportRequired ?? false,
      expectedOutput: dev?.ExpectedOutput || "",
      technicalDetails: dev?.TechnicalDetails || null,
      kpi: dev?.Kpi || null,
      letterNumber: dev?.LetterNumber || null,
      description: dev?.Description || "",
      extraDescription: dev?.ExtraDescription || null,
      jiraIssueKey: dev?.JiraIssueKey || null,
      jiraTaskAssignee: dev?.JiraTaskAssignee || null,
    };
  }, [
    base.requestId,
    base.requestData?.Data,
    base.developmentData?.Data,
    base.employeeInfoData?.Data,
    base.trackingCode,
  ]);
}

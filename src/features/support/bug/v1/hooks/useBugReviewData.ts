"use client";

import { useMemo } from "react";
import { priorityNames, priorityColors } from "../Bug.const";
import type { BugReviewData } from "../Bug.types";
import type { useBugWorkflowBase } from "./useBugWorkflowBase";

type BaseResult = ReturnType<typeof useBugWorkflowBase>;

export function useBugReviewData(base: BaseResult) {
  return useMemo<BugReviewData>(() => {
    const bug = base.bugData?.Data;
    const status = base.requestStatus?.Data;
    return {
      requestId: base.requestId || "",
      title: bug?.Title || "",
      priority: bug?.Priority ?? 0,
      priorityLabel: bug?.Priority ? (priorityNames as Record<number, string>)[bug.Priority] || "" : "",
      priorityColor: bug?.Priority ? (priorityColors as Record<number, string>)[bug.Priority] || "" : "",
      featureName: bug?.FeatureName || "",
      applicationName: bug?.ApplicationName || "",
      description: bug?.Description || "",
      link: bug?.Link || "",
      jiraIssueKey: bug?.JiraIssueKey || "",
      fullName: status?.FullName || "",
      jobPositionName: status?.JobPositionName || "",
      statusName: status?.StatusName || "",
      statusCode: status?.StatusCode ?? 0,
      createdDate: status?.CreatedDate || "",
    };
  }, [
    base.requestId,
    base.bugData?.Data,
    base.requestStatus?.Data,
  ]);
}

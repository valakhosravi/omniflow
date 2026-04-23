"use client";

import { useEffect, useMemo } from "react";
import { useWorkflowBase } from "@/hooks/workflow";
import { useGetTaskByIdQuery } from "@/packages/camunda";
import {
  useGetLoanRequestByRequestIdQuery,
  useGetSalaryAdvancedPaidRequestPerYearQuery,
} from "../api/advanceMoneyApi";
import { useLazyGetEmployeeInfoByPersonnelIdQuery } from "@/services/commonApi/commonApi";

export function useSalaryAdvanceWorkflowBase() {
  const base = useWorkflowBase();

  const {
    data: loanRequestDetails,
    isLoading: isLoanLoading,
  } = useGetLoanRequestByRequestIdQuery(base.requestIdNumber, {
    skip: !base.requestId,
    refetchOnMountOrArgChange: true,
  });

  const { data: salaryAdvancedPaidRequest } =
    useGetSalaryAdvancedPaidRequestPerYearQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const [getEmployeeInfo, { data: userData }] =
    useLazyGetEmployeeInfoByPersonnelIdQuery();

  useEffect(() => {
    if (base.requestData?.Data?.PersonnelId) {
      getEmployeeInfo(base.requestData.Data.PersonnelId);
    }
  }, [base.requestData?.Data?.PersonnelId, getEmployeeInfo]);

  const { data: taskData } = useGetTaskByIdQuery(base.taskId || "", {
    skip: !base.taskId,
  });

  const isTaskClaimed = useMemo(
    () => Boolean(taskData?.assignee),
    [taskData?.assignee],
  );

  const isInitialDataLoading = useMemo(
    () => !!base.requestId && (base.isRequestDataLoading || isLoanLoading),
    [base.requestId, base.isRequestDataLoading, isLoanLoading],
  );

  return {
    ...base,
    isInitialDataLoading,
    loanRequestDetails,
    salaryAdvancedPaidRequest,
    userData,
    taskData,
    isTaskClaimed,
  };
}

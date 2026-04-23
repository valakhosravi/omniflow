import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import {
  useGetAmountRatioQuery,
  useGetProcessRuleByProcessTypeIdQuery,
  useGetSalaryAdvancedPaidRequestPerYearQuery,
  useGetUnterminatedProcessQuery,
  useLazyGetLoanCapacityPerMonthQuery,
} from "../api/advanceMoneyApi";
import { ProcessType, STATUS_CODE_PAID } from "../salary-advance.constants";
import { RuleType, RuleValidationResult } from "../salary-advance.types";
import { buildValidationValues, validateRules } from "../utils/ruleEngine";

const VALIDATION_ERROR_RESULT: RuleValidationResult = {
  isValid: false,
  errors: [
    {
      ruleId: 0,
      ruleType: RuleType.EMPLOYEE_STATUS,
      message: "خطا در اعتبارسنجی قوانین",
      code: "VALIDATION_ERROR",
    },
  ],
};

export function useAdvanceMoneyStartPage() {
  const { userDetail } = useAuth();

  const [
    getLoanCapacityPerMonth,
    {
      data: loanCapacity,
      isLoading: isLoanCapacityLoading,
      isError: isLoanCapacityError,
    },
  ] = useLazyGetLoanCapacityPerMonthQuery();

  const {
    data: unterminatedProcess,
    isLoading: isUnterminatedProcessLoading,
    isError: isUnterminatedProcessError,
    error: unterminatedProcessError,
  } = useGetUnterminatedProcessQuery(ProcessType.SALARY_ADVANCE, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: salaryAdvancedPaidRequest,
    isLoading: isSalaryAdvancedPaidRequestLoading,
    isError: isSalaryAdvancedPaidRequestError,
  } = useGetSalaryAdvancedPaidRequestPerYearQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: processRule,
    isLoading: isProcessRuleLoading,
    isError: isProcessRuleError,
  } = useGetProcessRuleByProcessTypeIdQuery(ProcessType.SALARY_ADVANCE, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: amountRatio,
    isLoading: isAmountRatioLoading,
    isError: isAmountRatioError,
  } = useGetAmountRatioQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [selectedAmountRatioId, setSelectedAmountRatioId] = useState<
    number | undefined
  >();

  const { capacityRule, frequencyRule, durationRule } = useMemo(() => {
    const rules = processRule?.Data;
    return {
      capacityRule: rules?.find(
        (r) => r.Type === RuleType.REQUEST_FREQUENCY_PER_YEAR,
      ),
      frequencyRule: rules?.find((r) => r.Type === RuleType.REQUEST_FREQUENCY),
      durationRule: rules?.find((r) => r.Type === RuleType.EMPLOYMENT_DURATION),
    };
  }, [processRule]);

  const validationResult = useMemo<RuleValidationResult | null>(() => {
    if (
      !processRule?.Data ||
      !userDetail?.UserDetail.IsActive ||
      !userDetail?.UserDetail.EmploymentDate
    ) {
      return null;
    }

    try {
      const { IsActive, EmploymentDate } = userDetail.UserDetail;
      return validateRules({
        rules: processRule.Data,
        values: buildValidationValues(
          { IsActive, EmploymentDate },
          salaryAdvancedPaidRequest?.Data,
        ),
        paidRequestGroups: salaryAdvancedPaidRequest?.Data,
        selectedAmountRatioId,
        amountRatios: amountRatio?.Data,
      });
    } catch (error) {
      console.error("Rule validation error:", error);
      return VALIDATION_ERROR_RESULT;
    }
  }, [
    processRule,
    salaryAdvancedPaidRequest,
    userDetail,
    selectedAmountRatioId,
    amountRatio,
  ]);

  useEffect(() => {
    if (capacityRule) {
      getLoanCapacityPerMonth({
        CapacityCount: capacityRule.Value.toString(),
        ProcessTypeId: ProcessType.SALARY_ADVANCE.toString(),
        StatusCode: STATUS_CODE_PAID,
      });
    }
  }, [capacityRule, getLoanCapacityPerMonth]);

  const isLoading =
    isUnterminatedProcessLoading ||
    isSalaryAdvancedPaidRequestLoading ||
    isProcessRuleLoading ||
    isAmountRatioLoading ||
    isLoanCapacityLoading;

  const errorMessage = useMemo(() => {
    if (isProcessRuleError) return "خطا در دریافت قوانین فرآیند.";
    if (isAmountRatioError) return "خطا در دریافت اطلاعات نسبت مبلغ.";
    if (isSalaryAdvancedPaidRequestError)
      return "خطا در دریافت سوابق درخواست مساعده.";
    if (
      isUnterminatedProcessError &&
      (unterminatedProcessError as any).status !== 404
    )
      return "خطا در بررسی درخواست‌های در حال پردازش.";
    if (isLoanCapacityError) return "خطا در بررسی ظرفیت درخواست مساعده.";
    return null;
  }, [
    isProcessRuleError,
    isAmountRatioError,
    isSalaryAdvancedPaidRequestError,
    isUnterminatedProcessError,
    isLoanCapacityError,
    unterminatedProcessError,
  ]);

  return {
    validationResult,
    loanCapacity,
    unterminatedProcess,
    salaryAdvancedPaidRequest,
    amountRatio,
    selectedAmountRatioId,
    setSelectedAmountRatioId,
    capacityRule,
    frequencyRule,
    durationRule,
    isLoading,
    errorMessage,
  };
}

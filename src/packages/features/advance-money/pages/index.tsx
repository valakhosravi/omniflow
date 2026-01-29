"use client";

import React, { useEffect, useState } from "react";
import AdvanceMoneyLayout from "../layouts";
import AdvanceMoneyHeader from "../components/AdvanceMoneyHeader";
import AdditionalInformationApplicant from "../components/AdditionalInformationApplicant";
import RequestDescription from "../components/RequestDescription";
import {
  useGetAmountRatioQuery,
  useGetProcessRuleByProcessTypeIdQuery,
  useGetSalaryAdvancedPaidRequestPerYearQuery,
  useGetUnterminatedProcessQuery,
  useLazyGetLoanCapacityPerMonthQuery,
} from "../api/advanceMoneyApi";
import {
  validateRules,
  RuleType,
  RuleValidationResult,
} from "../util/ruleEngine";
import Loading from "@/ui/Loading";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useGetEmployeeInfoByPersonnelId } from "@/hooks/process/useHumanResource";
import { CloseCircle } from "iconsax-reactjs";

export default function AdvanceMoneyIndex() {
  const { userDetail } = useAuth();
  const { employeeInfoData } = useGetEmployeeInfoByPersonnelId(
    userDetail?.UserDetail.PersonnelId
      ? parseInt(userDetail.UserDetail.PersonnelId)
      : undefined
  );
  const [
    getLoanCapacityPerMonth,
    { data: loanCapacity, isLoading: isLoanCapacityLoading },
  ] = useLazyGetLoanCapacityPerMonthQuery();
  const { data: unterminatedProcess, isLoading: isUnterminatedProcessLoading } =
    useGetUnterminatedProcessQuery(2, {
      refetchOnMountOrArgChange: true,
    });
  const {
    data: salaryAdvancedPaidRequest,
    isLoading: isSalaryAdvancedPaidRequestLoading,
  } = useGetSalaryAdvancedPaidRequestPerYearQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: processRule, isLoading: isProcessRuleLoading } =
    useGetProcessRuleByProcessTypeIdQuery(2, {
      refetchOnMountOrArgChange: true,
    });
  const { data: amountRatio, isLoading: isAmountRatioLoading } =
    useGetAmountRatioQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const [validationResult, setValidationResult] =
    useState<RuleValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedAmountRatioId, setSelectedAmountRatioId] = useState<
    number | undefined
  >();

  // Validate rules when all required data is available
  useEffect(() => {
    if (
      !processRule?.Data ||
      !userDetail?.UserDetail.IsActive ||
      !userDetail?.UserDetail.EmploymentDate
    ) {
      return;
    }

    setIsValidating(true);

    try {
      // Prepare validation values based on available data
      const validationValues: Record<RuleType, number> = {
        [RuleType.EMPLOYEE_STATUS]: userDetail?.UserDetail.IsActive ? 1 : 0,
        [RuleType.EMPLOYMENT_DURATION]: userDetail?.UserDetail.EmploymentDate
          ? new Date(userDetail.UserDetail.EmploymentDate).getTime()
          : 0,
        [RuleType.REQUEST_FREQUENCY]: 0, // This will be calculated based on the new structure
        [RuleType.REQUEST_FREQUENCY_PER_YEAR]: 0, // This will be calculated based on the new structure
        [RuleType.REQUEST_FREQUENCY_PER_AMOUNT_RATIO]: 0, // This will be handled in the rule validation
      };

      // Calculate total requests from the new structure
      if (salaryAdvancedPaidRequest?.Data) {
        const totalRequests = salaryAdvancedPaidRequest.Data.reduce(
          (total, group) => total + group.Details.length,
          0
        );
        validationValues[RuleType.REQUEST_FREQUENCY] = totalRequests;

        // Calculate current year requests
        const currentYear = new Date().getFullYear();
        const currentYearRequests = salaryAdvancedPaidRequest.Data.reduce(
          (total, group) => {
            return (
              total +
              group.Details.filter(
                (detail) =>
                  new Date(detail.RequestCreatedDate).getFullYear() ===
                  currentYear
              ).length
            );
          },
          0
        );
        validationValues[RuleType.REQUEST_FREQUENCY_PER_YEAR] =
          currentYearRequests;
      }

      const result = validateRules(
        processRule.Data,
        validationValues,
        salaryAdvancedPaidRequest?.Data,
        selectedAmountRatioId,
        amountRatio?.Data
      );
      setValidationResult(result);

      getLoanCapacityPerMonth({
        CapacityCount:
          processRule.Data.find((rule) => rule.Type === 4)?.Value.toString() ||
          "",
        ProcessTypeId: "2",
        StatusCode: "108",
      });
    } catch (error) {
      console.error("Rule validation error:", error);
      setValidationResult({
        isValid: false,
        errors: [
          {
            ruleId: 0,
            ruleType: RuleType.EMPLOYEE_STATUS,
            message: "خطا در اعتبارسنجی قوانین",
            code: "VALIDATION_ERROR",
          },
        ],
      });
    } finally {
      setIsValidating(false);
    }
  }, [
    processRule,
    salaryAdvancedPaidRequest,
    getLoanCapacityPerMonth,
    userDetail,
    employeeInfoData,
    selectedAmountRatioId,
    amountRatio,
  ]);

  // Show loading state during validation
  if (isValidating) {
    return (
      <AdvanceMoneyLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">در حال اعتبارسنجی...</p>
          </div>
        </div>
      </AdvanceMoneyLayout>
    );
  }

  if (
    isValidating ||
    isUnterminatedProcessLoading ||
    isSalaryAdvancedPaidRequestLoading ||
    isProcessRuleLoading ||
    isAmountRatioLoading ||
    isLoanCapacityLoading
  ) {
    return (
      <AdvanceMoneyLayout>
        <Loading />
      </AdvanceMoneyLayout>
    );
  }

  return (
    <AdvanceMoneyLayout>
      <AdvanceMoneyHeader />
      {loanCapacity?.Data === true ? (
        <div className="flex gap-x-4 items-start justify-center">
          <div className="w-[1093px] flex gap-x-4 items-start justify-center">
            <RequestDescription
              unterminatedProcess={unterminatedProcess?.Data}
              errors={validationResult?.errors || []}
              amountRatio={amountRatio?.Data}
              onAmountRatioChange={setSelectedAmountRatioId}
            />
            <div>
              {processRule?.Data?.find((rule) => rule.Type === 4)?.Value && (
                <AdditionalInformationApplicant
                  salaryAdvancedPaidRequest={
                    salaryAdvancedPaidRequest?.Data || []
                  }
                  totalValidAdvanceRequest={
                    processRule?.Data?.find((rule) => rule.Type === 3)?.Value ||
                    0
                  }
                  employmentDurationThreshold={
                    processRule?.Data?.find((rule) => rule.Type === 2)?.Value ||
                    0
                  }
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div
            className="text-red-500 rounded-2xl p-4 border border-red-200 bg-red-100 
          flex gap-3 items-center"
          >
            <CloseCircle size={32} />
            <div>ظرفیت درخواست مساعده در این ماه به پایان رسیده است.</div>
          </div>
        </div>
      )}
    </AdvanceMoneyLayout>
  );
}

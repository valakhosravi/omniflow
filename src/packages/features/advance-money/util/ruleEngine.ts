import { ProcessRule } from "@/models/advance-money/ProcessRule";
import { SalaryAdvancedPaidRequestGroup } from "@/models/advance-money/SalaryAdvancedPaidRequest";

// Enum for Process Types
export enum ProcessType {
  SALARY_ADVANCE = 2,
}

// Enum for Rule Types
export enum RuleType {
  EMPLOYEE_STATUS = 1, // فعال یا غیر فعال بودن کارمند
  EMPLOYMENT_DURATION = 2, // مدت زمان استخدام
  REQUEST_FREQUENCY = 3, // بیشتر از دو بار در سال درخواست نداده باشد
  REQUEST_FREQUENCY_PER_YEAR = 4, //
  REQUEST_FREQUENCY_PER_AMOUNT_RATIO = 5, // تعداد درخواست برای هر AmountRatioId
}

// Error types for validation
export interface RuleError {
  ruleId: number;
  ruleType: RuleType;
  message: string;
  code: string;
  amountRatioId?: number; // Add this to identify which AmountRatioId the error is for
}

// Result interface for rule validation
export interface RuleValidationResult {
  isValid: boolean;
  errors: RuleError[];
}

export function getMonthsDifference(date1: Date, date2: Date): number {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  const monthDiff = date2.getMonth() - date1.getMonth();
  return yearDiff * 12 + monthDiff;
}

// Helper function to create error objects
const createError = (
  rule: ProcessRule,
  message: string,
  code: string,
  amountRatioId?: number
): RuleError => ({
  ruleId: rule.ProcessRuleId,
  ruleType: rule.Type,
  message,
  code,
  amountRatioId,
});

// Validate amount ratio limits specifically
export const validateAmountRatioLimits = (
  salaryAdvancedPaidRequestGroups: SalaryAdvancedPaidRequestGroup[],
  selectedAmountRatioId: number,
  amountRatio: any[]
): RuleError[] => {
  const errors: RuleError[] = [];
  const currentYear = new Date().getFullYear();
  
  // Find the selected amount ratio details
  const selectedRatio = amountRatio.find(ratio => ratio.SalaryAdvancedAmountRatioId === selectedAmountRatioId);
  
  if (!selectedRatio) {
    return errors;
  }
  
  // Find the group that contains requests for this AmountRatioId
  const relevantGroup = salaryAdvancedPaidRequestGroups.find(group =>
    group.Details.some(detail => detail.AmountRatioId === selectedAmountRatioId)
  );
  
  if (relevantGroup) {
    // Count requests for this AmountRatioId in the current year
    const currentYearRequests = relevantGroup.Details.filter(detail => {
      const requestYear = new Date(detail.RequestCreatedDate).getFullYear();
      return requestYear === currentYear && detail.AmountRatioId === selectedAmountRatioId;
    }).length;
    
    if (currentYearRequests >= relevantGroup.MaxLoansPerMonth) {
      errors.push({
        ruleId: 0,
        ruleType: RuleType.REQUEST_FREQUENCY_PER_AMOUNT_RATIO,
        message: `تعداد درخواست‌های سالانه برای این مبلغ نباید بیشتر از ${relevantGroup.MaxLoansPerMonth} باشد`,
        code: "REQUEST_FREQUENCY_PER_AMOUNT_RATIO_EXCEEDED",
        amountRatioId: selectedAmountRatioId
      });
    }
  }
  
  return errors;
};

// Validate a single rule
export const validateRule = (
  rule: ProcessRule,
  value?: number,
  salaryAdvancedPaidRequestGroups?: SalaryAdvancedPaidRequestGroup[],
  selectedAmountRatioId?: number
): RuleValidationResult => {
  const errors: RuleError[] = [];

  // Skip inactive rules
  if (!rule.IsActive) {
    return { isValid: true, errors: [] };
  }

  switch (rule.ProcessTypeId) {
    case ProcessType.SALARY_ADVANCE:
      switch (rule.Type) {
        case RuleType.EMPLOYEE_STATUS:
          if (rule.Value !== 1) {
            errors.push(
              createError(rule, "کارمند فعال نمی باشد", "EMPLOYEE_INACTIVE")
            );
          }
          break;

        case RuleType.EMPLOYMENT_DURATION:
          if (!value) {
            errors.push(
              createError(
                rule,
                "مقدار مدت زمان استخدام الزامی است",
                "EMPLOYMENT_DURATION_MISSING"
              )
            );
            break;
          }
          const employmentDate = value ? new Date(value) : null;
          const currentDate = new Date();
          const monthsSinceEmployment = employmentDate
            ? getMonthsDifference(employmentDate, currentDate)
            : 0;
          if (monthsSinceEmployment < rule.Value) {
            errors.push(
              createError(
                rule,
                `مدت زمان استخدام باید حداقل ${rule.Value} ماه باشد`,
                "EMPLOYMENT_DURATION_INSUFFICIENT"
              )
            );
          }
          break;

        case RuleType.REQUEST_FREQUENCY:
          if (value && rule.Value < value) {
            errors.push(
              createError(
                rule,
                `تعداد درخواست‌ها نباید بیشتر از ${rule.Value} باشد`,
                "REQUEST_FREQUENCY_EXCEEDED"
              )
            );
          }
          break;

        case RuleType.REQUEST_FREQUENCY_PER_YEAR:
          // if (!value) {
          //   errors.push(createError(
          //     rule,
          //     "مقدار تعداد درخواست‌های سالانه الزامی است",
          //     "REQUEST_FREQUENCY_PER_YEAR_MISSING"
          //   ));
          // } else if (rule.Value < value) {
          //   errors.push(createError(
          //     rule,
          //     `تعداد درخواست‌های سالانه نباید بیشتر از ${rule.Value} باشد`,
          //     "REQUEST_FREQUENCY_PER_YEAR_EXCEEDED"
          //   ));
          // }
          break;

        case RuleType.REQUEST_FREQUENCY_PER_AMOUNT_RATIO:
          // New rule type for checking MaxLoansPerMonth per AmountRatioId
          if (salaryAdvancedPaidRequestGroups && selectedAmountRatioId) {
            const currentYear = new Date().getFullYear();
            
            // Find the group that contains the selected AmountRatioId
            const relevantGroup = salaryAdvancedPaidRequestGroups.find(group =>
              group.Details.some(detail => detail.AmountRatioId === selectedAmountRatioId)
            );
            
            if (relevantGroup) {
              // Count requests for this AmountRatioId in the current year
              const currentYearRequests = relevantGroup.Details.filter(detail => {
                const requestYear = new Date(detail.RequestCreatedDate).getFullYear();
                return requestYear === currentYear && detail.AmountRatioId === selectedAmountRatioId;
              }).length;
              
              if (currentYearRequests >= relevantGroup.MaxLoansPerMonth) {
                errors.push(
                  createError(
                    rule,
                    `تعداد درخواست‌های سالانه برای این مبلغ نباید بیشتر از ${relevantGroup.MaxLoansPerMonth} باشد`,
                    "REQUEST_FREQUENCY_PER_AMOUNT_RATIO_EXCEEDED",
                    selectedAmountRatioId
                  )
                );
              }
            }
          }
          break;

        default:
          errors.push(
            createError(rule, "نوع قانون یافت نشد", "UNKNOWN_RULE_TYPE")
          );
      }
      break;

    default:
      errors.push(
        createError(rule, "نوع فرآیند یافت نشد", "UNKNOWN_PROCESS_TYPE")
      );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate multiple rules
export const validateRules = (
  rules: ProcessRule[],
  values?: Record<RuleType, number>,
  salaryAdvancedPaidRequestGroups?: SalaryAdvancedPaidRequestGroup[],
  selectedAmountRatioId?: number,
  amountRatio?: any[]
): RuleValidationResult => {
  const allErrors: RuleError[] = [];
  let allValid = true;

  for (const rule of rules) {
    const value = values?.[rule.Type as RuleType];
    const result = validateRule(rule, value, salaryAdvancedPaidRequestGroups, selectedAmountRatioId);

    if (!result.isValid) {
      allValid = false;
      allErrors.push(...result.errors);
    }
  }

  // Add amount ratio specific validation if a ratio is selected
  if (selectedAmountRatioId && salaryAdvancedPaidRequestGroups && amountRatio) {
    const amountRatioErrors = validateAmountRatioLimits(
      salaryAdvancedPaidRequestGroups,
      selectedAmountRatioId,
      amountRatio
    );
    if (amountRatioErrors.length > 0) {
      allValid = false;
      allErrors.push(...amountRatioErrors);
    }
  }

  return {
    isValid: allValid,
    errors: allErrors,
  };
};

// Legacy function for backward compatibility (deprecated)
export const ruleEngine = (rule: ProcessRule, value?: number): boolean => {
  const result = validateRule(rule, value);
  if (!result.isValid) {
    // For backward compatibility, throw the first error
    const firstError = result.errors[0];
    throw new Error(firstError.message);
  }
  return true;
};

import { ProcessType } from "../salary-advance.constants";
import {
  ProcessRule,
  SalaryAdvancedPaidRequestGroup,
  RuleType,
  RuleError,
  RuleValidationResult,
} from "../salary-advance.types";

export interface ValidateRulesOptions {
  rules: ProcessRule[];
  values?: Record<RuleType, number>;
  paidRequestGroups?: SalaryAdvancedPaidRequestGroup[];
  selectedAmountRatioId?: number;
  amountRatios?: any[];
}

export function getMonthsDifference(date1: Date, date2: Date): number {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  const monthDiff = date2.getMonth() - date1.getMonth();
  return yearDiff * 12 + monthDiff;
}

export function buildValidationValues(
  userDetail: { IsActive: boolean; EmploymentDate: string | undefined },
  paidRequests?: SalaryAdvancedPaidRequestGroup[],
): Record<RuleType, number> {
  const values: Record<RuleType, number> = {
    [RuleType.EMPLOYEE_STATUS]: userDetail.IsActive ? 1 : 0,
    [RuleType.EMPLOYMENT_DURATION]: userDetail.EmploymentDate
      ? new Date(userDetail.EmploymentDate).getTime()
      : 0,
    [RuleType.REQUEST_FREQUENCY]: 0,
    [RuleType.REQUEST_FREQUENCY_PER_YEAR]: 0,
    [RuleType.REQUEST_FREQUENCY_PER_AMOUNT_RATIO]: 0,
  };

  if (paidRequests) {
    values[RuleType.REQUEST_FREQUENCY] = paidRequests.reduce(
      (total, group) => total + group.Details.length,
      0,
    );

    const currentYear = new Date().getFullYear();
    values[RuleType.REQUEST_FREQUENCY_PER_YEAR] = paidRequests.reduce(
      (total, group) =>
        total +
        group.Details.filter(
          (d) =>
            new Date(d.RequestCreatedDate).getFullYear() === currentYear,
        ).length,
      0,
    );
  }

  return values;
}

const createError = (
  rule: ProcessRule,
  message: string,
  code: string,
  amountRatioId?: number,
): RuleError => ({
  ruleId: rule.ProcessRuleId,
  ruleType: rule.Type,
  message,
  code,
  amountRatioId,
});

const validateAmountRatioLimits = (
  paidRequestGroups: SalaryAdvancedPaidRequestGroup[],
  selectedAmountRatioId: number,
  amountRatios: any[],
): RuleError[] => {
  const errors: RuleError[] = [];
  const currentYear = new Date().getFullYear();

  const selectedRatio = amountRatios.find(
    (ratio) =>
      ratio.SalaryAdvancedAmountRatioId === selectedAmountRatioId,
  );

  if (!selectedRatio) {
    return errors;
  }

  const relevantGroup = paidRequestGroups.find((group) =>
    group.Details.some(
      (detail) => detail.AmountRatioId === selectedAmountRatioId,
    ),
  );

  if (relevantGroup) {
    const currentYearRequests = relevantGroup.Details.filter((detail) => {
      const requestYear = new Date(
        detail.RequestCreatedDate,
      ).getFullYear();
      return (
        requestYear === currentYear &&
        detail.AmountRatioId === selectedAmountRatioId
      );
    }).length;

    if (currentYearRequests >= relevantGroup.MaxLoansPerMonth) {
      errors.push({
        ruleId: 0,
        ruleType: RuleType.REQUEST_FREQUENCY_PER_AMOUNT_RATIO,
        message: `تعداد درخواست‌های سالانه برای این مبلغ نباید بیشتر از ${relevantGroup.MaxLoansPerMonth} باشد`,
        code: "REQUEST_FREQUENCY_PER_AMOUNT_RATIO_EXCEEDED",
        amountRatioId: selectedAmountRatioId,
      });
    }
  }

  return errors;
};

const validateRule = (
  rule: ProcessRule,
  value?: number,
  paidRequestGroups?: SalaryAdvancedPaidRequestGroup[],
  selectedAmountRatioId?: number,
): RuleValidationResult => {
  const errors: RuleError[] = [];

  if (!rule.IsActive) {
    return { isValid: true, errors: [] };
  }

  switch (rule.ProcessTypeId) {
    case ProcessType.SALARY_ADVANCE:
      switch (rule.Type) {
        case RuleType.EMPLOYEE_STATUS:
          if (rule.Value !== 1) {
            errors.push(
              createError(rule, "کارمند فعال نمی باشد", "EMPLOYEE_INACTIVE"),
            );
          }
          break;

        case RuleType.EMPLOYMENT_DURATION:
          if (!value) {
            errors.push(
              createError(
                rule,
                "مقدار مدت زمان استخدام الزامی است",
                "EMPLOYMENT_DURATION_MISSING",
              ),
            );
            break;
          }
          const employmentDate = new Date(value);
          const monthsSinceEmployment = getMonthsDifference(
            employmentDate,
            new Date(),
          );
          if (monthsSinceEmployment < rule.Value) {
            errors.push(
              createError(
                rule,
                `مدت زمان استخدام باید حداقل ${rule.Value} ماه باشد`,
                "EMPLOYMENT_DURATION_INSUFFICIENT",
              ),
            );
          }
          break;

        case RuleType.REQUEST_FREQUENCY:
          if (value && rule.Value < value) {
            errors.push(
              createError(
                rule,
                `تعداد درخواست‌ها نباید بیشتر از ${rule.Value} باشد`,
                "REQUEST_FREQUENCY_EXCEEDED",
              ),
            );
          }
          break;

        case RuleType.REQUEST_FREQUENCY_PER_YEAR:
          break;

        case RuleType.REQUEST_FREQUENCY_PER_AMOUNT_RATIO:
          if (paidRequestGroups && selectedAmountRatioId) {
            const currentYear = new Date().getFullYear();

            const relevantGroup = paidRequestGroups.find((group) =>
              group.Details.some(
                (detail) =>
                  detail.AmountRatioId === selectedAmountRatioId,
              ),
            );

            if (relevantGroup) {
              const currentYearRequests = relevantGroup.Details.filter(
                (detail) => {
                  const requestYear = new Date(
                    detail.RequestCreatedDate,
                  ).getFullYear();
                  return (
                    requestYear === currentYear &&
                    detail.AmountRatioId === selectedAmountRatioId
                  );
                },
              ).length;

              if (currentYearRequests >= relevantGroup.MaxLoansPerMonth) {
                errors.push(
                  createError(
                    rule,
                    `تعداد درخواست‌های سالانه برای این مبلغ نباید بیشتر از ${relevantGroup.MaxLoansPerMonth} باشد`,
                    "REQUEST_FREQUENCY_PER_AMOUNT_RATIO_EXCEEDED",
                    selectedAmountRatioId,
                  ),
                );
              }
            }
          }
          break;

        default:
          errors.push(
            createError(rule, "نوع قانون یافت نشد", "UNKNOWN_RULE_TYPE"),
          );
      }
      break;

    default:
      errors.push(
        createError(rule, "نوع فرآیند یافت نشد", "UNKNOWN_PROCESS_TYPE"),
      );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRules = ({
  rules,
  values,
  paidRequestGroups,
  selectedAmountRatioId,
  amountRatios,
}: ValidateRulesOptions): RuleValidationResult => {
  const allErrors: RuleError[] = [];
  let allValid = true;

  for (const rule of rules) {
    const value = values?.[rule.Type as RuleType];
    const result = validateRule(
      rule,
      value,
      paidRequestGroups,
      selectedAmountRatioId,
    );

    if (!result.isValid) {
      allValid = false;
      allErrors.push(...result.errors);
    }
  }

  if (selectedAmountRatioId && paidRequestGroups && amountRatios) {
    const amountRatioErrors = validateAmountRatioLimits(
      paidRequestGroups,
      selectedAmountRatioId,
      amountRatios,
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

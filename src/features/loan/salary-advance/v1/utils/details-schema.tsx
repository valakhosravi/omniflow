import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { SalaryAdvanceReviewData, CheckFormKey } from "../salary-advance.types";
import { formatTimePeriod } from "@/utils/dateFormatter";

const ALWAYS: DetailRow<SalaryAdvanceReviewData>[] = [
  {
    key: "fullName",
    label: "نام و نام خانوادگی",
    icon: "User",
    type: "text",
    value: ({ data }) => data.fullName,
  },
  {
    key: "personnelId",
    label: "شماره پرسنلی",
    icon: "UserTag",
    type: "text",
    value: ({ data }) => data.personnelId,
  },
  {
    key: "trackingCode",
    label: "کد پیگیری",
    icon: "SmsTracking",
    type: "text",
    value: ({ data }) => data.trackingCode,
  },
  {
    key: "jobTitle",
    label: "سمت",
    icon: "UserTag",
    type: "text",
    value: ({ data }) => data.jobTitle,
  },
];

const AMOUNT_ROW: DetailRow<SalaryAdvanceReviewData> = {
  key: "amount",
  label: "مبلغ درخواستی",
  icon: "Coin",
  type: "text",
  value: ({ data }) =>
    data.amount ? `${data.amount.toLocaleString()} ریال` : "",
};

const AMOUNT_RATIO_ROW: DetailRow<SalaryAdvanceReviewData> = {
  key: "amountRatio",
  label: "درصد درخواست مساعده",
  icon: "PercentageCircle",
  type: "text",
  value: ({ data }) => `${(data.amountRatio || 0) * 100}%`,
};

const MAX_LOANS_ROW: DetailRow<SalaryAdvanceReviewData> = {
  key: "maxLoansPerMonth",
  label: "امکان درخواست حداکثر ",
  icon: "PercentageCircle",
  type: "text",
  value: ({ data }) => `${data.maxLoansPerMonth || 0} بار در سال`,
};

const IS_STANDARD_ROW: DetailRow<SalaryAdvanceReviewData> = {
  key: "isStandard",
  label: "دارای شرایط خاص",
  icon: "Warning2",
  type: "text",
  value: ({ data }) => (data.isStandard ? "خیر" : "بله"),
};

const REPAYMENT_ROW: DetailRow<SalaryAdvanceReviewData> = {
  key: "repaymentMonth",
  label: "تعداد ماه بازپرداخت",
  icon: "Calendar",
  type: "text",
  value: ({ data }) => `${data.repaymentMonth || 0} ماه`,
};

const PAID_REQUESTS_ROW: DetailRow<SalaryAdvanceReviewData> = {
  key: "paidRequestsCount",
  label: "تعداد درخواست های ثبت شده در سال",
  icon: "Money",
  type: "text",
  value: ({ data }) => String(data.paidRequestsCount),
};

const EMPLOYMENT_DATE_ROW: DetailRow<SalaryAdvanceReviewData> = {
  key: "employmentDate",
  label: "تاریخ استخدام",
  icon: "Calendar",
  type: "text",
  value: ({ data }) => {
    if (!data.employmentDate) return "";
    const persianDate = new Date(data.employmentDate)
      .toLocaleString("fa-IR")
      .split(", ")[0];
    const duration = formatTimePeriod(data.employmentDate);
    return (
      <span>
        {persianDate}
        {duration && (
          <span className="text-xs text-[#1C3A6399]"> ({duration})</span>
        )}
      </span>
    );
  },
};

const NATIONAL_CODE_ROW: DetailRow<SalaryAdvanceReviewData> = {
  key: "nationalCode",
  label: "کد ملی",
  icon: "CardCoin",
  type: "text",
  value: ({ data }) => data.nationalCode,
};

const DESTINATION_ROW: DetailRow<SalaryAdvanceReviewData> = {
  key: "destination",
  label: "مقصد",
  icon: "CardCoin",
  type: "text",
  value: ({ data }) => data.destination,
};

const CONFIG_MAP: Record<CheckFormKey, DetailRow<SalaryAdvanceReviewData>[]> = {
  "salary-advance-request-pre-check": [
    ...ALWAYS,
    AMOUNT_ROW,
    AMOUNT_RATIO_ROW,
    MAX_LOANS_ROW,
    IS_STANDARD_ROW,
    REPAYMENT_ROW,
  ],
  "salary-advance-request-hrh-check": [
    ...ALWAYS,
    AMOUNT_ROW,
    AMOUNT_RATIO_ROW,
    MAX_LOANS_ROW,
    IS_STANDARD_ROW,
    PAID_REQUESTS_ROW,
    EMPLOYMENT_DATE_ROW,
    NATIONAL_CODE_ROW,
  ],
  "salary-advance-request-hrm-check": [
    ...ALWAYS,
    AMOUNT_ROW,
    IS_STANDARD_ROW,
  ],
  "salary-advance-request-fm-check": [
    ...ALWAYS,
    AMOUNT_ROW,
  ],
  "salary-advance-request-te-check": [
    ...ALWAYS,
    AMOUNT_ROW,
    DESTINATION_ROW,
  ],
};

export function getCheckDetailsConfig(
  formKey: CheckFormKey,
): DetailRow<SalaryAdvanceReviewData>[] {
  return CONFIG_MAP[formKey];
}

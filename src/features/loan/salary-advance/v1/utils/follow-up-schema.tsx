import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { SalaryAdvanceFollowUpData } from "../salary-advance.types";
import { formatTimePeriod } from "@/utils/dateFormatter";

export const salaryAdvanceFollowUpDetailsConfig: DetailRow<SalaryAdvanceFollowUpData>[] =
  [
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
      key: "amountRatio",
      label: "درصد درخواست مساعده",
      icon: "PercentageCircle",
      type: "text",
      value: ({ data }) => `${data.amountRatio * 100}%`,
    },
    {
      key: "repaymentMonth",
      label: "بازپرداخت",
      icon: "Money",
      type: "text",
      value: ({ data }) => `${data.repaymentMonth.toLocaleString()} ماه`,
    },
    {
      key: "isStandard",
      label: "دارای شرایط خاص",
      icon: "Warning2",
      type: "text",
      value: ({ data }) => (data.isStandard ? "خیر" : "بله"),
    },
    {
      key: "paidRequestsCount",
      label: "تعداد درخواست های ثبت شده در سال",
      icon: "Money",
      type: "text",
      value: ({ data }) => String(data.paidRequestsCount),
    },
    {
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
    },
    {
      key: "jobTitle",
      label: "سمت",
      icon: "UserTag",
      type: "text",
      value: ({ data }) => data.jobTitle,
    },
    {
      key: "nationalCode",
      label: "کد ملی",
      icon: "UserSquare",
      type: "text",
      value: ({ data }) => data.nationalCode,
    },
  ];

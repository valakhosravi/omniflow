import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";

export const salaryDeductionHrmoReviewDetailsConfig: DetailRow<any>[] = [
  {
    key: "fullName",
    label: "نام و نام خانوادگی",
    icon: "UserTag",
    type: "text",
    value: ({ data }) => data.fullName || "-",
  },
  {
    key: "jobPositionName",
    label: "سمت شغلی",
    icon: "User",
    type: "text",
    value: ({ data }) => data.jobPositionName || "-",
  },
  {
    key: "personnelId",
    label: "کد پرسنلی",
    icon: "UserSquare",
    type: "text",
    value: ({ data }) => data.personnelId || "-",
  },
  {
    key: "nationalCode",
    label: "کد ملی",
    icon: "Card",
    type: "text",
    value: ({ data }) => data.nationalCode || "-",
  },
  {
    key: "receiverOrganizationName",
    label: "سازمان / اداره هدف",
    icon: "Buildings",
    type: "text",
    value: ({ data }) => data.receiverOrganizationName || "-",
  },
  {
    key: "facilityType",
    label: "نوع تسهیلات",
    icon: "ArrowRight",
    type: "text",
    value: ({ data }) => data.facilityType || "-",
  },
  {
    key: "amount",
    label: "مبلغ تسهیلات",
    icon: "SmsTracking",
    type: "text",
    value: ({ data }) =>
      typeof data.amount === "number"
        ? `${data.amount.toLocaleString("fa-IR")} ریال`
        : "-",
  },
  {
    key: "installmentAmount",
    label: "اقساط ماهانه",
    icon: "SmsTracking",
    type: "text",
    value: ({ data }) =>
      typeof data.installmentAmount === "number"
        ? `${data.installmentAmount.toLocaleString("fa-IR")} ریال`
        : "-",
  },
  {
    key: "installmentCount",
    label: "تعداد اقساط",
    icon: "SmsTracking",
    type: "text",
    value: ({ data }) =>
      typeof data.installmentCount === "number"
        ? data.installmentCount.toLocaleString("fa-IR")
        : "-",
  },
  {
    key: "visibleItems",
    label: "موارد قابل نمایش در نامه",
    icon: "DocumentText",
    type: "text",
    value: ({ data }) =>
      Array.isArray(data.visibleItems) && data.visibleItems.length > 0
        ? data.visibleItems.join(" ، ")
        : "-",
  },
];

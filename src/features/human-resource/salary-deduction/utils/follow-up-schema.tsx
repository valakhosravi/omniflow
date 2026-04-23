import type React from "react";
import { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppIcon } from "@/components/common/AppIcon";
// import type {
//   EmploymentCertificateData,
//   EmploymentCertificateForm,
//   RequestDetailItem,
// } from "../employment-certificate.types";
import type { FormSchema } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { RequestDetailItem } from "@/components/common/AppRequestDetails/AppRequestDetails.type";

export const salaryDeductionDetailsConfig: DetailRow<any>[] = [
  {
    key: "fullName",
    label: "نام و نام خانوادگی متقاضی",
    icon: "UserTag",
    type: "text",
    value: ({ data }) => data.fullName || "",
  },
  {
    key: "jobPositionName",
    label: "سمت شغلی",
    icon: "User",
    type: "text",
    value: ({ data }) => data.jobPositionName || "",
  },
  {
    key: "personnelId",
    label: "کد پرسنلی",
    icon: "UserSquare",
    type: "text",
    value: ({ data }) => data.personnelId || "",
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

export function getEmploymentCertificateFormConfig(
  isTaskApproved: boolean,
): FormSchema<any, any> {
  return {
    defaultValues: { description: "" },
    fields: [
      {
        name: "description",
        type: "textarea",
        label: "توضیحات",
        visibleIf: () => isTaskApproved,
        placeholder: "در صورتی که توضیحاتی دارید در این قسمت وارد کنید.",
        ui: {
          classNames: {
            inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
            input: "text-right dir-rtl",
          },
        },
      },
    ],
  };
}

export function getRequestDetailItems(params: {
  lastRequestStatus:
    | {
        StatusName?: string;
        FullName?: string;
        JobPositionName?: string;
        CreatedDate?: string;
      }
    | null
    | undefined;
  requestData:
    | { PersonnelId?: number; TrackingCode?: number; CreatedDate?: string }
    | null
    | undefined;
  employmentCertificate:
    | { ReceiverOrganizationName?: string; ForReason?: string }
    | null
    | undefined;
}): RequestDetailItem[] {
  const { lastRequestStatus, requestData } = params;
  return [
    {
      id: "status",
      title: "وضعیت درخواست",
      value: lastRequestStatus?.StatusName || "-",
      icon: <AppIcon name="Refresh" size={16} />,
    },
    {
      id: "fullName",
      title: "نام و نام خانوادگی",
      value: lastRequestStatus?.FullName || "-",
      icon: <AppIcon name="User" size={16} />,
    },
    {
      id: "jobPositionName",
      title: "سمت",
      value: lastRequestStatus?.JobPositionName || "-",
      icon: <AppIcon name="Profile2User" size={16} />,
    },
    {
      id: "personnelId",
      title: "کد پرسنلی",
      value: requestData?.PersonnelId ? String(requestData.PersonnelId) : "-",
      icon: <AppIcon name="Card" size={16} />,
    },
  ];
}

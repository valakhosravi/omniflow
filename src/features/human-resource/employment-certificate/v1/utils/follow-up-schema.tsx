import type React from "react";
import { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppIcon } from "@/components/common/AppIcon";
import type {
  EmploymentCertificateData,
  EmploymentCertificateForm,
} from "../employment-certificate.types";
import type { FormSchema } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import EmploymentCertificateVisibleItemsBadges from "../components/EmploymentCertificateVisibleItemsBadges";
import { RequestDetailItem } from "@/components/common/AppRequestDetails/AppRequestDetails.type";

export const employmentCertificateDetailsConfig: DetailRow<EmploymentCertificateData>[] =
  [
    {
      key: "fullName",
      label: "نام و نام خانوادگی",
      icon: "UserTag",
      type: "text",
      value: ({ data }) => data.fullName || "",
    },
    {
      key: "jobPositionName",
      label: "سمت",
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
      key: "receiverOrganizationName",
      label: "سازمان / اداره هدف",
      icon: "Buildings",
      type: "text",
      value: ({ data }) => data.receiverOrganizationName,
    },
    {
      key: "forReason",
      label: "جهت",
      icon: "ArrowRight",
      type: "text",
      value: ({ data }) => data.forReason || "-",
    },
    {
      key: "lang",
      label: "زبان گواهی اشتغال به کار",
      icon: "Global",
      type: "text",
      value: () => "فارسی",
    },
    {
      key: "visibleItems",
      label: "موارد قابل‌نمایش در نامه",
      icon: "Eye",
      type: "text",
      value: ({ data }) => <EmploymentCertificateVisibleItemsBadges data={data} />,
    },
    {
      key: "trackingCode",
      label: "کد پیگیری",
      value: ({ data }) => data.trackingCode || "-",
      icon: "SmsTracking",
      type: "text",
    },
  ];

export function getEmploymentCertificateFormConfig(
  isTaskApproved: boolean,
): FormSchema<EmploymentCertificateForm, EmploymentCertificateData> {
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

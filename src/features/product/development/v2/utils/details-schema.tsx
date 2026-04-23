import React from "react";
import { Chip } from "@heroui/react";
import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { DevelopmentReviewData } from "../development.types";

function PriorityBadge({ name }: { name: string }) {
  const colorClass =
    name === "کم" || name === "پایین"
      ? "text-blue-600 bg-blue-100"
      : name === "متوسط"
        ? "text-yellow-600 bg-yellow-100"
        : name === "بالا"
          ? "text-red-600 bg-red-100"
          : "";
  return (
    <Chip
      className={`!font-medium !text-[12px]/[22px] rounded-[24px] py-[7px] px-[15px] h-[32px] ${colorClass}`}
    >
      {name}
    </Chip>
  );
}

export function createDevelopmentDetailsConfig(): DetailRow<DevelopmentReviewData>[] {
  const base: DetailRow<DevelopmentReviewData>[] = [
    {
      key: "fullName",
      label: "نام و نام خانوادگی",
      icon: "User",
      type: "text",
      value: ({ data }) => data.fullName || "",
    },
    {
      key: "jobTitle",
      label: "سمت",
      icon: "Profile2User",
      type: "text",
      value: ({ data }) => data.jobTitle || "",
    },
    {
      key: "personnelId",
      label: "کد پرسنلی",
      icon: "Card",
      type: "text",
      value: ({ data }) => data.personnelId || "",
    },
    {
      key: "requestTypeName",
      label: "نوع درخواست",
      icon: "Document",
      type: "text",
      value: ({ data }) => data.requestTypeName || "",
    },
    {
      key: "priorityName",
      label: "اولویت",
      icon: "Flag",
      type: "badge",
      value: ({ data }) => <PriorityBadge name={data.priorityName || ""} />,
    },
    {
      key: "requestTitle",
      label: "عنوان درخواست",
      icon: "Subtitle",
      type: "text",
      value: ({ data }) => data.requestTitle || "",
    },
    {
      key: "trackingCode",
      label: "کد پیگیری",
      icon: "SmsTracking",
      type: "text",
      value: ({ data }) => data.trackingCode || "",
    },
    {
      key: "deputyName",
      label: "نام واحد درخواست دهنده",
      icon: "Buildings",
      type: "text",
      value: ({ data }) => data.deputyName || "",
    },
    {
      key: "hasSimilarProcessName",
      label: "آیا فرآیند مشابهی وجود دارد؟",
      icon: "Copy",
      type: "text",
      value: ({ data }) => data.hasSimilarProcessName || "",
    },
    {
      key: "similarProcessDescription",
      label: "توضیحات فرآیند مشابه",
      icon: "User",
      type: "paragraph",
      value: ({ data }) =>
        data.hasSimilarProcess === 1
          ? data.similarProcessDescription || ""
          : "",
    },
    {
      key: "isRegulatoryCompliantName",
      label: "آیا منطبق با الزامات مقرراتی است؟",
      icon: "TickCircle",
      type: "text",
      value: ({ data }) => data.isRegulatoryCompliantName || "",
    },
    {
      key: "regulatoryCompliantDescription",
      label: "توضیحات عدم انطباق با الزامات مقرراتی",
      icon: "User",
      type: "paragraph",
      value: ({ data }) =>
        data.isRegulatoryCompliant === 2
          ? data.regulatoryCompliantDescription || ""
          : "",
    },
    {
      key: "beneficialCustomers",
      label: "مشتریان ذینفع",
      icon: "People",
      type: "text",
      value: ({ data }) => data.beneficialCustomers || "",
    },
    {
      key: "customerUsageDescription",
      label: "توضیحات استفاده مشتری",
      icon: "NoteText",
      type: "paragraph",
      value: ({ data }) => data.customerUsageDescription || "",
    },
    {
      key: "requestedFeatures",
      label: "چه ویژگی‌هایی مد نظر است؟",
      icon: "Setting",
      type: "paragraph",
      value: ({ data }) => data.requestedFeatures || "",
    },
    {
      key: "isReportRequired",
      label: "به گزارشات نیاز است؟",
      icon: "DocumentText",
      type: "text",
      value: ({ data }) => (data.isReportRequired ? "بله" : "خیر"),
    },
    {
      key: "expectedOutput",
      label: "خروجی مورد نظر چیست؟",
      icon: "Export",
      type: "text",
      value: ({ data }) => data.expectedOutput || "",
    },
    {
      key: "technicalDetails",
      label:
        "جزییات فنی مانند یکپارچگی با سیستم‌های دیگر و یا پلتفرم‌ها به چه صورت است؟",
      icon: "Code",
      type: "paragraph",
      value: ({ data }) => data.technicalDetails || "",
    },
    {
      key: "kpi",
      label: "شاخص های اصلی سنجش عملکرد سیستم چیست؟",
      icon: "Chart",
      type: "text",
      value: ({ data }) => data.kpi || "",
    },
    {
      key: "letterNumber",
      label: "شماره نامه های مرتبط (در صورت وجود)",
      icon: "Document",
      type: "text",
      value: ({ data }) => data.letterNumber || "",
    },
    {
      key: "description",
      label: "توضیحات پروژه",
      icon: "NoteText",
      type: "paragraph",
      value: ({ data }) => (
        <div
          dangerouslySetInnerHTML={{
            __html: data.description,
          }}
        />
      ),
    },
    {
      key: "extraDescription",
      label: "توضیحات اضافی پروژه",
      icon: "DocumentText",
      type: "paragraph",
      value: ({ data }) => data.extraDescription || "",
    },
  ];

  return base;
}

export const developmentDetailsConfig = createDevelopmentDetailsConfig();

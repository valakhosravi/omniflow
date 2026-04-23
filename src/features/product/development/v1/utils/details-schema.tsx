import React from "react";
import { Chip } from "@heroui/react";
import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { DevelopmentReviewData } from "../development.types";

function PriorityBadge({ name }: { name: string }) {
  const colorClass =
    name === "کم"
      ? "text-trash bg-accent-400"
      : name === "متوسط"
        ? "text-accent-300 bg-accent-200"
        : name === "بالا"
          ? "text-accent-700 bg-accent-600"
          : "";
  return (
    <Chip
      className={`!font-medium !text-[12px]/[22px] rounded-[24px] py-[7px] px-[15px] h-[32px] ${colorClass}`}
    >
      {name}
    </Chip>
  );
}

export const developmentDetailsConfig: DetailRow<DevelopmentReviewData>[] = [
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
    icon: "User",
    type: "text",
    value: ({ data }) => data.jobTitle || "",
  },
  {
    key: "personnelId",
    label: "کد پرسنلی",
    icon: "UserSquare",
    type: "text",
    value: ({ data }) => data.personnelId || "",
  },
  {
    key: "requestTypeName",
    label: "نوع درخواست",
    icon: "Arrow",
    type: "text",
    value: ({ data }) => data.requestTypeName || "",
  },
  {
    key: "priorityName",
    label: "اولویت",
    icon: "Global",
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
    key: "description",
    label: "توضیحات پروژه",
    icon: "User",
    type: "paragraph",
    value: ({ data }) => data.description || "",
  },
  {
    key: "extraDescription",
    label: "توضیحات اضافی پروژه",
    icon: "User",
    type: "paragraph",
    value: ({ data }) => data.extraDescription || "",
  },
];

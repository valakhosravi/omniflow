import React from "react";
import { Chip } from "@heroui/react";
import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { BugReviewData } from "../Bug.types";

function PriorityBadge({
  label,
  colorClass,
}: {
  label: string;
  colorClass: string;
}) {
  return (
    <Chip
      className={`!font-medium !text-[12px]/[22px] rounded-[24px] py-[7px] px-[15px] h-[32px] ${colorClass}`}
    >
      {label}
    </Chip>
  );
}

export function createBugDetailsConfig(): DetailRow<BugReviewData>[] {
  return [
    {
      key: "title",
      label: "عنوان باگ",
      icon: "Document",
      type: "text",
      value: ({ data }) => data.title || "",
    },
    {
      key: "priority",
      label: "اولویت باگ",
      icon: "Warning2",
      type: "badge",
      value: ({ data }) =>
        data.priorityLabel ? (
          <PriorityBadge
            label={data.priorityLabel}
            colorClass={data.priorityColor}
          />
        ) : (
          ""
        ),
    },
    {
      key: "featureName",
      label: "سامانه",
      icon: "MonitorMobbile",
      type: "text",
      value: ({ data }) => data.featureName || "",
    },
    {
      key: "applicationName",
      label: "جزییات درخواست در سامانه",
      icon: "Global",
      type: "text",
      value: ({ data }) => data.applicationName || "",
    },
    {
      key: "description",
      label: "توضیحات",
      icon: "User",
      type: "paragraph",
      value: ({ data }) => data.description || "",
    },
    {
      key: "link",
      label: "لینک مربوط به مشکل",
      icon: "Link",
      type: "paragraph",
      value: ({ data }) =>
        data.link ? (
          <a href={data.link} target="_blank" rel="noreferrer" className="w-full text-left block">
            <span className="text-primary-800 font-[500] text-[14px] underline">
              {data.link}
            </span>
          </a>
        ) : (
          ""
        ),
    },
  ];
}

export const bugDetailsConfig = createBugDetailsConfig();

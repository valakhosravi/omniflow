import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { BaseReportReviewData } from "../reportV1.types";

/* ─── Shared detail rows used by DG-review & manager-review ────── */

export function createBaseReportReviewDetails<
  T extends BaseReportReviewData,
>(): DetailRow<T>[] {
  return [
    {
      key: "requestTitle",
      label: "عنوان درخواست",
      icon: "DocumentText",
      type: "text",
      value: ({ data }) => data.requestTitle || "-",
    },
    {
      key: "categoryName",
      label: "نوع درخواست",
      icon: "Truck",
      type: "text",
      value: ({ data }) => data.categoryName || "",
    },
    {
      key: "priorityName",
      label: "سطح اولویت",
      icon: "Solana",
      type: "text",
      value: ({ data }) => data.priorityName || "",
    },
    {
      key: "target",
      label: "هدف تجاری",
      icon: "Data",
      type: "text",
      value: ({ data }) => data.target || "-",
    },
    {
      key: "outputFormatName",
      label: "نوع خروجی مورد نیاز",
      icon: "TimerStart",
      type: "text",
      value: ({ data }) => data.outputFormatName || "",
    },
    {
      key: "dataScopeName",
      label: "دامنه داده",
      icon: "Mobile",
      type: "text",
      value: ({ data }) => data.dataScopeName || "",
    },
    {
      key: "kpiName",
      label: "شاخص های دقیق مورد نیاز",
      icon: "Coin",
      type: "text",
      value: ({ data }) => data.kpiName || "",
    },
    {
      key: "filters",
      label: "پارامترها و فیلترهای دقیق",
      icon: "Setting2",
      type: "text",
      value: ({ data }) => data.filters || "-",
    },
    {
      key: "dataAccessName",
      label: "سطح دسترسی",
      icon: "User",
      type: "text",
      value: ({ data }) => data.dataAccessName || "",
    },
    {
      key: "deliveryDate",
      label: "زمان مورد نیاز جهت تحویل",
      icon: "Calendar",
      type: "text",
      value: ({ data }) => data.deliveryDate || "-",
    },
    {
      key: "reportUpdateName",
      label: "دوره آپدیت",
      icon: "TimerStart",
      type: "text",
      value: ({ data }) => data.reportUpdateName || "",
    },
    {
      key: "description",
      label: "توضیحات درخواست کننده",
      icon: "User",
      type: "paragraph",
      value: ({ data }) => data.description || "",
    },
    {
      key: "needToCompare",
      label: "نیازمند مقایسه با دوره های قبل",
      icon: "Chart",
      type: "text",
      value: ({ data }) => (data.needToCompare ? "بله" : "خیر"),
    },
    {
      key: "isAiml",
      label: "نیازمند AI / ML",
      icon: "User",
      type: "text",
      value: ({ data }) => (data.isAiml ? "بله" : "خیر"),
    },
  ];
}

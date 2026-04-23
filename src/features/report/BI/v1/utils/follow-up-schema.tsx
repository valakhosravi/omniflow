import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { ReportFollowUpData } from "../reportV1.types";

/* ---------------------- Details (left panel) ---------------------- */

export const reportFollowUpDetailsConfig: DetailRow<ReportFollowUpData>[] = [
  {
    key: "requestTitle",
    label: "عنوان درخواست",
    icon: "User",
    type: "text",
    value: ({ data }) => data.requestTitle || "",
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
    value: ({ data }) => data.target || "",
  },
  {
    key: "description",
    label: "شرح درخواست",
    icon: "Mobile",
    type: "paragraph",
    value: ({ data }) => data.description || "ندارد",
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
    icon: "SmsTracking",
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
    label: "پارامتر ها و فیلتر های دقیق",
    icon: "Calendar",
    type: "text",
    value: ({ data }) => data.filters || "",
  },
  {
    key: "dataAccessName",
    label: "سطح دسترسی",
    icon: "Calendar",
    type: "text",
    value: ({ data }) => data.dataAccessName || "",
  },
  {
    key: "reportUpdateName",
    label: "دوره آپدیت",
    icon: "Calendar",
    type: "text",
    value: ({ data }) => data.reportUpdateName || "",
  },
  {
    key: "deliveryDate",
    label: "زمان مورد نیاز جهت تحویل",
    icon: "Calendar",
    type: "text",
    value: ({ data }) => data.deliveryDate || "",
  },
  {
    key: "modelLimitationName",
    label: "درخواست مدل سازی",
    icon: "Calendar",
    type: "text",
    value: ({ data }) => data.modelLimitationName || "",
  },
];

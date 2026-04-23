import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { ReportManagerReviewData } from "../reportV1.types";
import { createBaseReportReviewDetails } from "./base-report-details";

/* ---------------------- Details (left panel) ---------------------- */

export const reportManagerReviewDetailsConfig: DetailRow<ReportManagerReviewData>[] =
  createBaseReportReviewDetails<ReportManagerReviewData>();

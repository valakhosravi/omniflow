import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { DGReviewData } from "../reportV1.types";
import { createBaseReportReviewDetails } from "./base-report-details";

/* ---------------------- Details (left panel) ---------------------- */

export const dgReviewDetailsConfig: DetailRow<DGReviewData>[] =
  createBaseReportReviewDetails<DGReviewData>();

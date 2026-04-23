"use client";

import DetailsList from "@/components/common/AppWorkflowPage/components/DetailsList";
import type { SalaryAdvanceFollowUpDetailsProps } from "../salary-advance.types";

export default function SalaryAdvanceFollowUpDetails({
  detailsConfig,
  data,
  isLoading,
}: SalaryAdvanceFollowUpDetailsProps) {
  return (
    <DetailsList
      title="خلاصه درخواست مساعده"
      rows={detailsConfig}
      data={data}
      isLoading={isLoading}
    />
  );
}

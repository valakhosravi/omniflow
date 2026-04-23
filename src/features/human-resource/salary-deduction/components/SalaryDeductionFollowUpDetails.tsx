"use client";

import React from "react";
import DetailsList from "@/components/common/AppWorkflowPage/components/DetailsList";
import { salaryDeductionDetailsConfig } from "../utils/follow-up-schema";

interface salaryDeductionFollowUpDetailsProps {
  data: any;
  isLoading: boolean;
}

export default function salaryDeductionFollowUpDetails({
  data,
  isLoading,
}: salaryDeductionFollowUpDetailsProps) {
  return (
    <DetailsList
      title="خلاصه درخواست"
      rows={salaryDeductionDetailsConfig}
      data={data}
      isLoading={isLoading}
    />
  );
}

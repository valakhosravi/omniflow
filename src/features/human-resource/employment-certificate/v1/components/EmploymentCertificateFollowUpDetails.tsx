"use client";

import React from "react";
import DetailsList from "@/components/common/AppWorkflowPage/components/DetailsList";
import { employmentCertificateDetailsConfig } from "../utils/follow-up-schema";
import type { EmploymentCertificateData } from "../employment-certificate.types";

interface EmploymentCertificateFollowUpDetailsProps {
  data: EmploymentCertificateData;
  isLoading: boolean;
}

export default function EmploymentCertificateFollowUpDetails({
  data,
  isLoading,
}: EmploymentCertificateFollowUpDetailsProps) {
  return (
    <DetailsList
      title="خلاصه درخواست"
      rows={employmentCertificateDetailsConfig}
      data={data}
      isLoading={isLoading}
    />
  );
}

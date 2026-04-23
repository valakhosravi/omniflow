import React from "react";
import EmploymentCertificateFollowUpPageComponent from "@/features/human-resource/employment-certificate/v1/components/EmploymentCertificateFollowUpPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function EmploymentCertificateFollowUpPage() {
  return <EmploymentCertificateFollowUpPageComponent />;
}

export default withPermission(
  EmploymentCertificateFollowUpPage,
  PERMISSION.REQUEST,
);

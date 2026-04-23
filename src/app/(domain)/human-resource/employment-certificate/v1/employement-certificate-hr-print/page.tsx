import React from "react";
import EmploymentCertificateHrPrintPageComponent from "@/features/human-resource/employment-certificate/v1/components/EmploymentCertificateHrPrintPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function EmploymentApplicationPage() {
  return <EmploymentCertificateHrPrintPageComponent />;
}

export default withPermission(EmploymentApplicationPage, PERMISSION.TASK);

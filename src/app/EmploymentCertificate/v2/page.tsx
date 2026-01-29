import EmploymentApplicationPageCmp from "@/packages/features/employment-application/pages/index";
import React from "react";

export const metadata = {
  title: "PECCO | گواهی اشتغال به کار",
  description: "",
};

export default function EmploymentApplicationPage() {
  return (
    <EmploymentApplicationPageCmp
      processName="EmpolymentCertificate"
      version="3"
    />
  );
}

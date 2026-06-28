import React from "react";
import SalaryDeductionFollowUpPageComponent from "@/features/human-resource/salary-deduction/components/SalaryDeductionFollowUpPage";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function SalaryDeductionFollowUpPage() {
  return <SalaryDeductionFollowUpPageComponent />;
}

export default withPermission(
  SalaryDeductionFollowUpPage,
  PERMISSION.REQUEST,
);

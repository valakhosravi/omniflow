import React from "react";
import withPermission, { PERMISSION } from "@/HOC/withPermission";
import SalaryDeductionFollowUpPageComponent from "@/features/human-resource/salary-deduction/components/SalaryDeductionFollowUpPage";

function SalaryDeductionFollowUpPage() {
  return <SalaryDeductionFollowUpPageComponent />;
}

export default withPermission(SalaryDeductionFollowUpPage, PERMISSION.REQUEST);

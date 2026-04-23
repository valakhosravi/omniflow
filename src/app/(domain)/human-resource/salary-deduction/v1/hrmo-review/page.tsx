import React from "react";
import withPermission, { PERMISSION } from "@/HOC/withPermission";
import SalaryDeductionHrmoReviewPageComponent from "@/features/human-resource/salary-deduction/components/SalaryDeductionHrmoReviewPageComponent";

function SalaryDeductionHrmoReviewPage() {
  return <SalaryDeductionHrmoReviewPageComponent />;
}

export default withPermission(SalaryDeductionHrmoReviewPage, PERMISSION.TASK);

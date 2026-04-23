"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useSalaryDeductionHrmoReviewWorkflow } from "@/features/human-resource/salary-deduction/hooks/useSalaryDeductionHrmoReviewWorkflow";
import SalaryDeductionHrmoReviewDetails from "@/features/human-resource/salary-deduction/components/SalaryDeductionHrmoReviewDetails";

function SalaryDeductionHrmoReviewPageComponent() {
  const wf = useSalaryDeductionHrmoReviewWorkflow();

  return (
    <AppWorkflowPage
      title={wf.title}
      actions={wf.actions}
      requestId={wf.requestId}
      isLoading={wf.isInitialDataLoading}
      DetailsComponent={
        <SalaryDeductionHrmoReviewDetails
          data={wf.data}
          isLoading={wf.isInitialDataLoading}
          isTaskApproved={wf.isTaskApproved}
          descriptionRef={wf.descriptionRef}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(SalaryDeductionHrmoReviewPageComponent);

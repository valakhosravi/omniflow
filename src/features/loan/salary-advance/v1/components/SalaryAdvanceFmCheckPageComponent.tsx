"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useSalaryAdvanceFmCheckWorkflow } from "../hooks/useSalaryAdvanceFmCheckWorkflow";
import SalaryAdvanceCheckDetails from "./SalaryAdvanceCheckDetails";

function SalaryAdvanceFmCheckPageComponent() {
  const wf = useSalaryAdvanceFmCheckWorkflow();

  return (
    <AppWorkflowPage
      title={wf.title}
      actions={wf.actions}
      requestId={wf.requestId}
      isLoading={wf.isInitialDataLoading}
      DetailsComponent={
        <SalaryAdvanceCheckDetails
          detailsConfig={wf.detailsConfig}
          data={wf.data}
          isLoading={wf.isInitialDataLoading}
          isTaskClaimed={wf.isTaskClaimed}
          description={wf.description}
          setDescription={wf.setDescription}
          descriptionError={wf.descriptionError}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(SalaryAdvanceFmCheckPageComponent);

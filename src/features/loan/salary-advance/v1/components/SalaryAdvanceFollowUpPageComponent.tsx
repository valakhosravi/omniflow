"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import SalaryAdvanceFollowUpDetails from "./SalaryAdvanceFollowUpDetails";
import { useSalaryAdvanceFollowUpWorkflow } from "../hooks/useSalaryAdvanceFollowUpWorkflow";

function SalaryAdvanceFollowUpPageComponent() {
  const { title, actions, requestId, isInitialDataLoading, data, detailsConfig } =
    useSalaryAdvanceFollowUpWorkflow();

  return (
    <AppWorkflowPage
      title={title}
      actions={actions}
      requestId={requestId}
      isLoading={isInitialDataLoading}
      DetailsComponent={
        <SalaryAdvanceFollowUpDetails
          detailsConfig={detailsConfig}
          data={data}
          isLoading={isInitialDataLoading}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(SalaryAdvanceFollowUpPageComponent);

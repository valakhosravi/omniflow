"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useBugSupportExpertWorkflow } from "../../hooks/useBugSupportExpertWorkflow";
import BugReviewDetails from "../BugReviewDetails";

function BugSupportExpertPageComponent() {
  const wf = useBugSupportExpertWorkflow();

  return (
    <AppWorkflowPage
      title={wf.title}
      actions={wf.actions}
      requestId={wf.requestId}
      isLoading={wf.isInitialDataLoading}
      DetailsComponent={
        <BugReviewDetails
          detailsConfig={wf.detailsConfig}
          data={wf.data}
          isLoading={wf.isInitialDataLoading}
          requestId={wf.data.requestId}
          managerDescription={wf.description}
          setManagerDescription={(val) => {
            if (wf.descriptionError) wf.setDescriptionError(null);
            wf.setDescription(val);
          }}
          descriptionError={wf.descriptionError}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(BugSupportExpertPageComponent);

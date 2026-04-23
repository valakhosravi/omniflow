"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useBugFollowUpWorkflow } from "../hooks/useBugFollowUpWorkflow";
import BugReviewDetails from "./BugReviewDetails";

function BugFollowUpPageComponent() {
  const { title, actions, requestId, isInitialDataLoading, data, detailsConfig } =
    useBugFollowUpWorkflow();

  return (
    <AppWorkflowPage
      title={title}
      actions={actions}
      requestId={requestId}
      isLoading={isInitialDataLoading}
      DetailsComponent={
        <BugReviewDetails
          detailsConfig={detailsConfig}
          data={data}
          isLoading={isInitialDataLoading}
          requestId={data.requestId}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(BugFollowUpPageComponent);

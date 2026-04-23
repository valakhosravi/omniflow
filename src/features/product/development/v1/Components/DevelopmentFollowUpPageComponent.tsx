"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useDevelopmentFollowUpWorkflow } from "../hooks/useDevelopmentFollowUpWorkflow";
import DevelopmentReviewDetails from "./DevelopmentReviewDetails";

function DevelopmentFollowUpPageComponent() {
  const { title, actions, requestId, isInitialDataLoading, data, detailsConfig } =
    useDevelopmentFollowUpWorkflow();

  return (
    <AppWorkflowPage
      title={title}
      actions={actions}
      requestId={requestId}
      isLoading={isInitialDataLoading}
      DetailsComponent={
        <DevelopmentReviewDetails
          detailsConfig={detailsConfig}
          data={data}
          isLoading={isInitialDataLoading}
          requestId={data.requestId}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(DevelopmentFollowUpPageComponent);

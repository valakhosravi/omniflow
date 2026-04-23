"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useDevelopmentSecondSpecialistWorkflow } from "../hooks/useDevelopmentSecondSpecialistWorkflow";
import DevelopmentReviewDetails from "./DevelopmentReviewDetails";

function DevelopmentProductSecondSpecialistPageComponent() {
  const { title, actions, requestId, isInitialDataLoading, data, detailsConfig } =
    useDevelopmentSecondSpecialistWorkflow();

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

export default AppWithTaskInboxSidebar(
  DevelopmentProductSecondSpecialistPageComponent,
);

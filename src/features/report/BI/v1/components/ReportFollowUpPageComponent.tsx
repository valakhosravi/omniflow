"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useReportFollowUpWorkflow } from "../hooks/useReportFollowUpWorkflow";
import ReportReviewDetails from "./ReportReviewDetails";

function ReportFollowUpPageComponent() {
  const { title, actions, requestId, isInitialDataLoading, data, detailsConfig } =
    useReportFollowUpWorkflow();

  return (
    <AppWorkflowPage
      title={title}
      actions={actions}
      requestId={requestId}
      isLoading={isInitialDataLoading}
      DetailsComponent={
        <ReportReviewDetails
          detailsConfig={detailsConfig}
          data={data}
          isLoading={isInitialDataLoading}
          requestId={data.requestId}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(ReportFollowUpPageComponent);

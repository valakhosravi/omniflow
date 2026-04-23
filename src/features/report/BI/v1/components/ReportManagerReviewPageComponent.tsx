"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useReportManagerReviewWorkflow } from "../hooks/useReportManagerReviewWorkflow";
import ReportReviewDetails from "./ReportReviewDetails";

function ReportManagerReviewPageComponent() {
  const {
    title,
    actions,
    requestId,
    isInitialDataLoading,
    data,
    detailsConfig,
    managerDescription,
    setManagerDescription,
  } = useReportManagerReviewWorkflow();

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
          managerDescription={managerDescription}
          setManagerDescription={setManagerDescription}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(ReportManagerReviewPageComponent);

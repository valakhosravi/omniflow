"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useReportDGSpecialistReviewWorkflow } from "../hooks/useReportDGSpecialistReviewWorkflow";
import ReportReviewDetails from "./ReportReviewDetails";

function ReportDataGovernanceSpecialistReviewComponent() {
  const {
    title,
    actions,
    requestId,
    isInitialDataLoading,
    data,
    detailsConfig,
    managerDescription,
    setManagerDescription,
  } = useReportDGSpecialistReviewWorkflow();

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
          managerDescription={managerDescription}
          setManagerDescription={setManagerDescription}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(
  ReportDataGovernanceSpecialistReviewComponent,
);

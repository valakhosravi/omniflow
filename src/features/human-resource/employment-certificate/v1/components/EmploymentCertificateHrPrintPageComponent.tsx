"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useEmploymentCertificateHrPrintWorkflow } from "../hooks/useEmploymentCertificateHrPrintWorkflow";
import EmploymentCertificateHrPrintDetails from "./EmploymentCertificateHrPrintDetails";

function EmploymentCertificateHrPrintPageComponent() {
  const {
    title,
    actions,
    requestId,
    isInitialDataLoading,
    data,
    isTaskApproved,
    descriptionRef,
  } = useEmploymentCertificateHrPrintWorkflow();

  return (
    <AppWorkflowPage
      title={title}
      actions={actions}
      requestId={requestId}
      isLoading={isInitialDataLoading}
      DetailsComponent={
        <EmploymentCertificateHrPrintDetails
          data={data}
          isLoading={isInitialDataLoading}
          isTaskApproved={isTaskApproved}
          descriptionRef={descriptionRef}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(EmploymentCertificateHrPrintPageComponent);

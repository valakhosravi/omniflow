"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useEmploymentCertificateFollowUpWorkflow } from "../hooks/useEmploymentCertificateFollowUpWorkflow";
import EmploymentCertificateFollowUpDetails from "./EmploymentCertificateFollowUpDetails";

function EmploymentCertificateFollowUpPageComponent() {
  const { title, actions, requestId, isInitialDataLoading, data } =
    useEmploymentCertificateFollowUpWorkflow();

  return (
    <AppWorkflowPage
      title={title}
      actions={actions}
      requestId={requestId}
      isLoading={isInitialDataLoading}
      DetailsComponent={
        <EmploymentCertificateFollowUpDetails
          data={data}
          isLoading={isInitialDataLoading}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(EmploymentCertificateFollowUpPageComponent);

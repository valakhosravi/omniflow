"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useDevelopmentPMWorkflow } from "../hooks/useDevelopmentPMWorkflow";
import DevelopmentReviewDetails from "./DevelopmentReviewDetails";
import ReferralModal from "./ReferralModal";
import SubmitJiraTicketModal from "./SubmitJiraTicketModal";

function DevelopmentProductManagerPageComponent() {
  const wf = useDevelopmentPMWorkflow();

  return (
    <>
      <AppWorkflowPage
        title={wf.title}
        actions={wf.actions}
        requestId={wf.requestId}
        isLoading={wf.isInitialDataLoading}
        DetailsComponent={
          <DevelopmentReviewDetails
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

      {wf.openModal === "referral" && (
        <ReferralModal
          isOpen
          onOpenChange={(open) => wf.setOpenModal(open ? "referral" : false)}
        />
      )}

      {wf.openModal === "jira" && (
        <SubmitJiraTicketModal
          isOpen
          onOpenChange={(open) => wf.setOpenModal(open ? "jira" : false)}
          taskId={wf.base.taskId}
          refetch={wf.base.refetchRequestById}
          managerDescription={wf.description}
          setManagerRejectDescriptionError={() => wf.setDescriptionError(null)}
          formKey="development-product-manager-review"
          requestId={wf.data.requestId}
        />
      )}
    </>
  );
}

export default AppWithTaskInboxSidebar(DevelopmentProductManagerPageComponent);

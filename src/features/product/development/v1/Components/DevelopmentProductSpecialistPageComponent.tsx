"use client";

import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useDevelopmentSpecialistWorkflow } from "../hooks/useDevelopmentSpecialistWorkflow";
import DevelopmentReviewDetails from "./DevelopmentReviewDetails";
import SubmitJiraTicketModal from "./SubmitJiraTicketModal";

function DevelopmentProductSpecialistPageComponent() {
  const wf = useDevelopmentSpecialistWorkflow();

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

      {wf.openModal === "jira" && (
        <SubmitJiraTicketModal
          isOpen
          onOpenChange={(open) => wf.setOpenModal(open ? "jira" : false)}
          taskId={wf.base.taskId}
          refetch={wf.base.refetchRequestById}
          managerDescription={wf.description}
          setManagerRejectDescriptionError={() => wf.setDescriptionError(null)}
          formKey="development-product-specialist-review"
          requestId={wf.data.requestId}
        />
      )}
    </>
  );
}

export default AppWithTaskInboxSidebar(
  DevelopmentProductSpecialistPageComponent,
);

"use client";

import AppInput from "@/components/common/AppInput";
import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useSalaryAdvancePreCheckWorkflow } from "../hooks/useSalaryAdvancePreCheckWorkflow";
import SalaryAdvanceCheckDetails from "./SalaryAdvanceCheckDetails";

function SalaryAdvancePreCheckPageComponent() {
  const wf = useSalaryAdvancePreCheckWorkflow();

  return (
    <AppWorkflowPage
      title={wf.title}
      actions={wf.actions}
      requestId={wf.requestId}
      isLoading={wf.isInitialDataLoading}
      DetailsComponent={
        <SalaryAdvanceCheckDetails
          detailsConfig={wf.detailsConfig}
          data={wf.data}
          isLoading={wf.isInitialDataLoading}
          isTaskClaimed={wf.isTaskClaimed}
          description={wf.description}
          setDescription={wf.setDescription}
          descriptionError={wf.descriptionError}
        >
          <div className="mb-4">
            <AppInput
              label="شماره حساب"
              value={wf.ibanNumber.replace("IR", "")}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\s/g, "");
                if (rawValue === "" || /^\d{0,24}$/.test(rawValue)) {
                  wf.setIbanNumber("IR" + rawValue);
                }
              }}
              error={wf.ibanError ?? undefined}
              type="text"
            />
          </div>
        </SalaryAdvanceCheckDetails>
      }
    />
  );
}

export default AppWithTaskInboxSidebar(SalaryAdvancePreCheckPageComponent);

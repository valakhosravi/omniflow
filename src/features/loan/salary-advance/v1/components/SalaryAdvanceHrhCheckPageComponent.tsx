"use client";

import AppInput from "@/components/common/AppInput";
import { AppWorkflowPage } from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { useSalaryAdvanceHrhCheckWorkflow } from "../hooks/useSalaryAdvanceHrhCheckWorkflow";
import SalaryAdvanceCheckDetails from "./SalaryAdvanceCheckDetails";

function SalaryAdvanceHrhCheckPageComponent() {
  const wf = useSalaryAdvanceHrhCheckWorkflow();

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
              label="مبلغ (ریال)"
              value={wf.amount}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                if (rawValue === "" || /^\d+$/.test(rawValue)) {
                  wf.setAmount(formatNumberWithCommas(rawValue));
                }
              }}
              error={wf.amountError ?? undefined}
              placeholder="مبلغ درخواستی را وارد کنید"
              type="text"
            />
          </div>
        </SalaryAdvanceCheckDetails>
      }
    />
  );
}

export default AppWithTaskInboxSidebar(SalaryAdvanceHrhCheckPageComponent);

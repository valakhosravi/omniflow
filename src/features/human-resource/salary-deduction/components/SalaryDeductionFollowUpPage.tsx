"use client";

import {
  ActionButton,
  AppWorkflowPage,
} from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
// import { useSalaryDeductionFollowUpWorkflow } from "../hooks/useSalaryDeductionFollowUpWorkflow";
import SalaryDeductionFollowUpDetails from "./SalaryDeductionFollowUpDetails";
import { useWorkflowBase } from "@/hooks/workflow";
import { useGetRequestByProcessRequestIdQuery } from "../salary-deduction.services";

function SalaryDeductionFollowUpPageComponent() {
  //   const { title, actions, requestId, isInitialDataLoading, data } =
  //     useSalaryDeductionFollowUpWorkflow();
  const title = "درخواست صدور گواهی کسر از حقوق";
  const actions: ActionButton[] = [];
  const base = useWorkflowBase();

  const { data } =
    useGetRequestByProcessRequestIdQuery(
      {
        requestId: base.requestId || "",
        processName: "EmploymentCertificate",
        trackingCode: base.trackingCode,
      },
      {
        skip: !base.requestId || !base.trackingCode,
        refetchOnMountOrArgChange: true,
      },
    );

  return (
    <AppWorkflowPage
      title={title}
      actions={actions}
      requestId={base.requestIdNumber}
      isLoading={base.isInitialDataLoading}
      DetailsComponent={
        <SalaryDeductionFollowUpDetails
          data={data}
          isLoading={base.isInitialDataLoading}
        />
      }
    />
  );
}

export default AppWithTaskInboxSidebar(SalaryDeductionFollowUpPageComponent);

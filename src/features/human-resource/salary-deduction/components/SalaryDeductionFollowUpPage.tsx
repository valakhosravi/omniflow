"use client";

import {
  ActionButton,
  AppWorkflowPage,
} from "@/components/common/AppWorkflowPage";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import SalaryDeductionFollowUpDetails from "./SalaryDeductionFollowUpDetails";
import { useCancelWorkflow, useWorkflowBase } from "@/hooks/workflow";
import { useGetRequestByProcessRequestIdQuery } from "../salary-deduction.services";
import { useDisclosure } from "@heroui/react";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";

function SalaryDeductionFollowUpPageComponent() {
  const title = "درخواست صدور گواهی کسر از حقوق / ضمانت";
  const base = useWorkflowBase();

  const { data } =
    useGetRequestByProcessRequestIdQuery(
      {
        requestId: base.requestId || "",
        processName: "SalaryDeduction",
        trackingCode: base.trackingCode,
      },
      {
        skip: !base.requestId || !base.trackingCode,
        refetchOnMountOrArgChange: true,
      },
    );

  const canCancel =
    base.lastRequestStatusResult?.Data?.CanBeCanceled ?? false;
  const { onConfirmCancel, isSendingMessage } = useCancelWorkflow({
    requestId: base.requestId,
    instanceId: base.requestData?.Data?.InstanceId || "",
    trackingCode: base.trackingCode,
    messageName: "Salary-Deduction-Request-Terminate",
    processName: "SalaryDeduction",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const actions: ActionButton[] = [
    {
      id: "cancel-request",
      label: "لغو درخواست",
      variant: "outline",
      color: "danger",
      hidden: base.isInitialDataLoading || !canCancel,
      onPress: onOpen,
      modalConfig: {
        title: "تایید لغو درخواست",
        isOpen,
        onClose: onOpenChange,
        content: (close) => (
          <AppConfirmModalContent
            message="این عمل قابل بازگشت نیست."
            onClose={close}
            onConfirm={() => onConfirmCancel()}
            isSubmitting={isSendingMessage}
            confirmLabel="تایید لغو درخواست"
            submittingLabel="در حال لغو..."
          />
        ),
      },
    },
  ];

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

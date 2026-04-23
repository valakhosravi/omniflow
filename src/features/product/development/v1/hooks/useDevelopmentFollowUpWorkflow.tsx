"use client";

import { useDisclosure } from "@heroui/react";
import { useCancelWorkflow, defineWorkflowHook } from "@/hooks/workflow";
import { useDevelopmentWorkflowBase } from "./useDevelopmentWorkflowBase";
import { useDevelopmentReviewData } from "./useDevelopmentReviewData";
import { developmentDetailsConfig } from "../utils/details-schema";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { DevelopmentReviewData } from "../development.types";

export const useDevelopmentFollowUpWorkflow =
  defineWorkflowHook<DevelopmentReviewData>()(() => {
    const base = useDevelopmentWorkflowBase();
    const data = useDevelopmentReviewData(base);

    const canCancel = base.requestStatus?.Data?.CanBeCanceled ?? false;

    const { onConfirmCancel, isSendingMessage } = useCancelWorkflow({
      requestId: base.requestId,
      instanceId: base.developmentTicket?.Data?.InstanceId || "",
      trackingCode: base.trackingCode,
      messageName: "Development-Terminate-Request-Message",
      processName: "Development",
    });

    const {
      isOpen: isCancelOpen,
      onOpen: onCancelOpen,
      onOpenChange: onCancelOpenChange,
      onClose: onCancelClose,
    } = useDisclosure();

    const actions: ActionButton[] = [
      {
        id: "cancel-request",
        label: "لغو درخواست",
        variant: "contained",
        color: "primary",
        hidden: base.isInitialDataLoading,
        disabled: !canCancel,
        onPress: onCancelOpen,
        modalConfig: {
          title: "تایید لغو درخواست",
          isOpen: isCancelOpen,
          onClose: () => onCancelOpenChange(),
          content: (
            <AppConfirmModalContent
              message="این عمل قابل بازگشت نیست."
              onClose={() => onCancelClose()}
              onConfirm={() => onConfirmCancel()}
              isSubmitting={isSendingMessage}
              confirmLabel="تایید لغو درخواست"
              submittingLabel="در حال لغو..."
            />
          ),
        },
      },
    ];

    return {
      title: "درخواست تیکت توسعه",
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: developmentDetailsConfig,
    };
  });

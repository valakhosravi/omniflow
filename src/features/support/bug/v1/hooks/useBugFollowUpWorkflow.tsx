"use client";

import { useDisclosure } from "@heroui/react";
import { useCancelWorkflow, defineWorkflowHook } from "@/hooks/workflow";
import { useBugWorkflowBase } from "./useBugWorkflowBase";
import { useBugReviewData } from "./useBugReviewData";
import { bugDetailsConfig } from "../utils/details-schema";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { BugReviewData } from "../Bug.types";

export const useBugFollowUpWorkflow =
  defineWorkflowHook<BugReviewData>()(() => {
    const base = useBugWorkflowBase();
    const data = useBugReviewData(base);

    const canCancel = base.requestStatus?.Data?.CanBeCanceled ?? false;

    const { onConfirmCancel, isSendingMessage } = useCancelWorkflow({
      requestId: base.requestId,
      instanceId: base.requestData?.Data?.InstanceId || "",
      trackingCode: base.trackingCode,
      messageName: "Bug-Terminate-Request-Message",
      processName: "Bug",
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
      title: "درخواست رفع باگ",
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: bugDetailsConfig,
      canCancel,
    };
  });

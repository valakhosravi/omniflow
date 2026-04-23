"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSendMessageMutation } from "@/packages/camunda";
import { useUpdateIsReadByRequestIdMutation } from "@/services/commonApi/commonApi";
import { addToaster } from "@/ui/Toaster";

/**
 * Shared cancel-request logic used by follow-up workflow pages.
 *
 * Marks the request as read, sends a Camunda termination message,
 * then navigates to /task-inbox/requests on success.
 */
export function useCancelWorkflow(opts: {
  requestId: string | null | undefined;
  instanceId: string;
  trackingCode: string;
  messageName: string;
  processName: string;
}) {
  const router = useRouter();
  const [updateIsRead] = useUpdateIsReadByRequestIdMutation();
  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  const onConfirmCancel = useCallback(() => {
    if (!opts.requestId) return;

    updateIsRead(opts.requestId)
      .then(() => {
        sendMessage({
          body: {
            messageName: opts.messageName,
            processInstanceId: opts.instanceId,
          },
          processName: opts.processName,
          trackingCode: opts.trackingCode,
        })
          .unwrap()
          .then(() => {
            addToaster({
              color: "success",
              title: "درخواست با موفقیت لغو شد",
            });
            router.push("/task-inbox/requests");
          })
          .catch((error: { message?: string }) => {
            addToaster({
              color: "danger",
              title: error?.message || "خطا در لغو درخواست",
            });
          });
      })
      .catch((err) => {
        addToaster({
          color: "danger",
          title:
            err.message || "خطا در به روزرسانی پیام های خوانده شده",
        });
      });
  }, [
    opts.requestId,
    opts.messageName,
    opts.instanceId,
    opts.processName,
    opts.trackingCode,
    updateIsRead,
    sendMessage,
    router,
  ]);

  return { onConfirmCancel, isSendingMessage };
}

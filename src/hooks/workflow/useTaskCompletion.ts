"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCamunda } from "@/packages/camunda";
import { addToaster } from "@/ui/Toaster";

/**
 * Shared hook that wraps Camunda task-completion with
 * consistent error handling, success callback, and navigation.
 */
export function useTaskCompletion(opts: {
  taskId: string | null | undefined;
  processName?: string;
  trackingCode?: string;
  onSuccess?: () => void;
  /** Where to redirect after success. Defaults to "/task-inbox?tab=mytask". Set to `false` to disable redirect. */
  redirectTo?: string | false;
}) {
  const router = useRouter();
  const {
    completeTaskWithPayload,
    claimTaskWithPayload,
    isCompletingTask,
    isClaimingTask,
  } = useCamunda();

  const completeTask = useCallback(
    async (payload: Record<string, unknown>) => {
      if (!opts.taskId) {
        addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
        return;
      }
      try {
        await completeTaskWithPayload(
          opts.taskId,
          payload,
          opts.processName,
          opts.trackingCode,
        );
        opts.onSuccess?.();
        if (opts.redirectTo !== false) {
          router.replace(opts.redirectTo ?? "/task-inbox?tab=mytask");
        }
      } catch (error: unknown) {
        const message =
          (error as { data?: { message?: string } })?.data?.message ??
          (error as { message?: string })?.message;
        addToaster({
          color: "danger",
          title: message || "خطا در تکمیل وظیفه",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      opts.taskId,
      opts.processName,
      opts.trackingCode,
      opts.onSuccess,
      opts.redirectTo,
      completeTaskWithPayload,
      router,
    ],
  );

  const claimTask = useCallback(
    async (userId: string, extra?: { requestId?: number }) => {
      if (!opts.taskId) {
        addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
        return;
      }
      try {
        await claimTaskWithPayload(opts.taskId, { userId }, extra);
      } catch (error: unknown) {
        const err = error as { message?: string };
        addToaster({
          color: "danger",
          title: err?.message || "خطا در دریافت وظیفه",
        });
      }
    },
    [opts.taskId, claimTaskWithPayload],
  );

  return { completeTask, claimTask, isCompletingTask, isClaimingTask };
}

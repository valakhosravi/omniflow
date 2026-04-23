"use client";

import { useCallback, useState } from "react";
import { useTaskCompletion, defineWorkflowHook } from "@/hooks/workflow";
import { useBugWorkflowBase } from "./useBugWorkflowBase";
import { useBugReviewData } from "./useBugReviewData";
import { bugDetailsConfig } from "../utils/details-schema";
import { createPayload } from "../Bug.utils";
import { BugFixPagesTypes, UserReviewEnum } from "../Bug.types";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { BugReviewData, BugFixFormData } from "../Bug.types";

export const useBugUserVerifyWorkflow =
  defineWorkflowHook<BugReviewData>()(() => {
    const base = useBugWorkflowBase();
    const data = useBugReviewData(base);

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState<string | null>(null);

    const { completeTask, isCompletingTask } = useTaskCompletion({
      taskId: base.taskId,
      processName: "Bug",
      trackingCode: base.trackingCode,
    });

    const requireDescription = useCallback(
      (msg: string) => {
        if (!description || description.trim().length === 0) {
          setDescriptionError(msg);
          return false;
        }
        return true;
      },
      [description],
    );

    const buildFormData = useCallback(
      (action: UserReviewEnum): BugFixFormData => ({
        bugFixAction: action,
        selectValue: { id: 0 },
        additionalDescription: description,
      }),
      [description],
    );

    const onApprove = useCallback(() => {
      const payload = createPayload({
        pageType: BugFixPagesTypes.USER_VERIFY,
        data: buildFormData(UserReviewEnum.FIXED),
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [buildFormData, completeTask]);

    const onReject = useCallback(() => {
      if (!requireDescription("توضیحات الزامیست")) return;
      const payload = createPayload({
        pageType: BugFixPagesTypes.USER_VERIFY,
        data: buildFormData(UserReviewEnum.NOT_FIXED),
      });
      completeTask(payload as unknown as Record<string, unknown>);
    }, [requireDescription, buildFormData, completeTask]);

    const actions: ActionButton[] = [
      {
        id: "reject",
        label: "باگ برطرف نشد",
        variant: "contained",
        color: "danger",
        onPress: onReject,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
      },
      {
        id: "approve",
        label: "باگ برطرف شد",
        variant: "contained",
        color: "primary",
        onPress: onApprove,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
      },
    ];

    return {
      title: "درخواست رفع باگ",
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: bugDetailsConfig,
      description,
      setDescription,
      descriptionError,
      setDescriptionError,
    };
  });

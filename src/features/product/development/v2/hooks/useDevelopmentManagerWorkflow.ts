"use client";

import { useCallback, useMemo, useState } from "react";
import { useGetTaskByIdQuery } from "@/packages/camunda";
import { useTaskCompletion, defineWorkflowHook } from "@/hooks/workflow";
import { addToaster } from "@/ui/Toaster";
import { useDevelopmentWorkflowBase } from "./useDevelopmentWorkflowBase";
import { useDevelopmentReviewData } from "./useDevelopmentReviewData";
import { developmentDetailsConfig } from "../utils/details-schema";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { DevelopmentReviewData } from "../development.types";

export const useDevelopmentManagerWorkflow =
  defineWorkflowHook<DevelopmentReviewData>()(() => {
    const base = useDevelopmentWorkflowBase();
    const data = useDevelopmentReviewData(base);

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState<string | null>(
      null,
    );

    const { data: taskData } = useGetTaskByIdQuery(base.taskId || "", {
      skip: !base.taskId,
    });

    const isTaskClaimed = useMemo(
      () => Boolean(taskData?.assignee),
      [taskData],
    );

    const { completeTask, isCompletingTask } = useTaskCompletion({
      taskId: base.taskId,
      processName: "Development",
      trackingCode: base.trackingCode,
    });

    const requireClaim = useCallback(() => {
      if (!isTaskClaimed) {
        addToaster({
          color: "warning",
          title: "ابتدا باید وظیفه را دریافت کنید",
        });
        return false;
      }
      return true;
    }, [isTaskClaimed]);

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

    const onReject = useCallback(() => {
      if (!requireClaim()) return;
      if (!requireDescription("توضیحات رد درخواست را وارد کنید")) return;
      completeTask({
        ManagerApprove: false,
        ManagerDescription: description,
        ManagerEdit: false,
        DevelopId: Number(base.developmentData?.Data?.RequestId),
      });
    }, [requireClaim, requireDescription, completeTask, description, base.developmentData]);

    const onApprove = useCallback(() => {
      if (!requireClaim()) return;
      completeTask({
        ManagerApprove: true,
        ManagerDescription: description,
        ManagerEdit: false,
        DevelopId: Number(base.developmentData?.Data?.RequestId),
      });
    }, [requireClaim, completeTask, description, base.developmentData]);

    const onEditNeeded = useCallback(() => {
      if (!requireClaim()) return;
      if (!requireDescription("توضیحات رد درخواست را وارد کنید")) return;
      completeTask({
        ManagerApprove: false,
        ManagerDescription: description,
        ManagerEdit: true,
        DevelopId: Number(base.developmentData?.Data?.RequestId),
      });
    }, [requireClaim, requireDescription, completeTask, description, base.developmentData]);

    const actions: ActionButton[] = [
      {
        id: "need-edit",
        label: "نیازمند اقدام درخواست‌دهنده",
        variant: "outline",
        onPress: onEditNeeded,
        hidden: base.isInitialDataLoading,
      },
      {
        id: "reject",
        label: "رد درخواست",
        variant: "contained",
        color: "danger",
        onPress: onReject,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
      },
      {
        id: "approve",
        label: "تایید درخواست",
        variant: "contained",
        color: "primary",
        onPress: onApprove,
        loading: isCompletingTask,
        hidden: base.isInitialDataLoading,
      },
    ];

    return {
      title: "درخواست تیکت توسعه",
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: developmentDetailsConfig,
      description,
      setDescription,
      descriptionError,
      setDescriptionError,
    };
  });

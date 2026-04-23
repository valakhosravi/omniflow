"use client";

import { useCallback, useMemo, useState } from "react";
import { useGetTaskByIdQuery } from "@/packages/camunda";
import { useTaskCompletion, defineWorkflowHook } from "@/hooks/workflow";
import { useAuth } from "@/packages/auth/hooks/useAuth";
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
    const { userDetail } = useAuth();

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

    const { completeTask, claimTask, isCompletingTask, isClaimingTask } =
      useTaskCompletion({
        taskId: base.taskId,
      });

    const handleClaimTask = useCallback(() => {
      claimTask(String(Number(userDetail?.UserDetail.PersonnelId)), {
        requestId: base.requestIdNumber,
      });
    }, [claimTask, userDetail?.UserDetail.PersonnelId, base.requestIdNumber]);

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
      });
    }, [requireClaim, requireDescription, completeTask, description]);

    const onApprove = useCallback(() => {
      if (!requireClaim()) return;
      completeTask({
        ManagerApprove: true,
        ManagerDescription: description,
        ManagerEdit: false,
      });
    }, [requireClaim, completeTask, description]);

    const onEditNeeded = useCallback(() => {
      if (!requireClaim()) return;
      if (
        !requireDescription(
          "توضیحات نیازمند اقدام درخواست دهنده را وارد کنید",
        )
      )
        return;
      completeTask({
        ManagerApprove: false,
        ManagerDescription: description,
        ManagerEdit: true,
      });
    }, [requireClaim, requireDescription, completeTask, description]);

    const actions: ActionButton[] = isTaskClaimed
      ? [
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
        ]
      : [
          {
            id: "claim-task",
            label: "دریافت وظیفه",
            variant: "contained",
            color: "primary",
            onPress: handleClaimTask,
            loading: isClaimingTask,
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
      isTaskClaimed,
    };
  });

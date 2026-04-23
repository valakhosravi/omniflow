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

export const useDevelopmentSpecialistWorkflow =
  defineWorkflowHook<DevelopmentReviewData>()(() => {
    const base = useDevelopmentWorkflowBase();
    const data = useDevelopmentReviewData(base);

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState<string | null>(
      null,
    );

    const [openModal, setOpenModal] = useState<"jira" | false>(false);

    const { data: taskData } = useGetTaskByIdQuery(base.taskId || "", {
      skip: !base.taskId,
    });

    const isTaskClaimed = useMemo(
      () => Boolean(taskData?.assignee),
      [taskData],
    );

    const { completeTask, isCompletingTask } = useTaskCompletion({
      taskId: base.taskId,
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
        PeApprove: false,
        PeDescription: description,
        PeEdit: false,
        Summary: "",
        JiraDescription: "",
        StackHolder: "",
      });
    }, [requireClaim, requireDescription, completeTask, description]);

    const onEditNeeded = useCallback(() => {
      if (!requireClaim()) return;
      if (
        !requireDescription(
          "توضیحات نیازمند اقدام درخواست دهنده را وارد کنید",
        )
      )
        return;
      completeTask({
        PeApprove: false,
        PeDescription: description,
        PeEdit: true,
        Summary: "",
        JiraDescription: "",
        StackHolder: "",
      });
    }, [requireClaim, requireDescription, completeTask, description]);

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
        onPress: () => setOpenModal("jira"),
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
      openModal,
      setOpenModal,
      base,
    };
  });

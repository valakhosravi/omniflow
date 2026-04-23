"use client";

import { defineWorkflowHook } from "@/hooks/workflow";
import { useDevelopmentWorkflowBase } from "./useDevelopmentWorkflowBase";
import { useDevelopmentReviewData } from "./useDevelopmentReviewData";
import { developmentDetailsConfig } from "../utils/details-schema";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import type { DevelopmentReviewData } from "../development.types";

export const useDevelopmentSecondSpecialistWorkflow =
  defineWorkflowHook<DevelopmentReviewData>()(() => {
    const base = useDevelopmentWorkflowBase();
    const data = useDevelopmentReviewData(base);

    const actions: ActionButton[] = [];

    return {
      title: "درخواست تیکت توسعه",
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: developmentDetailsConfig,
    };
  });

/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useMemo, useRef } from "react";
import { useGetTaskByIdQuery } from "@/packages/camunda";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { addToaster } from "@/ui/Toaster";
import {
  defineWorkflowHook,
  useTaskCompletion,
  useWorkflowBase,
} from "@/hooks/workflow";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { useGetRequestByProcessRequestIdQuery } from "../salary-deduction.services";
import { salaryDeductionHrmoReviewDetailsConfig } from "../utils/hrmo-review-schema";
import { buildSalaryDeductionPrintHtml } from "../utils/hrmo-review-helpers";
import { toPersianDateOnly } from "@/utils/dateFormatter";

type SalaryDeductionReviewData = {
  fullName: string;
  fatherName: string;
  jobPositionName: string;
  personnelId: string;
  nationalCode: string;
  receiverOrganizationName: string;
  facilityType: string;
  amount: number;
  installmentAmount: number;
  installmentCount: number;
  guaranteeFullName: string;
  visibleItems: string[];
  trackingCode: string;
  createdDate: string;
};

export const useSalaryDeductionHrmoReviewWorkflow =
  defineWorkflowHook<SalaryDeductionReviewData>()(() => {
    const base = useWorkflowBase();
    const { user } = useAuth();
    const descriptionRef = useRef("");

    const { data: taskData, refetch: refetchTaskData } = useGetTaskByIdQuery(
      base.taskId || "",
      {
        skip: !base.taskId,
      },
    );

    const { data: requestResult } = useGetRequestByProcessRequestIdQuery(
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

    const isTaskAlreadyClaimed = useMemo(
      () => taskData?.assignee != null,
      [taskData],
    );

    const isTaskApproved = useMemo(
      () => base.requestData?.Data?.StatusCode !== 102,
      [base.requestData],
    );

    const { completeTask, claimTask, isClaimingTask, isCompletingTask } =
      useTaskCompletion({
        taskId: base.taskId,
        processName: "SalaryDeduction",
        redirectTo: false,
        onSuccess: () => {
          base.refetchLastRequestStatus();
          base.refetchRequestById();
          refetchTaskData();
        },
      });

    const handleClaimTask = useCallback(async () => {
      if (!user?.PersonnelId) {
        addToaster({
          color: "danger",
          title: "اطلاعات کاربر برای دریافت وظیفه در دسترس نیست",
        });
        return;
      }

      await claimTask(String(Number(user.PersonnelId)), {
        requestId: base.requestIdNumber,
      });
      refetchTaskData();
    }, [user?.PersonnelId, claimTask, base.requestIdNumber, refetchTaskData]);

    const onReject = useCallback(async () => {
      if (!descriptionRef.current?.trim()) {
        addToaster({
          color: "danger",
          title: "توضیحات رد درخواست را وارد کنید",
        });
        return;
      }

      await completeTask({
        HRMOApprove: false,
        HRMODescription: descriptionRef.current.trim(),
      });
    }, [completeTask]);

    const onApprove = useCallback(async () => {
      await completeTask({
        HRMOApprove: true,
        HRMODescription: descriptionRef.current?.trim() || "",
      });
    }, [completeTask]);

    const onOpenPrintableDoc = useCallback(() => {
      const request = requestResult?.Data;
      if (!request) {
        addToaster({ color: "danger", title: "اطلاعات درخواست یافت نشد" });
        return;
      }

      const html = buildSalaryDeductionPrintHtml({
        fullName: request.FullName || "",
        fatherName: "",
        nationalCode: request.NationalCode || "",
        personnelId: String(base.requestData?.Data?.PersonnelId || ""),
        trackingCode: base.trackingCode || "",
        createdDate: toPersianDateOnly(request.CreatedDate),
        guaranteeFullName: request.GuaranteedFullName || "",
        amount: Number(request.Amount || 0).toLocaleString("fa-IR"),
        installmentAmount: Number(request.InstallmentAmount || 0).toLocaleString(
          "fa-IR",
        ),
      });

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        addToaster({
          color: "warning",
          title: "مرورگر اجازه باز شدن پنجره چاپ را نداد",
        });
        return;
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    }, [requestResult?.Data, base.requestData?.Data, base.trackingCode]);

    const data = useMemo<SalaryDeductionReviewData>(() => {
      const request = requestResult?.Data;

      return {
        fullName: request?.FullName || "",
        fatherName: "",
        jobPositionName: request?.JobPosition || request?.Title || "",
        personnelId: base.requestData?.Data?.PersonnelId
          ? String(base.requestData.Data.PersonnelId)
          : "",
        nationalCode: request?.NationalCode || "",
        receiverOrganizationName: request?.BankName || "",
        facilityType: request?.IsGuarantee ? "ضمانت" : "تسهیلات عادی",
        amount: request?.Amount || 0,
        installmentAmount: request?.InstallmentAmount || 0,
        installmentCount: request?.InstallmentCount || 0,
        guaranteeFullName: request?.GuaranteedFullName || "",
        visibleItems: [
          request?.HasJobPosition ? "سمت شغلی" : null,
          request?.HasEmploymentStartDate ? "تاریخ استخدام" : null,
          request?.HasPhoneNumber ? "شماره تماس" : null,
        ].filter(Boolean) as string[],
        trackingCode: base.trackingCode,
        createdDate: request?.CreatedDate || "",
      };
    }, [requestResult?.Data, base.trackingCode]);

    const actions: ActionButton[] = [
      {
        id: "print-doc",
        label: "مشاهده / چاپ سند",
        variant: "outline",
        color: "primary",
        icon: "DocumentText",
        hidden: base.isInitialDataLoading,
        onPress: onOpenPrintableDoc,
      },
      {
        id: "claim",
        label: isClaimingTask ? "در حال دریافت وظیفه..." : "دریافت وظیفه",
        variant: "contained",
        color: "primary",
        icon: "Refresh",
        hidden: base.isInitialDataLoading || isTaskAlreadyClaimed || !isTaskApproved,
        disabled: isClaimingTask,
        onPress: async () => handleClaimTask(),
      },
      {
        id: "reject",
        label: "رد درخواست",
        variant: "outline",
        color: "danger",
        hidden: base.isInitialDataLoading || !isTaskAlreadyClaimed || !isTaskApproved,
        onPress: async () => onReject(),
      },
      {
        id: "approve",
        label: "تایید درخواست",
        variant: "contained",
        color: "primary",
        hidden: base.isInitialDataLoading || !isTaskAlreadyClaimed || !isTaskApproved,
        disabled: isCompletingTask,
        onPress: async () => onApprove(),
      },
    ];

    const title = "بررسی درخواست صدور گواهی کسر از حقوق / ضمانت";

    return {
      title,
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      detailsConfig: salaryDeductionHrmoReviewDetailsConfig,
      isTaskApproved,
      descriptionRef,
    };
  });

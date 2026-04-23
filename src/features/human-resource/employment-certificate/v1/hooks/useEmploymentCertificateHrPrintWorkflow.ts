/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useGetEmploymentCertificateByRequestIdQuery } from "@/features/human-resource/employment-certificate/v1/employment-certificate.services";
import { useGetTaskByIdQuery } from "@/packages/camunda";
import { addToaster } from "@/ui/Toaster";
import {
  useWorkflowBase,
  useTaskCompletion,
  defineWorkflowHook,
} from "@/hooks/workflow";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import {
  buildCertificateDisplayData,
  buildTaskPayload,
} from "../utils/hr-print-helpers";
import { setCertificateDisplayData } from "../employment-certificate.slice";
import type {
  EmploymentCertificateData,
  VisibleItem,
} from "../employment-certificate.types";
import { useLazyGetEmployeeInfoByPersonnelIdQuery } from "@/services/commonApi/commonApi";

export const useEmploymentCertificateHrPrintWorkflow =
  defineWorkflowHook<EmploymentCertificateData>()(() => {
    const dispatch = useDispatch();
    const base = useWorkflowBase();
    const {
      lastRequestStatusResult,
      refetchLastRequestStatus: refetchGetLastRequestStatus,
    } = base;

    /** Ref for the description textarea — written by DetailsComponent, read by actions at press time. */
    const descriptionRef = useRef("");

    const {
      data: taskData,
      refetch: getTaskByIdRefetch,
      isLoading: isTaskDataLoading,
    } = useGetTaskByIdQuery(base.taskId || "", {
      skip: !base.taskId,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    });

    const { data: employmentCertificateResult } =
      useGetEmploymentCertificateByRequestIdQuery(
        {
          requestId: base.requestId || "",
          processName: "EmploymentCertificate",
          trackingCode: base.trackingCode,
        },
        {
          skip: !base.requestId || !base.trackingCode,
          refetchOnMountOrArgChange: true,
        },
      );

    const [getEmployeeInfoByPersonnelId, { data: employeeInfoResult }] =
      useLazyGetEmployeeInfoByPersonnelIdQuery();

    const personnelId = base.requestData?.Data?.PersonnelId;

    useEffect(() => {
      if (personnelId) {
        getEmployeeInfoByPersonnelId(personnelId);
      }
    }, [personnelId, getEmployeeInfoByPersonnelId]);

    const isTaskAlreadyClaimed = useMemo(
      () => taskData?.assignee != null,
      [taskData],
    );

    const isTaskApproved = useMemo(
      () => base.requestData?.Data?.StatusCode !== 102,
      [base.requestData],
    );

    const isInitialDataLoading = useMemo(
      () =>
        (!!base.taskId && isTaskDataLoading) ||
        (!!base.requestId && base.isRequestDataLoading),
      [
        base.taskId,
        base.requestId,
        isTaskDataLoading,
        base.isRequestDataLoading,
      ],
    );

    /* ---- Task completion (approve / reject) ---- */

    const { completeTask, claimTask, isCompletingTask, isClaimingTask } =
      useTaskCompletion({
        taskId: base.taskId,
        processName: "EmploymentCertificate",
        redirectTo: false,
        onSuccess: () => {
          refetchGetLastRequestStatus();
          base.refetchRequestById();
        },
      });

    const handleClaimTask = useCallback(async () => {
      await claimTask(String(Number(employeeInfoResult?.Data?.PersonnelId)), {
        requestId: base.requestIdNumber,
      });
      getTaskByIdRefetch();
    }, [
      claimTask,
      employeeInfoResult?.Data?.PersonnelId,
      base.requestIdNumber,
      getTaskByIdRefetch,
    ]);

    const onReject = useCallback(
      async (description: string) => {
        if (!base.taskId) return;

        if (!isTaskAlreadyClaimed) {
          addToaster({
            color: "warning",
            title: "ابتدا باید وظیفه را دریافت کنید",
          });
          return;
        }

        if (!description?.trim()) {
          addToaster({
            color: "danger",
            title: "توضیحات رد درخواست را وارد کنید",
          });
          return;
        }

        try {
          const payload = buildTaskPayload(
            employmentCertificateResult?.Data,
            employeeInfoResult?.Data,
            { hrApprove: false, description: description.trim() },
          );
          await completeTask(payload);

          addToaster({
            color: "success",
            title: "درخواست با موفقیت رد شد",
          });
        } catch (err: unknown) {
          const e = err as { message?: string };
          addToaster({
            color: "danger",
            title: e?.message || "خطا در رد درخواست",
          });
        }
      },
      [
        base.taskId,
        isTaskAlreadyClaimed,
        employmentCertificateResult?.Data,
        employeeInfoResult?.Data,
        completeTask,
      ],
    );

    const onApprove = useCallback(
      async (description: string) => {
        if (!base.taskId) return;

        if (!isTaskAlreadyClaimed) {
          addToaster({
            color: "warning",
            title: "ابتدا باید وظیفه را دریافت کنید",
          });
          return;
        }

        try {
          const payload = buildTaskPayload(
            employmentCertificateResult?.Data,
            employeeInfoResult?.Data,
            { hrApprove: true, description: description?.trim() || "" },
          );
          await completeTask(payload);

          addToaster({
            color: "success",
            title: "درخواست با موفقیت تایید شد",
          });
        } catch (err: unknown) {
          const e = err as { message?: string };
          addToaster({
            color: "danger",
            title: e?.message || "خطا در تایید درخواست",
          });
        }
      },
      [
        base.taskId,
        isTaskAlreadyClaimed,
        employmentCertificateResult?.Data,
        employeeInfoResult?.Data,
        completeTask,
      ],
    );

    const onDownloadPDF = useCallback(() => {
      const employeeData = employeeInfoResult?.Data;
      const certData = employmentCertificateResult?.Data;

      if (!employeeData || !certData) {
        addToaster({ color: "danger", title: "اطلاعات کاربر یافت نشد" });
        return;
      }

      try {
        const data = buildCertificateDisplayData(
          employeeData,
          certData,
          lastRequestStatusResult?.Data,
          base.requestData?.Data,
        );
        dispatch(setCertificateDisplayData(data));
        window.open(
          "/human-resource/employment-certificate/v1/certificate-display",
          "_blank",
        );
      } catch (error) {
        console.error("Error opening certificate:", error);
        addToaster({ color: "danger", title: "خطا در باز کردن گواهی" });
      }
    }, [
      dispatch,
      employeeInfoResult?.Data,
      employmentCertificateResult?.Data,
      lastRequestStatusResult?.Data,
      base.requestData?.Data,
    ]);

    /* ---- Actions ---- */

    const actions = useMemo<ActionButton[]>(
      () => [
        {
          id: "claim",
          label: isClaimingTask ? "در حال دریافت وظیفه..." : "دریافت وظیفه",
          variant: "contained",
          color: "primary",
          icon: "Refresh",
          hidden:
            isInitialDataLoading || isTaskAlreadyClaimed || !isTaskApproved,
          disabled: isClaimingTask,
          onPress: async () => handleClaimTask(),
        },
        {
          id: "reject",
          label: "رد درخواست",
          variant: "outline",
          color: "danger",
          hidden:
            isInitialDataLoading || !isTaskAlreadyClaimed || !isTaskApproved,
          onPress: async () => onReject(descriptionRef.current),
        },
        {
          id: "approve",
          label: "تایید درخواست",
          variant: "contained",
          color: "primary",
          disabled: isCompletingTask,
          hidden:
            isInitialDataLoading || !isTaskAlreadyClaimed || !isTaskApproved,
          onPress: async () => onApprove(descriptionRef.current),
        },
        {
          id: "download-pdf",
          label: "دریافت PDF",
          variant: "contained",
          color: "primary",
          icon: "DocumentText",
          hidden: isInitialDataLoading || isTaskApproved,
          onPress: async () => onDownloadPDF(),
        },
      ],
      [
        isInitialDataLoading,
        isTaskAlreadyClaimed,
        isTaskApproved,
        isClaimingTask,
        isCompletingTask,
        handleClaimTask,
        onReject,
        onApprove,
        onDownloadPDF,
      ],
    );

    /* ---- Title ---- */

    const title = `درخواست گواهی اشتغال به کار ${base.requestData?.Data?.FullName ?? ""}
              برای ${employmentCertificateResult?.Data?.ReceiverOrganizationName ?? ""} جهت
              ${employmentCertificateResult?.Data?.ForReason ?? ""}`;

    /* ---- Data (for DetailsComponent) ---- */

    const data = useMemo<EmploymentCertificateData>(() => {
      const ec = employmentCertificateResult?.Data;

      const visibleItems: VisibleItem[] = [];
      if (ec?.IsNeedJobPosition) visibleItems.push("jobPosition");
      if (ec?.IsNeedPhone) visibleItems.push("phone");
      if (ec?.IsNeedStartDate) visibleItems.push("startDate");
      if (ec?.IsNeedSalary) visibleItems.push("salary");

      return {
        requestId: base.requestIdNumber,
        fullName: ec?.FullName || "",
        jobPositionName: ec?.JobPosition || "",
        personnelId: String(base.requestData?.Data?.PersonnelId) || "",
        receiverOrganizationName: ec?.ReceiverOrganizationName || "",
        forReason: ec?.ForReason || "",
        isNeedJobPosition: ec?.IsNeedJobPosition || false,
        isNeedPhone: ec?.IsNeedPhone || false,
        isNeedStartDate: ec?.IsNeedStartDate || false,
        isNeedSalary: ec?.IsNeedSalary || false,
        visibleItems,
        trackingCode: base.trackingCode,
      };
    }, [
      base.requestIdNumber,
      employmentCertificateResult?.Data,
      lastRequestStatusResult?.Data,
      base.requestData?.Data,
      base.trackingCode,
    ]);

    return {
      title,
      actions,
      isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
      isTaskApproved,
      descriptionRef,
    };
  });

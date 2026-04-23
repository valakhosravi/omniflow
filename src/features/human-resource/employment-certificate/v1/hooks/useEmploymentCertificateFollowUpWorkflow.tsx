/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useGetEmploymentCertificateByRequestIdQuery } from "@/features/human-resource/employment-certificate/v1/employment-certificate.services";
import { addToaster } from "@/ui/Toaster";
import {
  useWorkflowBase,
  useCancelWorkflow,
  defineWorkflowHook,
} from "@/hooks/workflow";
import type { ActionButton } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import { AppConfirmModalContent } from "@/components/common/AppConfirmModalContent";
import { buildCertificateDisplayData } from "../utils/follow-up-helpers";
import { setCertificateDisplayData } from "../employment-certificate.slice";
import type {
  EmploymentCertificateData,
  VisibleItem,
} from "../employment-certificate.types";
import { useGetEmployeeInfoByPersonnelIdQuery } from "@/services/commonApi/commonApi";
import { useDisclosure } from "@heroui/react";

export const useEmploymentCertificateFollowUpWorkflow =
  defineWorkflowHook<EmploymentCertificateData>()(() => {
    const dispatch = useDispatch();
    const base = useWorkflowBase();

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

    const personnelId = useMemo(
      () => base.requestData?.Data?.PersonnelId,
      [base.requestData],
    );

    const { data: employeeInfoResult } = useGetEmployeeInfoByPersonnelIdQuery(
      personnelId || -1,
      {
        refetchOnMountOrArgChange: true,
        skip: !personnelId,
      },
    );

    const statusCode = base.lastRequestStatusResult?.Data?.StatusCode;
    const isApproved = statusCode === 102;
    const canCancel =
      base.lastRequestStatusResult?.Data?.CanBeCanceled ?? false;

    const { onConfirmCancel, isSendingMessage } = useCancelWorkflow({
      requestId: base.requestId,
      instanceId: base.requestData?.Data?.InstanceId || "",
      trackingCode: base.trackingCode,
      messageName: "Employment-Certificate-Terminate-Request-Message",
      processName: "EmploymentCertificate",
    });

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
          base.lastRequestStatusResult?.Data,
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
      base.lastRequestStatusResult?.Data,
      base.requestData?.Data,
    ]);

    /* ---- Actions ---- */
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const actions: ActionButton[] = [
      {
        id: "view-letter",
        label: "مشاهده نامه",
        variant: "outline",
        hidden: base.isInitialDataLoading || !isApproved,
        onPress: async () => onDownloadPDF(),
      },
      {
        id: "download-pdf",
        label: "دریافت PDF",
        variant: "contained",
        color: "primary",
        hidden: base.isInitialDataLoading || !isApproved,
        onPress: async () => onDownloadPDF(),
      },
      {
        id: "cancel-request",
        label: "لغو درخواست",
        variant: "outline",
        color: "danger",
        hidden: base.isInitialDataLoading || !canCancel,
        onPress: onOpen,
        modalConfig: {
          title: "تایید لغو درخواست",
          isOpen: isOpen,
          onClose: () => onOpenChange(),
          content: (close) => (
            <AppConfirmModalContent
              message="این عمل قابل بازگشت نیست."
              onClose={close}
              onConfirm={() => onConfirmCancel()}
              isSubmitting={isSendingMessage}
              confirmLabel="تایید لغو درخواست"
              submittingLabel="در حال لغو..."
            />
          ),
        },
      },
    ];

    /* ---- Title ---- */

    const title = `درخواست گواهی اشتغال به کار ${employmentCertificateResult?.Data?.FullName ?? ""} برای ${employmentCertificateResult?.Data?.ReceiverOrganizationName ?? ""} جهت ${employmentCertificateResult?.Data?.ForReason ?? ""}`;

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
      base.lastRequestStatusResult?.Data,
      base.requestData?.Data,
      base.trackingCode,
    ]);

    return {
      title,
      actions,
      isInitialDataLoading: base.isInitialDataLoading,
      requestId: base.requestIdNumber,
      data,
    };
  });

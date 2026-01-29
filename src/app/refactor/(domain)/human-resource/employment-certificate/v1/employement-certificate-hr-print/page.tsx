"use client";
// example-usage.tsx
import { SchemaPageRenderer } from "@/components/common/AppWorkflowPage/components/SchemaPageRenderer";
import {
  ActionButton,
  SchemaPage,
} from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";
import React, { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetEmploymentCertificateByRequestIdQuery,
  useLazyGetEmployeeInfoByPersonnelIdQuery,
} from "@/packages/features/task-inbox/api/employmentCertificateApi";
import {
  useGetLastRequestStatusQuery,
  useGetRequestByIdQuery,
  useGetRequestTimelineQuery,
} from "@/packages/features/task-inbox/api/RequestApi";
import {
  useCamunda,
  useGetTaskByIdQuery,
  useSendMessageMutation,
} from "@/packages/camunda";
import { addToaster } from "@/ui/Toaster";

type VisibleItem = "jobPosition" | "phone" | "startDate" | "salary";

type EmploymentCertificateData = {
  requestId: number;
  fullName: string;
  jobPositionName: string;
  personnelId: string;
  receiverOrganizationName: string;
  forReason: string;
  isNeedJobPosition: boolean;
  isNeedPhone: boolean;
  isNeedStartDate: boolean;
  isNeedSalary: boolean;
  visibleItems: VisibleItem[];
};

// ---- Your form shape (react-hook-form values) ----
type EmploymentCertificateForm = {
  description: string;
};

// ---- Example page component using renderer ----
export default function EmploymentCertificateExamplePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");
  const requestId = searchParams?.get("requestId");

  const {
    data: employmentCertificateResult,
    isLoading: employmentCertificateLoading,
  } = useGetEmploymentCertificateByRequestIdQuery(requestId || "", {
    skip: !requestId,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: lastRequestStatusResult,
    refetch: refetchGetLastRequestStatus,
  } = useGetLastRequestStatusQuery(Number(requestId) || 0, {
    skip: !requestId,
    refetchOnMountOrArgChange: true,
  });
  const { data: requestTimeline, refetch: refetchRequestTimeline } =
    useGetRequestTimelineQuery(Number(requestId), {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    });
  const { data: requestData } = useGetRequestByIdQuery(Number(requestId) || 0, {
    skip: !requestId,
  });
  const { data: taskData, refetch: getTaskByIdRefetch } = useGetTaskByIdQuery(
    taskId || "",
    {
      skip: !taskId,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    },
  );

  const [getEmployeeInfoByPersonnelId, { data: employeeInfoResult }] =
    useLazyGetEmployeeInfoByPersonnelIdQuery();
  const {
    completeTaskWithPayload,
    claimTaskWithPayload,
    isClaimingTask,
    isCompletingTask,
  } = useCamunda();
  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  useEffect(() => {
    if (requestData?.Data?.PersonnelId) {
      getEmployeeInfoByPersonnelId(requestData.Data.PersonnelId);
    }
  }, [requestData]);

  const isTaskAlreadyClaimed = useMemo(
    () => taskData?.assignee !== null,
    [taskData?.assignee],
  );

  const handleClaimTask = useCallback(async () => {
    if (!taskId) {
      addToaster({
        color: "danger",
        title: "شناسه وظیفه یافت نشد",
      });
      return;
    }

    try {
      await claimTaskWithPayload(
        taskId,
        {
          userId: String(Number(employeeInfoResult?.Data?.PersonnelId)),
        },
        {
          requestId: Number(requestId),
        },
      );
      getTaskByIdRefetch();
    } catch (error: any) {
      const errorMessage = error.message || "خطا در دریافت وظیفه";
      // setClaimError(errorMessage);
      addToaster({
        color: "danger",
        title: errorMessage,
      });
    }
  }, [taskId, claimTaskWithPayload, employeeInfoResult?.Data?.PersonnelId]);

  const onReject = useCallback(
    async (description: string) => {
      if (!taskId) return;

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
        await completeTaskWithPayload(taskId, {
          ReceiverOrganization:
            employmentCertificateResult?.Data?.ReceiverOrganizationName ?? "",
          JobPosition: employeeInfoResult?.Data?.Title ?? "",
          FullName: employeeInfoResult?.Data?.FullName ?? "",
          NationalCode: employeeInfoResult?.Data?.NationalCode ?? "",
          StartDate: employeeInfoResult?.Data?.EmploymentDate ?? "",
          ForReason: employmentCertificateResult?.Data?.ForReason ?? "",
          FatherName: employeeInfoResult?.Data?.FatherName ?? "",
          Salary: "",
          HrApprove: false,
          description: description.trim(),
          EmploymentCertificateId: Number(
            employmentCertificateResult?.Data?.RequestId,
          ),
        });

        addToaster({
          color: "success",
          title: "درخواست با موفقیت رد شد",
        });

        refetchGetLastRequestStatus();
        refetchRequestTimeline();
        router.replace("/task-inbox?tab=mytask");
      } catch (err: any) {
        addToaster({
          color: "danger",
          title: err?.message || "خطا در رد درخواست",
        });
      }
    },
    [
      taskId,
      isTaskAlreadyClaimed,
      employmentCertificateResult,
      employeeInfoResult,
      completeTaskWithPayload,
      refetchGetLastRequestStatus,
      refetchRequestTimeline,
      router,
    ],
  );

  const onApprove = useCallback(
    async (description: string) => {
      if (!taskId) return;

      if (!isTaskAlreadyClaimed) {
        addToaster({
          color: "warning",
          title: "ابتدا باید وظیفه را دریافت کنید",
        });
        return;
      }

      try {
        await completeTaskWithPayload(taskId, {
          ReceiverOrganization:
            employmentCertificateResult?.Data?.ReceiverOrganizationName ?? "",
          JobPosition: employeeInfoResult?.Data?.Title ?? "",
          FullName: employeeInfoResult?.Data?.FullName ?? "",
          NationalCode: employeeInfoResult?.Data?.NationalCode ?? "",
          StartDate: employeeInfoResult?.Data?.EmploymentDate ?? "",
          ForReason: employmentCertificateResult?.Data?.ForReason ?? "",
          FatherName: employeeInfoResult?.Data?.FatherName ?? "",
          Salary: "",
          HrApprove: true,
          description: description?.trim() || "",
          EmploymentCertificateId: Number(
            employmentCertificateResult?.Data?.RequestId,
          ),
        });

        addToaster({
          color: "success",
          title: "درخواست با موفقیت تایید شد",
        });

        refetchGetLastRequestStatus();
        refetchRequestTimeline();
      } catch (err: any) {
        addToaster({
          color: "danger",
          title: err?.message || "خطا در تایید درخواست",
        });
      }
    },
    [
      taskId,
      isTaskAlreadyClaimed,
      employmentCertificateResult,
      employeeInfoResult,
      completeTaskWithPayload,
      refetchGetLastRequestStatus,
      refetchRequestTimeline,
    ],
  );

  const claimActions = useMemo<
    ActionButton<EmploymentCertificateData, EmploymentCertificateForm>[]
  >(
    () =>
      !isTaskAlreadyClaimed
        ? [
            {
              id: "claim",
              label: isClaimingTask ? "در حال دریافت وظیفه..." : "دریافت وظیفه",
              variant: "solid",
              color: "primary",
              icon: "Refresh" as any,
              disabled: () => isClaimingTask,
              onPress: async () => handleClaimTask(),
            },
          ]
        : [],
    [isTaskAlreadyClaimed, isClaimingTask, handleClaimTask],
  );

  const hrActions = useMemo<
    ActionButton<EmploymentCertificateData, EmploymentCertificateForm>[]
  >(
    () =>
      isTaskAlreadyClaimed
        ? [
            {
              id: "reject",
              label: "رد درخواست",
              variant: "bordered",
              color: "danger",
              onPress: async ({ values }: { values: any }) =>
                onReject(values.description),
            },
            {
              id: "approve",
              label: "تایید درخواست",
              variant: "solid",
              color: "primary",
              disabled: () => isCompletingTask,
              onPress: async ({ values }: { values: any }) =>
                onApprove(values.description),
            },
          ]
        : [],
    [isTaskAlreadyClaimed, isCompletingTask, onReject, onApprove],
  );

  const employmentCertificateSchema: SchemaPage<
    EmploymentCertificateData,
    EmploymentCertificateForm
  > = useMemo(() => {
    return {
      title: `درخواست گواهی اشتغال به کار ${requestData?.Data?.FullName}
              برای ${employmentCertificateResult?.Data?.ReceiverOrganizationName} جهت
              ${employmentCertificateResult?.Data?.ForReason}`,

      details: [
        {
          key: "fullName",
          label: "نام و نام خانوادگی",
          icon: "UserTag" as any,
          type: "text",
          value: ({ data }) => data.fullName || "",
        },
        {
          key: "jobPositionName",
          label: "سمت",
          icon: "User" as any,
          type: "text",
          value: ({ data }) => data.jobPositionName || "",
        },
        {
          key: "personnelId",
          label: "کد پرسنلی",
          icon: "UserSquare" as any,
          type: "text",
          value: ({ data }) => data.personnelId || "",
        },
        {
          key: "receiverOrganizationName",
          label: "سازمان / اداره هدف",
          icon: "Buildings" as any,
          type: "text",
          value: ({ data }) => data.receiverOrganizationName,
        },
        {
          key: "forReason",
          label: "جهت",
          icon: "Arrow" as any,
          type: "text",
          value: ({ data }) => data.forReason || "-",
        },
        {
          key: "lang",
          label: "زبان گواهی اشتغال به کار",
          icon: "Global" as any,
          type: "text",
          value: () => "فارسی",
        },
        {
          key: "visibleItems",
          label: "موارد قابل‌نمایش در نامه",
          icon: "Eye" as any,
          type: "text",
          value: ({ data }) => {
            return (
              <div className="flex gap-2 flex-wrap">
                {data.isNeedJobPosition && (
                  <div className="text-[14px] font-[500] rounded-full px-2 py-1 border border-[#1C3A6333]">
                    سمت شغلی
                  </div>
                )}
                {data.isNeedPhone && (
                  <div className="text-[14px] font-[500] rounded-full px-2 py-1 border border-[#1C3A6333]">
                    شماره تماس
                  </div>
                )}
                {data.isNeedStartDate && (
                  <div className="text-[14px] font-[500] rounded-full px-2 py-1 border border-[#1C3A6333]">
                    تاریخ استخدام
                  </div>
                )}
                {data.isNeedSalary && (
                  <div className="text-[14px] font-[500] rounded-full px-2 py-1 border border-[#1C3A6333]">
                    مقدار حقوق
                  </div>
                )}
              </div>
            );
          },
        },
      ],

      form: {
        defaultValues: { description: "" },
        fields: [
          {
            name: "description" as any,
            type: "textarea",
            label: "توضیحات",
            placeholder: "در صورتی که توضیحاتی دارید در این قسمت وارد کنید.",
            ui: {
              classNames: {
                inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
                input: "text-right dir-rtl",
              },
            },
          },
        ],
      },

      modals: [],

      actions: [...claimActions, ...hrActions],
    };
  }, [employmentCertificateResult, requestData]);

  const data = useMemo<EmploymentCertificateData>(() => {
    const ec = employmentCertificateResult?.Data;

    const visibleItems: VisibleItem[] = [];

    if (ec?.IsNeedJobPosition) visibleItems.push("jobPosition");
    if (ec?.IsNeedPhone) visibleItems.push("phone");
    if (ec?.IsNeedStartDate) visibleItems.push("startDate");
    if (ec?.IsNeedSalary) visibleItems.push("salary");

    return {
      requestId: Number(requestId),
      fullName: lastRequestStatusResult?.Data?.FullName || "",
      jobPositionName: lastRequestStatusResult?.Data?.JobPositionName || "",
      personnelId: String(requestData?.Data?.PersonnelId) || "",
      receiverOrganizationName:
        employmentCertificateResult?.Data?.ReceiverOrganizationName || "",
      forReason: employmentCertificateResult?.Data?.ForReason || "",
      isNeedJobPosition:
        employmentCertificateResult?.Data?.IsNeedJobPosition || false,
      isNeedPhone: employmentCertificateResult?.Data?.IsNeedPhone || false,
      isNeedStartDate:
        employmentCertificateResult?.Data?.IsNeedStartDate || false,
      isNeedSalary: employmentCertificateResult?.Data?.IsNeedSalary || false,
      visibleItems,
    };
  }, [
    requestId,
    employmentCertificateResult,
    lastRequestStatusResult,
    requestData,
    employeeInfoResult,
    taskId,
    isTaskAlreadyClaimed,
  ]);

  return (
    <div style={{ padding: 16 }}>
      <SchemaPageRenderer schema={employmentCertificateSchema} data={data} />
    </div>
  );
}

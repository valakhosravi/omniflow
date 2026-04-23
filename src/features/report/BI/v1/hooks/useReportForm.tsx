"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useCamunda } from "@/packages/camunda";
import { addToaster } from "@/ui/Toaster";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import useGetLastProcessByName from "@/hooks/process/useGetLastProcessByName";
import {
  useGetAIMLTargetModelsQuery,
  useGetCategoriesQuery,
  useGetDataAccessClearancesQuery,
  useGetDataScopesQuery,
  useGetModelLimitationsQuery,
  useGetOutputFormatsQuery,
  useGetPrioritiesQuery,
  useGetReportUpdatePeriodsQuery,
} from "../report.services";
import {
  useGetRequestByIdQuery,
  useSaveProcessAttachmentMutation,
} from "@/services/commonApi/commonApi";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { KPI_OPTIONS, KPI_ID_MAP } from "../utils/report-form-config";
import {
  KPI_OTHER_KEY,
  ReportComponentType,
  ReportFormOptions,
  ReportRequest,
  ReportTicketFormData,
} from "../reportV1.types";

// ─── Default Values ──────────────────────────────────────────────

const defaultValues: Partial<ReportTicketFormData> = {
  order: undefined,
  purpose: "",
  requestType: undefined,
  title: "",
  description: "",
  requiredOutput: undefined,
  dataRange: undefined,
  kpis: undefined,
  kpisOther: undefined,
  filter: undefined,
  accessLevel: undefined,
  deliveryTime: "",
  modelingRequest: false,
  modelPurpose: undefined,
  targetVariable: "",
  modelLimitation: undefined,
  updatePeriod: undefined,
  requirements: "",
  needToCompare: false,
};

// ─── KPI Utilities ───────────────────────────────────────────────

function parseKpisFromReportInfo(reportInfo: ReportRequest) {
  const kpiStr = String(reportInfo?.Kpi ?? reportInfo?.KpiName ?? "").trim();
  const filtersStr = String(reportInfo?.Filters ?? "").trim();

  const kpis: string[] = [];
  let kpisOther: string | undefined;
  const filterParts = filtersStr.split(/\s*\|\s*/).filter(Boolean);
  const otherPrefix = "شاخص سایر: ";
  const filter = filterParts
    .filter((p) => !p.trim().startsWith(otherPrefix))
    .join(" | ")
    .trim();
  const otherPart = filterParts.find((p) => p.trim().startsWith(otherPrefix));
  if (otherPart) {
    kpisOther = otherPart.replace(otherPrefix, "").trim();
    kpis.push(KPI_OTHER_KEY);
  }

  if (kpiStr) {
    const parts = kpiStr
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const kpiIds = new Set(KPI_OPTIONS.map((o) => o.id));
    for (const part of parts) {
      if (KPI_ID_MAP[part]) {
        kpis.push(KPI_ID_MAP[part]);
      } else if (kpiIds.has(part)) {
        kpis.push(part);
      } else if (part && part !== String(kpisOther)) {
        kpis.push(KPI_OTHER_KEY);
        if (!kpisOther) kpisOther = part;
      }
    }
  }

  return {
    kpis: kpis.length ? kpis : undefined,
    kpisOther,
    filter: filter || undefined,
  };
}

function buildKpiPayloadString(kpis: string[] | undefined, kpisOther?: string) {
  if (!kpis?.length) return undefined;
  const parts = kpis.map((id) =>
    id === KPI_OTHER_KEY ? (kpisOther ?? "").trim() : id,
  );
  const filtered = parts.filter(Boolean);
  return filtered.length > 0 ? filtered.join(",") : undefined;
}

function buildFiltersWithOther(filter: string | undefined, kpisOther?: string) {
  const parts = [
    filter?.trim(),
    kpisOther ? `شاخص سایر: ${kpisOther}` : null,
  ].filter(Boolean) as string[];
  return parts.length > 0 ? parts.join(" | ") : undefined;
}

// ─── Hook ────────────────────────────────────────────────────────

export function useReportForm(
  reportType: ReportComponentType,
  reportInfo?: ReportRequest,
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = reportType === ReportComponentType.EDIT;
  const requestId = searchParams?.get("requestId") ?? "-1";

  // ── Data Fetching ────────────────────────────────────────────

  const { data: processByNameAndVersion } = useGetLastProcessByName("Report");
  const { data: categories } = useGetCategoriesQuery();
  const { data: priorities } = useGetPrioritiesQuery();
  const { data: outputFormats } = useGetOutputFormatsQuery();
  const { data: dataScopes } = useGetDataScopesQuery();
  const { data: accesses } = useGetDataAccessClearancesQuery();
  const { data: AIMLTargets } = useGetAIMLTargetModelsQuery();
  const { data: modelLimitationData } = useGetModelLimitationsQuery();
  const { data: updatePeriods } = useGetReportUpdatePeriodsQuery();
  const { data: requestData } = useGetRequestByIdQuery(
    Number(reportInfo?.RequestId ?? requestId),
    { skip: !requestId && !reportInfo?.RequestId },
  );

  // ── File State ───────────────────────────────────────────────

  const [files, setFiles] = useState<FileType[]>([]);

  // ── Camunda & Auth ───────────────────────────────────────────

  const {
    startProcessWithPayload,
    completeTaskWithPayload,
    isStartingProcess,
  } = useCamunda();
  const [saveProcessAttachment] = useSaveProcessAttachmentMutation();
  const { userDetail } = useAuth();

  // ── Form Setup ───────────────────────────────────────────────

  const formMethods = useForm<ReportTicketFormData>({
    defaultValues,
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const { reset, handleSubmit, watch } = formMethods;

  // ── Edit Mode: Reset form with existing data ─────────────────

  useEffect(() => {
    if (isEditMode && reportInfo) {
      const { kpis, kpisOther, filter } = parseKpisFromReportInfo(reportInfo);
      reset({
        order: reportInfo.PriorityId,
        purpose: reportInfo.Target ?? "",
        requestType: reportInfo.CategoryId,
        title: reportInfo?.Title ?? "",
        description: reportInfo.Description ?? "",
        requiredOutput: reportInfo.OutputFormatId,
        dataRange: reportInfo.DataScopeId,
        kpis,
        kpisOther,
        filter: filter ?? reportInfo.Filters ?? "",
        accessLevel: reportInfo.DataAccessId,
        deliveryTime: reportInfo.DeliveryDate ?? "",
        modelingRequest: reportInfo.IsAiml,
        modelPurpose: reportInfo.TargetModelId,
        targetVariable: reportInfo.TargetVariable ?? "",
        modelLimitation: reportInfo.ModelLimitationId,
        updatePeriod: reportInfo.ReportUpdateId,
        requirements: reportInfo.Requirements ?? "",
        needToCompare: reportInfo.NeedCompare,
      });
    }
  }, [isEditMode, reportInfo, requestData?.Data?.Title, reset]);

  // ── Select Options ───────────────────────────────────────────

  const options: ReportFormOptions = {
    category:
      categories?.Data?.map((c) => ({
        label: c.Name ?? "",
        value: c.CategoryId,
      })) ?? [],
    priority:
      priorities?.Data?.map((c) => ({
        label: c.PriorityName ?? "",
        value: c.Priority,
      })) ?? [],
    outputFormat:
      outputFormats?.Data?.map((c) => ({
        label: c.OutputFormatDescription ?? "",
        value: c.OutputFormat,
      })) ?? [],
    dataScope:
      dataScopes?.Data?.map((c) => ({
        label: c.Name ?? "",
        value: c.DataScopeId,
      })) ?? [],
    access:
      accesses?.Data?.map((c) => ({
        label: c.DataAccessClearanceDescription ?? "",
        value: c.DataAccessClearance,
      })) ?? [],
    AIMLTarget:
      AIMLTargets?.Data?.map((AIML) => ({
        label: AIML.TargetModelName ?? "",
        value: AIML.TargetModel,
      })) ?? [],
    modelLimitation:
      modelLimitationData?.Data?.map((limit) => ({
        label: limit.ModelLimitationName ?? "",
        value: limit.ModelLimitation,
      })) ?? [],
    updatePeriod:
      updatePeriods?.Data?.map((c) => ({
        label: c.ReportUpdatePeriodName ?? "",
        value: c.ReportUpdatePeriod,
      })) ?? [],
  };

  // ── Watched Values ───────────────────────────────────────────

  // eslint-disable-next-line react-hooks/incompatible-library
  const modelingRequest = watch("modelingRequest");

  // ── File Attachment Helper ───────────────────────────────────

  const saveAttachment = useCallback(
    (instanceId: string, isStart: boolean) => {
      if (files.length > 0 && files[0].file) {
        saveProcessAttachment({
          InstanceId: instanceId,
          ProcessName: FeatureNamesEnum.REPORT,
          IsStart: isStart,
          AttachmentDetails: [
            {
              Title: files[0].name!,
              AttachmentKey: "reportAttachment",
              AttachmentFile: files[0].file,
            },
          ],
        });
      }
    },
    [files, saveProcessAttachment],
  );

  // ── Submit Handler ───────────────────────────────────────────

  const onSubmit = async (data: ReportTicketFormData) => {
    const deliveryTime = data.deliveryTime
      ? new DateObject({
          date: data.deliveryTime,
          calendar: persian,
          locale: persian_fa,
          format: "YYYY/MM/DD",
        }).format("YYYY/MM/DD")
      : "";

    const sharedPayload = {
      CategoryId: data.requestType,
      PriorityId: data.order,
      Target: data.purpose,
      Description: data.description,
      OutputFormatId: data.requiredOutput,
      DataScopeId: data.dataRange,
      Kpi: buildKpiPayloadString(data.kpis, data.kpisOther),
      Filters: buildFiltersWithOther(data.filter, data.kpisOther),
      DataAccessId: data.accessLevel,
      DeliveryDate: deliveryTime,
      NeedCompare: data.needToCompare,
      ReportUpdateId: data.updatePeriod,
      IsAiml: !!data.modelingRequest,
      TargetModelId: data.modelPurpose,
      TargetVariable: data.targetVariable,
      Requirements: data.requirements,
      ModelLimitationId: data.modelLimitation,
      Title: data.title,
    };

    const taskId = searchParams?.get("taskId");

    try {
      if (isEditMode && taskId) {
        await completeTaskWithPayload(
          taskId,
          sharedPayload,
          "Report",
          String(requestData?.Data?.TrackingCode ?? ""),
        ).then(() => saveAttachment(requestData?.Data?.InstanceId!, false));
      } else {
        const createPayload = {
          ...sharedPayload,
          PersonnelId: String(userDetail?.UserDetail?.PersonnelId) || "",
          EmployeeMobileNumber: userDetail?.UserDetail.Mobile,
          ManagerPersonnelId: String(userDetail?.Parent.PersonnelId),
          ManagerUserId: userDetail?.Parent.UserId,
          PositionType: userDetail?.UserDetail.PositionType,
        };
        const res = await startProcessWithPayload(
          processByNameAndVersion?.Data?.DefinitionId || "",
          createPayload,
          "Report",
        );
        saveAttachment(res.id ?? "", true);
      }
      router.push("/task-inbox/requests");
    } catch (error: unknown) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      addToaster({
        color: "danger",
        title: message || "خطا در ثبت گزارش",
      });
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit);
  const formButtonTitle = isEditMode ? "ویرایش" : "ثبت";

  return {
    formMethods,
    handleFormSubmit,
    options,
    files,
    setFiles,
    requestId,
    isSubmitting: isStartingProcess,
    formButtonTitle,
    modelingRequest,
  };
}

"use client";
import ReportForm from "./ReportForm";
import AppButton from "@/components/common/AppButton/AppButton";
import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";
import StartProcessHeader from "@/components/common/AppStartProcessHeader";
import { Spinner } from "@heroui/react";
import { useReportStart } from "../hooks/useReportStart";
import type { ReportComponentType } from "../reportV1.types";

type ReportStartPageComponentProps = {
  type: ReportComponentType;
};

export default function ReportStartPageComponent({
  type,
}: ReportStartPageComponentProps) {
  const {
    isEditMode,
    title,
    reportInfo,
    isLoading,
    hasError,
    requestTimeline,
    isRequestFlowOpen,
    onRequestFlowOpen,
    onOpenChangeRequestFlow,
  } = useReportStart(type);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">خطا در بارگذاری اطلاعات</p>
      </div>
    );
  }
  console.log("reportInfo", reportInfo);
  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-6">
        <StartProcessHeader title={title} />
        {isEditMode && (
          <AppButton
            variant="outline"
            size="normal"
            icon="Refresh"
            label="مراحل گردش درخواست"
            onClick={onRequestFlowOpen}
          />
        )}
      </div>
      <div className="flex gap-x-4 items-start justify-center">
        <ReportForm reportType={type} reportInfo={reportInfo ?? undefined} />
      </div>
      {isEditMode && (
        <AppRequestFlowModal
          isOpen={isRequestFlowOpen}
          onOpenChange={onOpenChangeRequestFlow}
          requestTimeline={requestTimeline}
        />
      )}
    </div>
  );
}

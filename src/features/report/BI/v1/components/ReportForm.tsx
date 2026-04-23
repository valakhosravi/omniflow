"use client";
import { FormProvider } from "react-hook-form";
import AppButton from "@/components/common/AppButton/AppButton";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { ReportFormPropsType } from "../reportV1.types";
import { useReportForm } from "../hooks/useReportForm";
import ReportRequestDescriptionSection from "./ReportRequestDescriptionSection";
import ReportAIMLSection from "./ReportAIMLSection";

export default function ReportForm({
  reportType,
  reportInfo,
}: ReportFormPropsType) {
  const {
    formMethods,
    handleFormSubmit,
    options,
    files,
    setFiles,
    requestId,
    isSubmitting,
    formButtonTitle,
  } = useReportForm(reportType, reportInfo);

  return (
    <FormProvider {...formMethods}>
      <form
        className="flex flex-col space-y-4 mb-4"
        onSubmit={handleFormSubmit}
      >
        <ReportRequestDescriptionSection
          reportType={reportType}
          options={{
            category: options.category,
            priority: options.priority,
            outputFormat: options.outputFormat,
            dataScope: options.dataScope,
            access: options.access,
            updatePeriod: options.updatePeriod,
          }}
        />

        <div className="w-full space-y-4">
          <div className="space-y-1">
            <h1 className="text-primary-950 font-medium text-[16px]">
              بارگزاری فایل یا تصویر
            </h1>
          </div>
          <AppFile
            enableUpload
            requestId={requestId}
            featureName={FeatureNamesEnum.REPORT}
            isMultiple={false}
            files={files}
            setFiles={setFiles}
          />
        </div>

        <ReportAIMLSection
          options={{
            AIMLTarget: options.AIMLTarget,
            modelLimitation: options.modelLimitation,
          }}
        />

        <div className="self-end">
          <AppButton
            color="primary"
            size="normal"
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            label={formButtonTitle}
          />
        </div>
      </form>
    </FormProvider>
  );
}

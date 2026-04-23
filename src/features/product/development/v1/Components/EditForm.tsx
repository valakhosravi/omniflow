"use client";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { useRouter, useSearchParams } from "next/navigation";
import AppButton from "@/components/common/AppButton/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { useCamunda } from "@/packages/camunda";
import DevelopmentDescription from "./DevelopmentDescription";
import HelpFile from "./HelpFile";
import useGetLastProcessByName from "@/hooks/process/useGetLastProcessByName";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  DevelopmentTicketFormData,
  DevelopmetDetailsType,
} from "../development.types";
import { useGetDevelopmentRequestDetailsQuery } from "../development.services";
import AppFile from "@/components/common/AppFile";
import AdditionalInformation from "./AdditionalInformation";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";

interface EditFormProps {
  requestId: string;
  refetch: () => void;
  developRequestDetails: GeneralResponse<DevelopmetDetailsType> | undefined;
  formKey: string;
}

export default function EditForm({
  developRequestDetails,
  formKey,
  requestId,
}: EditFormProps) {
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");
  const router = useRouter();

  const [additionalDescription, setAdditionalDescription] = useState("");

  const { data: processByNameAndVersion } =
    useGetLastProcessByName("Development");
  const { data: developTicketDetail } = useGetDevelopmentRequestDetailsQuery(
    Number(requestId),
  );
  const title = developRequestDetails?.Data?.Title;
  const [files, setFiles] = useState<FileType[] | []>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<DevelopmentTicketFormData>({
    defaultValues: {
      order: 0,
      requestType: 0,
      title: "",
      description: "",
      deputyName: "",
      hasSimilarProcess: 0,
      similarProcessDescription: "",
      isRegulatoryCompliant: 0,
      regulatoryCompliantDescription: "",
      beneficialCustomers: "",
      customerUsageDescription: "",
      requestedFeatures: "",
      isReportRequired: false,
      reportPath: "",
      expectedOutput: "",
      technicalDetails: "",
      kpi: "",
      letterNumber: "",
    },
  });

  const { completeTaskWithPayload, isCompletingTask } = useCamunda();

  const onSubmit = async (data: DevelopmentTicketFormData) => {
    if (!taskId) return;

    try {
      const payload = {
        Title: title || "",
        Priority: Number(data.order) || 0,
        RequestType: Number(data.requestType) || 0,
        Attachment: files[0]?.AttachmentAddress || "",
        ExtraDescription: additionalDescription || "",
        Description: data.description || "",
        ApplicationId: null,
        DeputyName: data.deputyName || "",
        BeneficialCustomers: data.beneficialCustomers || "",
        CustomerUsageDescription: data.customerUsageDescription || "",
        RequestedFeatures: data.requestedFeatures || "",
        IsReportRequired: data.isReportRequired || false,
        ReportPath: data.reportPath || "",
        HasSimilarProcess: Number(data.hasSimilarProcess) || 0,
        SimilarProcessDescription: data.similarProcessDescription || "",
        IsRegulatoryCompliant: Number(data.isRegulatoryCompliant) || 0,
        RegulatoryCompliantDescription:
          data.regulatoryCompliantDescription || "",
        ExpectedOutput: data.expectedOutput || "",
        TechnicalDetails: data.technicalDetails || "",
        Kpi: data.kpi || "",
        LetterNumber: data.letterNumber || "",
        AttachmentId: files[0]?.attachmentId || 0,
      };

      await completeTaskWithPayload(taskId, payload);

      router.push("/task-inbox/requests");
    } catch (error) {
      console.error("Error submitting employment application:", error);
    }
  };

  return (
    <>
      {processByNameAndVersion?.Data?.IsDeprecated === false && (
        <form
          className="flex flex-col space-y-[16px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <DevelopmentDescription
            formKey={formKey}
            control={control}
            errors={errors}
            register={register}
            watch={watch}
            developTicketDetail={developTicketDetail}
            reset={reset}
            title={title}
            requestId={requestId}
          />
          <HelpFile />
          <AdditionalInformation
            additionalDescription={additionalDescription}
            setAdditionalDescription={setAdditionalDescription}
          />
          <AppFile
            enableUpload
            featureName={FeatureNamesEnum.DEVELOPMENT}
            files={files}
            setFiles={setFiles}
            isMultiple={false}
          />
          <div className="flex items-center self-end gap-x-2">
            <AppButton
              label="ویرایش"
              color="primary"
              type="submit"
              disabled={isCompletingTask}
              loading={isCompletingTask}
            />
          </div>
        </form>
      )}
      {processByNameAndVersion?.Data?.IsDeprecated === true && (
        <div className="flex justify-center mb-[80px]">
          <div className="text-red-500 rounded-2xl p-4 border border-red-200 bg-red-100 flex gap-3 items-center">
            <div>
              <AppIcon name="CloseCircle" size={32} />
            </div>
            <div>
              <div className="mb-2">این فرایند منسوخ شده است</div>
              <div className="text-xs text-red-500">
                شناسه فرایند: {processByNameAndVersion?.Data?.DefinitionId}
              </div>
            </div>
          </div>
          <div></div>
        </div>
      )}
    </>
  );
}

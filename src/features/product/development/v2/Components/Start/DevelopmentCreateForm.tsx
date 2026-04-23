"use client";
import AppButton from "@/components/common/AppButton/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { useForm } from "react-hook-form";
import HelpFile from "./HelpFile";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useCamunda } from "@/packages/camunda";
import { useEffect, useState } from "react";
import {
  useGetRequestByIdQuery,
  useSaveProcessAttachmentMutation,
} from "@/services/commonApi/commonApi";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import useGetLastProcessByName from "@/hooks/process/useGetLastProcessByName";
import {
  DevelopmentPagesEnum,
  DevelopmentTicketFormData,
} from "../../development.types";
import DevelopmentCreateFormInputsSection from "./DevelopmentCreateFormInputsSection";
import { createPayload } from "../../development.utils";
import { developmentDefaultValues } from "../../development.constant";
import { useGetDevelopmentDetailsQuery } from "../../development.services";

export default function DevelopmentCreateForm({
  pageType,
}: {
  pageType: DevelopmentPagesEnum;
}) {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { userDetail } = useAuth();

  const requestId = String(params?.requestId);
  const taskId = searchParams?.get("taskId");

  const {
    startProcessWithPayload,
    completeTaskWithPayload,
    isStartingProcess,
  } = useCamunda();

  const [files, setFiles] = useState<FileType[]>([]);
  const isEditMode = pageType === DevelopmentPagesEnum.EDIT;
  const { data: processByNameAndVersion } =
    useGetLastProcessByName("Development");

  const { data: requestData } = useGetRequestByIdQuery(Number(requestId), {
    skip: !requestId || !isEditMode,
  });

  const [saveProcessAttachment] = useSaveProcessAttachmentMutation();

  const { data: developTicketDetail } = useGetDevelopmentDetailsQuery(
    {
      requestId: Number(requestId),
      processName: "Development",
      trackingCode: String(requestData?.Data?.TrackingCode),
    },
    {
      skip: !requestId || Number(requestId) === 0 || !isEditMode,
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },

    control,
    reset,
    watch,
  } = useForm<DevelopmentTicketFormData>({
    defaultValues: developmentDefaultValues,
  });

  useEffect(() => {
    if (!isEditMode) return;
    if (developTicketDetail?.Data) {
      const data = developTicketDetail.Data;
      reset({
        title: data.Title,
        requestType: data.RequestType,
        order: data.Priority,
        description: data.Description,
        deputyName: data.DeputyName,
        hasSimilarProcess: data.HasSimilarProcess,
        similarProcessDescription: data.SimilarProcessDescription,
        isRegulatoryCompliant: data.IsRegulatoryCompliant,
        regulatoryCompliantDescription: data.RegulatoryCompliantDescription,
        beneficialCustomers: data.BeneficialCustomers,
        customerUsageDescription: data.CustomerUsageDescription,
        requestedFeatures: data.RequestedFeatures,
        isReportRequired: data.IsReportRequired,
        reportPath: data.ReportPath,
        expectedOutput: data.ExpectedOutput,
        technicalDetails: data.TechnicalDetails,
        kpi: data.Kpi,
        letterNumber: data.LetterNumber,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [developTicketDetail, reset]);

  const onSubmit = (data: DevelopmentTicketFormData) => {
    const payload = createPayload(data, userDetail, pageType);
    if (!isEditMode) {
      startProcessWithPayload(
        processByNameAndVersion?.Data?.DefinitionId || "",
        payload,
        "Development",
      )
        .then((res) => {
          if (files.length > 0 && files[0].file)
            saveProcessAttachment({
              InstanceId: res.id ?? "",
              ProcessName: FeatureNamesEnum.DEVELOPMENT,
              IsStart: true,
              AttachmentDetails: [
                {
                  Title: files[0].name!,
                  AttachmentKey: "developmentAttachment",
                  AttachmentFile: files[0].file,
                },
              ],
            }).catch(() => {});
        })
        .catch(() => {})
        .finally(() => router.push("/task-inbox/requests"));
    } else {
      taskId &&
        completeTaskWithPayload(
          taskId,
          payload,
          "Development",
          String(requestData?.Data?.TrackingCode),
        )
          .then(() => {
            if (files.length > 0 && files[0].file)
              saveProcessAttachment({
                InstanceId: requestData?.Data?.InstanceId!,
                ProcessName: FeatureNamesEnum.DEVELOPMENT,
                IsStart: false,
                AttachmentDetails: [
                  {
                    Title: files[0].name!,
                    AttachmentKey: "developmentAttachment",
                    AttachmentFile: files[0].file,
                  },
                ],
              }).catch(() => {});
          })
          .catch(() => {})
          .finally(() => router.push("/task-inbox/requests"));
    }
  };

  return (
    <>
      {processByNameAndVersion?.Data?.IsDeprecated === false && (
        <form
          className="flex flex-col w-[1184px] space-y-[16px] mb-[100px] xl:mb-[140px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <DevelopmentCreateFormInputsSection
            control={control}
            errors={errors}
            register={register}
            watch={watch}
            pageType={pageType}
          />
          <HelpFile />
          <AppFile
            enableUpload={true}
            requestId={requestId ?? undefined}
            files={files}
            setFiles={setFiles}
            isMultiple={false}
            featureName={FeatureNamesEnum.DEVELOPMENT}
          />

          <div className="flex items-center self-end gap-x-2">
            <AppButton
              label={pageType === DevelopmentPagesEnum.EDIT ? "ویرایش" : "ثبت تیکت"}
              type="submit"
              disabled={isStartingProcess}
              loading={isStartingProcess}
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

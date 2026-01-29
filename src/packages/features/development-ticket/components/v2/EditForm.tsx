"use client";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import CustomButton from "@/ui/Button";
import { useCamunda } from "@/packages/camunda";
import DevelopmentDescription from "./DevelopmentDescription";
import HelpFile from "./HelpFile";
import useGetProcessByNameAndVersion from "@/hooks/process/useGetProcessByNameAndVersion";
import { CloseCircle } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import { useGetDevelopmentRequestDetailsQuery } from "../../api/developmentApi";
import { DevelopmentTicketFormData } from "../../types/DevelopmentTicketFormData";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import { useSaveProcessAttachmentMutation } from "@/services/commonApi/commonApi";
import { useGetRequestByIdQuery } from "@/packages/features/task-inbox/api/RequestApi";

interface EditFormProps {
  requestId: string;
  refetch: () => void;
  developRequestDetails: GeneralResponse<GetDevelopmentTicketModel> | undefined;
  formKey: string;
}

export default function EditForm({
  developRequestDetails,
  formKey,
  refetch,
  requestId,
}: EditFormProps) {
  const searchParams = useSearchParams();
  const params = useParams();
  const taskId = searchParams?.get("taskId");
  const router = useRouter();

  const [additionalDescription, setAdditionalDescription] = useState("");
  const [files, setFiles] = useState<FileType[]>([]);

  const { data: processByNameAndVersion } =
    useGetProcessByNameAndVersion("Development");
  const { data: developTicketDetail, isLoading } =
    useGetDevelopmentRequestDetailsQuery(Number(requestId));
  const title = developRequestDetails?.Data?.Title;
  const [saveProcessAttachment] = useSaveProcessAttachmentMutation();
  const { data: requestData } = useGetRequestByIdQuery(Number(requestId), {
    skip: !requestId,
  });

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

  const onSubmit = (data: DevelopmentTicketFormData) => {
    if (!taskId) return;

    try {
      const editPayload = {
        Title: data.title,
        Priority: Number(data.order),
        RequestType: Number(data.requestType),
        ExtraDescription: additionalDescription || "",
        Description: data.description,
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
        // JiraTaskAssignee: null,
      };

      completeTaskWithPayload(taskId, editPayload).then((res) => {
        if (files.length > 0 && files[0].file) {
          saveProcessAttachment({
            InstanceId: requestData?.Data?.InstanceId!,
            ProcessName: "Development",
            IsStart: false,
            AttachmentDetails: [
              {
                Title: files[0].name!,
                AttachmentKey: files[0].AttachmentKey!,
                AttachmentFile: files[0].file,
              },
            ],
          });
        }
      });

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

          <AppFile
            enableUpload={true}
            requestId={requestId}
            files={files}
            setFiles={setFiles}
            isMultiple={false}
            featureName={FeatureNamesEnum.DEVELOPMENT}
          />
          <div className="flex items-center self-end gap-x-2">
            <CustomButton
              buttonVariant="primary"
              buttonSize="md"
              className="font-semibold text-[14px]/[35px] xl:w-[152px]"
              type="submit"
              disabled={isCompletingTask}
              isLoading={isCompletingTask}
            >
              ویرایش
            </CustomButton>
          </div>
        </form>
      )}
      {processByNameAndVersion?.Data?.IsDeprecated === true && (
        <div className="flex justify-center mb-[80px]">
          <div className="text-red-500 rounded-2xl p-4 border border-red-200 bg-red-100 flex gap-3 items-center">
            <div>
              <CloseCircle size={32} />
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

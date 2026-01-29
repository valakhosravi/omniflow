"use client";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import CustomButton from "@/ui/Button";
import { useCamunda } from "@/packages/camunda";
import DevelopmentDescription from "./DevelopmentDescription";
import HelpFile from "./HelpFile";
import UploadFile from "./UploadFile";
import useGetProcessByNameAndVersion from "@/hooks/process/useGetProcessByNameAndVersion";
import { CloseCircle } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import { useGetDevelopmentRequestDetailsQuery } from "../../api/developmentApi";
import { DevelopmentTicketFormData } from "../../types/DevelopmentTicketFormData";

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

  const { data: processByNameAndVersion } =
    useGetProcessByNameAndVersion("Development");
  const { data: developTicketDetail, isLoading } =
    useGetDevelopmentRequestDetailsQuery(Number(requestId));
  const title = developRequestDetails?.Data?.Title;

  const [attachment, setAttachment] = useState("");
  const [attachmentEdit, setAttachmentEdit] = useState<any[]>([]);
  const [attachmentUrl, setAttachmentUrl] = useState("");

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
        Attachment: attachmentEdit[0]?.AttachmentAddress || "",
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
        AttachmentId: attachmentEdit[0]?.AttachmentId || 0,
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
          <UploadFile
            setAdditionalDescription={setAdditionalDescription}
            additionalDescription={additionalDescription}
            setFileName={setAttachment}
            setFileUrl={setAttachmentUrl}
            fileName={attachment}
            developTicketDetail={developTicketDetail}
            requestId={requestId}
            setAttachmentEdit={setAttachmentEdit}
            deleteProcess={true}
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

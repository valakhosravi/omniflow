"use client";
import CustomButton from "@/ui/Button";
import { useForm } from "react-hook-form";
import { DevelopmentTicketFormData } from "../../types/DevelopmentTicketFormData";
import DevelopmentDescription from "./DevelopmentDescription";
import HelpFile from "./HelpFile";
import UploadFile from "./UploadFile";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useCamunda } from "@/packages/camunda";
import { useState, useEffect } from "react";
import useGetProcessByNameAndVersion from "@/hooks/process/useGetProcessByNameAndVersion";
import { CloseCircle } from "iconsax-reactjs";
import {
  useGetDevelopmentRequestDetailsQuery,
  useGetDevelopmentTicketQuery,
  useLazyGetProcessUserManagerQuery,
} from "../../api/developmentApi";
import { useGetProcessByNameAndVersionQuery } from "@/packages/features/task-inbox/api/RequestApi";
import {
  useGetStackHolderDirectorsQuery,
  useGetStackHoldersQuery,
} from "@/services/commonApi/commonApi";

export default function DevelopmentForm() {
  const searchParams = useSearchParams();
  const params = useParams();
  const requestId = searchParams.get("requestId");
  const router = useRouter();
  const { userDetail } = useAuth();
  const { startProcessWithPayload, isStartingProcess } = useCamunda();
  const [additionalDescription, setAdditionalDescription] = useState("");

  const { data: processByNameAndVersion } = useGetProcessByNameAndVersionQuery({
    processName: "Development",
    version: "3",
  });
  const [attachment, setAttachment] = useState("");
  const [attachmentEdit, setAttachmentEdit] = useState<any[]>([]);

  const { data: developTicketDetail, isLoading } =
    useGetDevelopmentRequestDetailsQuery(Number(requestId), {
      skip: !requestId || Number(requestId) === 0,
    });

  const [
    getProcessUserManager,
    { data: processUserManagerData, isLoading: isFetchingManager },
  ] = useLazyGetProcessUserManagerQuery();

  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [positionType, setPositionType] = useState(0);

  const { data: stackHolderDirectors } = useGetStackHolderDirectorsQuery();
  const { data: stackHolders } = useGetStackHoldersQuery();

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
      stackHolderContactDirector: "",
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
      stackHolder: "",
    },
  });

  // Call GetProcessUserManager when user details are available and PositionType is 1
  useEffect(() => {
    if (userDetail?.UserDetail) {
      setPositionType(userDetail.UserDetail.PositionType);
      if (
        userDetail?.UserDetail.PositionType === 1 &&
        userDetail?.UserDetail.PersonnelId
      ) {
        const personnelId = Number(userDetail.UserDetail.PersonnelId);
        if (personnelId && !isNaN(personnelId)) {
          getProcessUserManager(personnelId);
        }
      }
    }
  }, [userDetail, getProcessUserManager]);

  const onSubmit = async (data: DevelopmentTicketFormData) => {
    try {
      const payload = {
        PersonnelId: String(userDetail?.UserDetail.PersonnelId) || "",
        Title: data.title,
        EmployeeMobileNumber: userDetail?.UserDetail.Mobile,
        Priority: Number(data.order) || 1,
        RequestType: String(data.requestType) || "",
        Attachment: attachmentUrl || "",
        ExtraDescription: additionalDescription || "",
        Description: data.description || "",
        ManagerPersonnelId:
          positionType === 1
            ? String(processUserManagerData?.Data.PersonnelId || "")
            : String(userDetail?.Parent.PersonnelId),
        ApplicationId: null,
        ManagerUserId:
          positionType === 1
            ? processUserManagerData?.Data.UserId
            : userDetail?.Parent.UserId,
        PositionType: positionType,
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
        StackHolderContactDirector: data.stackHolderContactDirector || "",
        StackHolder: data.stackHolder || "",
        StackHolderContactPoint: userDetail?.UserDetail.FullName || "",
      };

      await startProcessWithPayload(
        processByNameAndVersion?.Data?.DefinitionId || "",
        payload
      );

      router.push("/task-inbox/requests");
    } catch (error) {
      console.error("Error submitting employment application:", error);
    }
  };

  return (
    <>
      {processByNameAndVersion?.Data?.IsDeprecated === false && (
        <form
          className="flex flex-col w-[1184px] space-y-[16px] mb-[100px] xl:mb-[140px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <DevelopmentDescription
            control={control}
            errors={errors}
            register={register}
            watch={watch}
            developTicketDetail={developTicketDetail}
            reset={reset}
            stackHolderDirectors={stackHolderDirectors?.Data}
            stackHolders={stackHolders?.Data}
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
          />
          <div className="flex items-center self-end gap-x-2">
            <CustomButton
              buttonVariant="primary"
              buttonSize="md"
              className="font-semibold text-[14px]/[35px] xl:w-[152px]"
              type="submit"
              disabled={isStartingProcess || isFetchingManager}
              isLoading={isStartingProcess || isFetchingManager}
            >
              ثبت تیکت
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

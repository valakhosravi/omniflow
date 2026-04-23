"use client";
import AppButton from "@/components/common/AppButton/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { useForm } from "react-hook-form";
import { DevelopmentTicketFormData } from "../development.types";
import DevelopmentDescription from "./DevelopmentDescription";
import HelpFile from "./HelpFile";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useCamunda } from "@/packages/camunda";
import { useState, useEffect } from "react";
import {
  useGetDevelopmentRequestDetailsQuery,
  useLazyGetProcessUserManagerQuery,
} from "../development.services";
import {
  useGetProcessByNameAndVersionQuery,
  useGetStackHolderDirectorsQuery,
  useGetStackHoldersQuery,
} from "@/services/commonApi/commonApi";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import AdditionalInformation from "./AdditionalInformation";

export default function DevelopmentForm() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const router = useRouter();
  const { userDetail } = useAuth();
  const { startProcessWithPayload, isStartingProcess } = useCamunda();
  const [additionalDescription, setAdditionalDescription] = useState("");

  const { data: processByNameAndVersion } = useGetProcessByNameAndVersionQuery({
    processName: "Development",
    version: "3",
  });
  const [files, setFiles] = useState<FileType[] | []>([]);

  const { data: developTicketDetail } = useGetDevelopmentRequestDetailsQuery(
    Number(requestId),
    {
      skip: !requestId || Number(requestId) === 0,
    },
  );

  const [
    getProcessUserManager,
    { data: processUserManagerData, isLoading: isFetchingManager },
  ] = useLazyGetProcessUserManagerQuery();

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        Attachment: files || "",
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
        payload,
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
              label="ثبت تیکت"
              color="primary"
              type="submit"
              disabled={isStartingProcess || isFetchingManager}
              loading={isStartingProcess || isFetchingManager}
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

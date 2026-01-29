"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RHFInput from "@/ui/RHFInput";
import RHFSelect from "@/ui/RHFSelect";
import { Button } from "@heroui/react";
import { useCamunda } from "@/packages/camunda";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import useGetProcessByNameAndVersion from "@/hooks/process/useGetProcessByNameAndVersion";
import {
  useGetAllApplicationsQuery,
  useGetFeaturesByApplicationIdQuery,
} from "../api/BugFixApi";
import { useSaveProcessAttachmentMutation } from "@/services/commonApi/commonApi";
import { useGetRequestByIdQuery } from "../../task-inbox/api/RequestApi";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import { priorityLevele } from "../BugFix.const";
import { BugFixComponentType, BugInfoResponse } from "../BugFix.types";
import CustomButton from "@/ui/Button";

interface BugFixFormData {
  bugTitle: string;
  bugPriority: string;
  systemName: string;
  requestDetails: string;
  problemLink?: string;
  description?: string;
}

export default function BugFixCreateForm({
  requestId,
  data: bugInfo,
  pageType = BugFixComponentType.CREATE,
}: {
  requestId?: string;
  data?: BugInfoResponse;
  pageType?: BugFixComponentType;
}) {
  const [saveProcessAttachment] = useSaveProcessAttachmentMutation();
  const [files, setFiles] = useState<FileType[] | []>([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { userDetail } = useAuth();
  const { data: requestData } = useGetRequestByIdQuery(Number(requestId), {
    skip: !requestId,
  });
  const {
    startProcessWithPayload,
    completeTaskWithPayload,
    isStartingProcess,
  } = useCamunda();

  const { data: processByNameAndVersion } =
    useGetProcessByNameAndVersion("Bug");

  const { data: applicationsData, isLoading: isLoadingApplications } =
    useGetAllApplicationsQuery();

  const isEditMode = pageType === BugFixComponentType.EDIT;
  const taskId = searchParams?.get("taskId");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<BugFixFormData>({
    defaultValues: {
      bugTitle: "",
      bugPriority: "",
      systemName: "",
      requestDetails: "",
      problemLink: "",
      description: "",
    },
    mode: "onSubmit",
  });
  useEffect(() => {
    if (bugInfo) {
      reset({
        bugTitle: bugInfo.Title,
        requestDetails: String(bugInfo.FeatureId),
        bugPriority: String(bugInfo.Priority),
        systemName: String(bugInfo.ApplicationId),
        problemLink: bugInfo.Link,
        description: bugInfo.Description,
      });
    }
  }, [bugInfo, applicationsData]);
  // Watch systemName to fetch features when it changes
  const selectedSystemName = watch("systemName");
  const { data: featuresByAppData, isLoading: isLoadingFeaturesByApp } =
    useGetFeaturesByApplicationIdQuery(Number(selectedSystemName), {
      skip: !selectedSystemName || isNaN(Number(selectedSystemName)),
    });

  // Transform applications to options format
  const systemNameOptions = useMemo(() => {
    if (!applicationsData?.Data) return [];
    return applicationsData.Data.map((app) => ({
      label: app.Name || app.ApplicationKey || "",
      value: String(app.ApplicationId),
    }));
  }, [applicationsData]);

  const requestDetailsOptions = useMemo(() => {
    if (selectedSystemName && featuresByAppData?.Data) {
      return featuresByAppData.Data.map((feature) => ({
        label: feature.Name || "",
        value: String(feature.FeatureId),
      }));
    }
    return [];
  }, [selectedSystemName, featuresByAppData]);

  const onSubmit = async (data: BugFixFormData) => {
    const attachment =
      files.length > 0
        ? {
            Title: files[0].name,
            AttachmentKey: files[0].AttachmentKey,
            AttachmentFile: files[0].file,
          }
        : undefined;

    const createPayload = {
      PersonnelId: String(userDetail?.UserDetail.PersonnelId || ""),
      Title: data.bugTitle || "",
      ApplicationId: Number(data.systemName) || 0,
      FeatureId: Number(data.requestDetails) || 0,
      Description: data.description || "",
      Link: data.problemLink || "",
      EmployeeMobileNumber: userDetail?.UserDetail.Mobile || "",
      FileAddress: attachment?.Title || "",
      Priority: data.bugPriority,
    };
    const editPayload = {
      FeatureId: Number(data.requestDetails),
      RequestId: requestId,
      Title: data.bugTitle,
      Link: data.problemLink,
      Description: data.description,
      Priority: bugInfo?.Priority,
    };
    console.log({ createPayload });
    isEditMode && taskId
      ? await completeTaskWithPayload(taskId, editPayload).then((res) => {
          if (files.length > 0 && files[0].file)
            saveProcessAttachment({
              InstanceId: requestData?.Data?.InstanceId!,
              ProcessName: "BugFix",
              IsStart: false,
              AttachmentDetails: [
                {
                  Title: files[0].name!,
                  AttachmentKey: files[0].AttachmentKey!,
                  AttachmentFile: files[0].file,
                },
              ],
            });
          router.push("/task-inbox/requests");
        })
      : await startProcessWithPayload(
          processByNameAndVersion?.Data?.DefinitionId || "",
          createPayload
        )
          .then((res) => {
            if (files.length > 0 && files[0].file) {
              const temp = {
                InstanceId: res.id ?? "",
                ProcessName: "BugFix",
                IsStart: true,
                AttachmentDetails: [
                  {
                    Title: files[0].name!,
                    AttachmentKey: files[0].name!,
                    AttachmentFile: files[0].file,
                  },
                ],
              };
              console.log({ temp });

              saveProcessAttachment(temp);
            }
          })
          .catch((err) => {
            console.error("Error submitting bug fix form:", err);
          })
          .finally(() => {
            router.push("/task-inbox/requests");
          });
  };

  return (
    <div className="container mx-auto px-5 py-5 max-w-4xl" dir="rtl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl  p-8 border border-neutral-200 mb-0">
          {/* Header */}
          <div className="mb-[20px]">
            <h1 className="text-xl font-bold text-primary-950  mb-[6px]">
              شرح درخواست
            </h1>
            <p className="text-md text-secondary-400 mb-4">
              لطفا اطلاعات مورد نیاز را کامل کرده و روی ادامه کلیک کنید.
            </p>
          </div>

          {/* Bug priority */}
          <div className="space-y-10">
            {/* Title  */}
            <RHFInput
              name="bugTitle"
              control={control}
              label="عنوان باگ"
              placeholder=".لطفا عنوان باگ را بنویسید"
              register={register("bugTitle")}
              error={errors.bugTitle?.message}
              inputDirection="rtl"
              textAlignment="text-right"
              fullWidth
              required
            />

            <RHFSelect
              name="bugPriority"
              control={control}
              label="اولویت باگ"
              required
              readOnly={isEditMode}
              placeholder="لطفا اولویت باگ را انتخاب کنید."
              options={[
                { label: "کم", value: priorityLevele.low },
                { label: "متوسط", value: priorityLevele.medume },
                { label: "زیاد", value: priorityLevele.hight },
              ]}
              error={errors.bugPriority?.message}
              rules={{
                required: "اولویت باگ الزامی است",
              }}
              fullWidth
            />

            {/* System Name */}

            <RHFSelect
              name="systemName"
              control={control}
              label="نام سامانه"
              required
              readOnly={isEditMode}
              placeholder={
                isLoadingApplications
                  ? "در حال بارگذاری..."
                  : "نام سامانه را مشخص کنید."
              }
              options={systemNameOptions}
              error={errors.systemName?.message}
              rules={{
                required: "نام سامانه الزامی است",
              }}
              fullWidth
            />

            {/* Request Details */}
            <RHFSelect
              name="requestDetails"
              control={control}
              label="جزییات درخواست در سامانه"
              required
              placeholder={
                !selectedSystemName
                  ? "ابتدا نام سامانه را انتخاب کنید"
                  : isLoadingFeaturesByApp
                  ? "در حال بارگذاری..."
                  : "جزییات درخواست را مشخص کنید."
              }
              options={requestDetailsOptions}
              error={errors.requestDetails?.message}
              rules={{
                required: "جزییات درخواست الزامی است",
              }}
              fullWidth
            />

            {/* Problem Link */}
            <RHFInput
              name="problemLink"
              control={control}
              label="لینک مربوط به مشکل"
              placeholder="لطفا لینک مربوط به مشکل را وارد کنید."
              register={register("problemLink")}
              error={errors.problemLink?.message}
              inputDirection="ltr"
              textAlignment="text-left"
              fullWidth
            />
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4 mt-8 p-4 ">
            <h2 className="text-[16px] font-[600] border-b border-gray-200 text-primary-950 pb-3">
              اطلاعات تکمیلی
            </h2>
            <div>
              <RHFInput
                name="description"
                label="توضیحات"
                isTextarea
                register={register("description")}
                error={errors.description?.message}
                control={control}
                fullWidth
                height={100}
                inputDirection="rtl"
                textAlignment="text-right"
                placeholder="توضیحات را وارد کنید."
              />
            </div>
            <div className="w-full p-5 rounded-[20px] border border-secondary-200 space-y-4">
              <div className="space-y-1">
                <h1 className="text-primary-950 font-medium text-[20px]/[28px]">
                  بارگزاری فایل یا تصویر
                </h1>
              </div>

              <AppFile
                enableUpload={true}
                requestId={String(requestId)}
                featureName={FeatureNamesEnum.BUG_FIX}
                isMultiple={false}
                files={files}
                setFiles={setFiles}
              />
            </div>
          </div>

          {/* Submit Button */}
        </div>
        <div className="flex justify-end pt-3">
          <CustomButton
            buttonSize="sm"
            buttonVariant="primary"
            className="!rounded-[12px]"
            type="submit"
            isLoading={isStartingProcess}
            isDisabled={isStartingProcess}
          >
            ثبت
          </CustomButton>
        </div>
      </form>
    </div>
  );
}

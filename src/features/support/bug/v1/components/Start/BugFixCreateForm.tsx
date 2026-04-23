"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import AppButton from "@/components/common/AppButton/AppButton";
import { useCamunda } from "@/packages/camunda";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import useGetLastProcessByName from "@/hooks/process/useGetLastProcessByName";
import {
  useGetRequestByIdQuery,
  useSaveProcessAttachmentMutation,
} from "@/services/commonApi/commonApi";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import { BugFixComponentType, BugInfoResponse } from "../../Bug.types";
import {
  useGetAllApplicationsQuery,
  useGetFeaturesByApplicationIdQuery,
} from "../../Bug.services";
import { priorityLevele } from "../../Bug.const";

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

  const { data: processByNameAndVersion } = useGetLastProcessByName("Bug");

  const { data: applicationsData, isLoading: isLoadingApplications } =
    useGetAllApplicationsQuery();

  const isEditMode = pageType === BugFixComponentType.EDIT;
  const taskId = searchParams?.get("taskId");

  const {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugInfo, applicationsData]);

  const selectedSystemName = watch("systemName");
  const { data: featuresByAppData, isLoading: isLoadingFeaturesByApp } =
    useGetFeaturesByApplicationIdQuery(Number(selectedSystemName), {
      skip: !selectedSystemName || isNaN(Number(selectedSystemName)),
    });

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
            AttachmentKey: "bugAttachment",
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
      Title: data.bugTitle,
      Link: data.problemLink,
      Description: data.description,
      Priority: bugInfo?.Priority,
    };
    isEditMode && taskId
      ? await completeTaskWithPayload(
          taskId,
          editPayload,
          "Bug",
          String(requestData?.Data?.TrackingCode),
        ).then(() => {
          if (files.length > 0 && files[0].file)
            saveProcessAttachment({
              InstanceId: requestData?.Data?.InstanceId!,
              ProcessName: FeatureNamesEnum.BUG_FIX,
              IsStart: false,
              AttachmentDetails: [
                {
                  Title: files[0].name!,
                  AttachmentKey: "bugAttachment",
                  AttachmentFile: files[0].file,
                },
              ],
            });
          router.push("/task-inbox/requests");
        })
      : await startProcessWithPayload(
          processByNameAndVersion?.Data?.DefinitionId || "",
          createPayload,
          "Bug",
        )
          .then((res) => {
            if (files.length > 0 && files[0].file) {
              const temp = {
                InstanceId: res.id ?? "",
                ProcessName: FeatureNamesEnum.BUG_FIX,
                IsStart: true,
                AttachmentDetails: [
                  {
                    Title: files[0].name!,
                    AttachmentKey: "bugAttachment",
                    AttachmentFile: files[0].file,
                  },
                ],
              };

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
    <div className="container mx-auto mb-5" dir="rtl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl  p-8 border border-neutral-200 mb-0">
          <div className="mb-[20px]">
            <h1 className="text-xl font-bold text-primary-950  mb-[6px]">
              شرح درخواست
            </h1>
            <p className="text-md text-secondary-400 mb-4">
              لطفا اطلاعات مورد نیاز را کامل کرده و روی ادامه کلیک کنید.
            </p>
          </div>

          <div className="space-y-10">
            <Controller
              name="bugTitle"
              control={control}
              rules={{ required: "عنوان باگ الزامی است" }}
              render={({ field }) => (
                <AppInput
                  label="عنوان باگ"
                  required
                  placeholder=".لطفا عنوان باگ را بنویسید"
                  error={errors.bugTitle?.message}
                  className="w-full"
                  dir="rtl"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />

            <Controller
              name="bugPriority"
              control={control}
              rules={{ required: "اولویت باگ الزامی است" }}
              render={({ field }) => (
                <AppSelect
                  label="اولویت باگ"
                  required
                  placeholder="لطفا اولویت باگ را انتخاب کنید."
                  options={[
                    { label: "کم", value: String(priorityLevele.low) },
                    { label: "متوسط", value: String(priorityLevele.medume) },
                    { label: "زیاد", value: String(priorityLevele.hight) },
                  ]}
                  error={errors.bugPriority?.message}
                  className="w-full"
                  name={field.name}
                  defaultValue={String(field.value || "")}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    field.onChange(e.target.value)
                  }
                  onBlur={() => field.onBlur()}
                />
              )}
            />

            <Controller
              name="systemName"
              control={control}
              rules={{ required: "نام سامانه الزامی است" }}
              render={({ field }) => (
                <AppSelect
                  label="نام سامانه"
                  required
                  placeholder={
                    isLoadingApplications
                      ? "در حال بارگذاری..."
                      : "نام سامانه را مشخص کنید."
                  }
                  options={systemNameOptions}
                  error={errors.systemName?.message}
                  className="w-full"
                  name={field.name}
                  defaultValue={String(field.value || "")}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    field.onChange(e.target.value)
                  }
                  onBlur={() => field.onBlur()}
                />
              )}
            />

            <Controller
              name="requestDetails"
              control={control}
              rules={{ required: "جزییات درخواست الزامی است" }}
              render={({ field }) => (
                <AppSelect
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
                  className="w-full"
                  name={field.name}
                  defaultValue={String(field.value || "")}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    field.onChange(e.target.value)
                  }
                  onBlur={() => field.onBlur()}
                />
              )}
            />

            <Controller
              name="problemLink"
              control={control}
              render={({ field }) => (
                <AppInput
                  label="لینک مربوط به مشکل"
                  placeholder="لطفا لینک مربوط به مشکل را وارد کنید."
                  error={errors.problemLink?.message}
                  className="w-full"
                  dir="ltr"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>

          <div className="space-y-4 mt-8 p-4 ">
            <h2 className="text-[16px] font-[600] border-b border-gray-200 text-primary-950 pb-3">
              اطلاعات تکمیلی
            </h2>
            <div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <AppInput
                    label="توضیحات"
                    placeholder="توضیحات را وارد کنید."
                    error={errors.description?.message}
                    className="w-full"
                    dir="rtl"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
            </div>
            <div className="w-full space-y-4">
              <div className="space-y-1">
                <h1 className="text-primary-950 font-medium text-[16px]">
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
        </div>
        <div className="flex justify-end pt-3">
          <AppButton
            label="ثبت تیکت"
            type="submit"
            loading={isStartingProcess}
            disabled={isStartingProcess}
          />
        </div>
      </form>
    </div>
  );
}

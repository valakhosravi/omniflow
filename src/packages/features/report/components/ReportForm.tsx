"use client";
import useGetProcessByNameAndVersion from "@/hooks/process/useGetProcessByNameAndVersion";
import CustomButton from "@/ui/Button";
import RHFInput from "@/ui/RHFInput";
import { Controller, useForm } from "react-hook-form";
import {
  useGetAIMLTargetModelsQuery,
  useGetCategoriesQuery,
  useGetDataAccessClearancesQuery,
  useGetDataScopesQuery,
  useGetKpisQuery,
  useGetModelLimitationsQuery,
  useGetOutputFormatsQuery,
  useGetPrioritiesQuery,
  useGetReportUpdatePeriodsQuery,
} from "../api/ReportApi";
import RHFSelect from "@/ui/RHFSelect";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useCamunda } from "@/packages/camunda";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ReportComponentType,
  ReportFormPropsType,
  ReportTicketFormData,
} from "../types/ReportModels";
import { useEffect } from "react";
import { useGetRequestByIdQuery } from "../../task-inbox/api/RequestApi";
import AppFile from "@/components/common/AppFile";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { useSaveProcessAttachmentMutation } from "@/services/commonApi/commonApi";

export default function ReportForm({
  reportType,
  reportInfo,
}: ReportFormPropsType) {
  const router = useRouter();
  const isEditMode = reportType === ReportComponentType.EDIT;
  const requestId = Number(reportInfo?.RequestId);

  const { data: processByNameAndVersion } =
    useGetProcessByNameAndVersion("Report");

  const { data: categories } = useGetCategoriesQuery();
  const { data: priorities } = useGetPrioritiesQuery();
  const { data: outputFormats } = useGetOutputFormatsQuery();
  const { data: dataScopes } = useGetDataScopesQuery();
  const { data: kpis } = useGetKpisQuery();
  const { data: accesses } = useGetDataAccessClearancesQuery();
  const { data: AIMLTargets } = useGetAIMLTargetModelsQuery();
  const { data: modelLimitation } = useGetModelLimitationsQuery();
  const { data: updatePeriods } = useGetReportUpdatePeriodsQuery();
  const { data: requestData } = useGetRequestByIdQuery(requestId, {
    skip: !requestId,
  });

  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);
  const [
    requirementRejectDescriptionError,
    setrequirementRejectDescriptionError,
  ] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);

  const {
    startProcessWithPayload,
    completeTaskWithPayload,
    isStartingProcess,
  } = useCamunda();
  const [saveProcessAttachment] = useSaveProcessAttachmentMutation();

  const { userDetail } = useAuth();
  const searchParams = useSearchParams();

  const defaultValues = {
    order: undefined,
    purpose: "",
    requestType: undefined,
    title: "",
    description: "",
    requiredOutput: undefined,
    dataRange: undefined,
    kpis: undefined,
    filter: undefined,
    accessLevel: undefined,
    deliveryTime: "",
    modelingRequest: false,
    modelPurpose: undefined,
    targetVariable: "",
    modelLimitation: undefined,
    updatePeriod: undefined,
    requirements: "",
    needToCompare: false,
  };

  const formButtonTitle = isEditMode ? "ویرایش" : "ثبت";

  useEffect(() => {
    if (requestData?.Data) {
      reset({
        order: reportInfo?.PriorityId,
        purpose: reportInfo?.Target ?? "",
        requestType: reportInfo?.CategoryId,
        title: requestData.Data.Title,
        description: reportInfo?.Description ?? "",
        requiredOutput: reportInfo?.OutputFormatId,
        dataRange: reportInfo?.DataScopeId,
        kpis: reportInfo?.KpiId,
        filter: reportInfo?.Filters ?? "",
        accessLevel: reportInfo?.DataAccessId,
        deliveryTime: reportInfo?.DelivaryDate ?? "",
        modelingRequest: reportInfo?.IsAiml,
        modelPurpose: reportInfo?.TargetModelId,
        targetVariable: reportInfo?.TargetVariable ?? "",
        modelLimitation: reportInfo?.ModelLimitationId,
        updatePeriod: reportInfo?.ReportUpdateId,
        requirements: reportInfo?.Requirements ?? "",
        needToCompare: reportInfo?.NeedCompare,
      });
    }
  }, [requestData, reportInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue,
  } = useForm<ReportTicketFormData>({
    defaultValues,
    mode: "onSubmit",
    shouldFocusError: false,
  });

  const categoryOptions =
    categories?.Data?.map((c) => ({
      label: c.Name ?? "",
      value: c.CategoryId,
    })) ?? [];

  const prioritiesOptions =
    priorities?.Data?.map((c) => ({
      label: c.PriorityName ?? "",
      value: c.Priority,
    })) ?? [];

  const outputFormatOptions =
    outputFormats?.Data?.map((c) => ({
      label: c.OutputFormatDescription ?? "",
      value: c.OutputFormat,
    })) ?? [];

  const dataScopesOptions =
    dataScopes?.Data?.map((c) => ({
      label: c.Name ?? "",
      value: c.DataScopeId,
    })) ?? [];

  const accessOptions =
    accesses?.Data?.map((c) => ({
      label: c.DataAccessClearanceDescription ?? "",
      value: c.DataAccessClearance,
    })) ?? [];

  const AIMLTargetsOptions =
    AIMLTargets?.Data?.map((AIML) => ({
      label: AIML.TargetModelName ?? "",
      value: AIML.TargetModel,
    })) ?? [];

  const modelLimitationOptions =
    modelLimitation?.Data?.map((limit) => ({
      label: limit.ModelLimitationName ?? "",
      value: limit.ModelLimitation,
    })) ?? [];

  const updateOptions =
    updatePeriods?.Data?.map((c) => ({
      label: c.ReportUpdatePeriodName ?? "",
      value: c.ReportUpdatePeriod,
    })) ?? [];

  const modelingRequest = watch("modelingRequest");
  const onSubmit = async (data: ReportTicketFormData) => {
    const deliveryTime = data.deliveryTime
      ? new DateObject({
          date: new Date(data.deliveryTime),
          calendar: persian,
          locale: persian_fa,
        }).format("YYYY/MM/DD")
      : "";
    const createPayload = {
      PersonnelId: String(userDetail?.UserDetail?.PersonnelId) || "",
      Title: data.title,
      EmployeeMobileNumber: userDetail?.UserDetail.Mobile,
      ManagerPersonnelId: String(userDetail?.Parent.PersonnelId),
      ManagerUserId: userDetail?.Parent.UserId,
      CategoryId: data.requestType,
      PriorityId: data.order,
      Target: data.purpose,
      Description: data.description,
      OutputFormatId: data.requiredOutput,
      DataScopeId: data.dataRange,
      KpiId: data.kpis,
      Filters: data.filter,
      DataAccessId: data.accessLevel,
      DelivaryDate: deliveryTime,
      NeedCompare: data.needToCompare,
      ReportUpdateId: data.updatePeriod,
      IsAiml: data.modelingRequest ? true : false,
      TargetModelId: data.modelPurpose,
      TargetVariable: data.targetVariable,
      Requirements: data.requirements,
      ModelLimitationId: data.modelLimitation,
    };
    const editPayload = {
      CategoryId: data.requestType,
      PriorityId: data.order,
      Target: data.purpose,
      Description: data.description,
      OutputFormatId: data.requiredOutput,
      DataScopeId: data.dataRange,
      KpiId: data.kpis,
      Filters: data.filter,
      DataAccessId: data.accessLevel,
      DelivaryDate: deliveryTime,
      NeedCompare: data.needToCompare,
      ReportUpdateId: data.updatePeriod,
      IsAiml: data.modelingRequest ? true : false,
      TargetModelId: data.modelPurpose,
      TargetVariable: data.targetVariable,
      ModelLimitationId: data.modelLimitation,
      Requirements: data.requirements,
      Title: data.title,
      ReportId: reportInfo?.ReportId,
    };
    const taskId = searchParams?.get("taskId");
    try {
      isEditMode && taskId
        ? await completeTaskWithPayload(taskId, editPayload).then((res) => {
            if (files.length > 0 && files[0].file) {
              saveProcessAttachment({
                InstanceId: requestData?.Data?.InstanceId!,
                ProcessName: "Report",
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
          })
        : await startProcessWithPayload(
            processByNameAndVersion?.Data?.DefinitionId || "",
            createPayload
          ).then((res) => {
            if (files.length > 0 && files[0].file)
              saveProcessAttachment({
                InstanceId: res.id ?? "",
                ProcessName: "Report",
                IsStart: true,
                AttachmentDetails: [
                  {
                    Title: files[0].name!,
                    AttachmentKey: files[0].name!,
                    AttachmentFile: files[0].file,
                  },
                ],
              }).then((res) => {});
          });

      router.push("/task-inbox/requests");
    } catch (error) {
      console.error("Error submitting employment application:", error);
    }
  };

  return (
    <form
      className="flex flex-col space-y-4 mb-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className="max-w-[1184px] w-[1184px] p-5 rounded-[20px] 
        border border-secondary-200 space-y-4"
      >
        <div className="space-y-1">
          <h1 className="text-primary-950 font-medium text-[20px]/[28px]">
            شرح درخواست
          </h1>
          <p className="text-secondary-400 font-medium text-[14px]/[27px]">
            لطفا اطلاعات مربوط به تیکت را تکمیل کرده و روی ثبت درخواست کلیک
            کنید.
          </p>
        </div>

        <div
          className="w-full p-5 rounded-[20px] border border-secondary-200 bg-pagination-dropdown
          space-y-4"
        >
          <div className="w-full grid grid-cols-3 items-center justify-between gap-4">
            <RHFInput
              name="title"
              control={control}
              required
              label="عنوان درخواست"
              register={register("title", {
                required: "عنوان درخواست الزامی است",
              })}
              error={errors.title?.message}
              inputDirection="rtl"
              fullWidth
              height={48}
              textAlignment="text-right"
            />
            <RHFSelect
              label="نوع درخواست"
              name="requestType"
              required
              rules={{
                required: "نوع درخواست الزامی است",
              }}
              error={errors.requestType?.message}
              control={control}
              height={48}
              options={categoryOptions}
              className="w-full"
              fullWidth
            />
            <RHFSelect
              label="سطح اولویت"
              name="order"
              required
              rules={{
                required: "سطح اولویت الزامی است",
              }}
              error={errors.order?.message}
              control={control}
              height={48}
              options={prioritiesOptions}
              className="w-full"
              fullWidth
            />
            <RHFInput
              name="purpose"
              control={control}
              required
              label="هدف تجاری"
              register={register("purpose", {
                required: "هدف تجاری الزامی است",
              })}
              error={errors.purpose?.message}
              inputDirection="rtl"
              fullWidth
              height={48}
              textAlignment="text-right"
            />
            <RHFSelect
              label="نوع خروجی مورد نیاز"
              name="requiredOutput"
              required
              rules={{
                required: "نوع خروجی مورد نیاز الزامی است",
              }}
              error={errors.requiredOutput?.message}
              control={control}
              height={48}
              options={outputFormatOptions}
              className="w-full"
              fullWidth
            />
            <RHFSelect
              label="دامنه داده"
              name="dataRange"
              required
              rules={{
                required: "دامنه داده الزامی است",
              }}
              error={errors.dataRange?.message}
              control={control}
              height={48}
              options={dataScopesOptions}
              className="w-full"
              fullWidth
            />
            <Controller
              name="kpis"
              control={control}
              rules={{ required: "شاخص های دقیق مورد نیاز ضروری است." }}
              render={({ field }) => (
                <div className="flex flex-col space-y-3">
                  <label className="font-bold text-[14px]/[20px]">
                    شاخص های دقیق مورد نیاز{" "}
                    <span className="text-accent-500">*</span>
                  </label>
                  <Autocomplete
                    className="w-full"
                    variant="bordered"
                    isRequired
                    menuTrigger="focus"
                    selectedKey={
                      field.value !== undefined ? String(field.value) : null
                    }
                    onSelectionChange={(key) => {
                      const selectedValue =
                        key !== null && key !== undefined
                          ? Number(key.toString())
                          : undefined;
                      field.onChange(selectedValue);
                    }}
                    onBlur={field.onBlur}
                    // isInvalid={!!errors.kpis}
                    errorMessage={"انتخاب شاخص دقیق مورد نیاز الزامی است"}
                    popoverProps={{
                      offset: 10,
                      classNames: {
                        content: "shadow-none",
                      },
                    }}
                    inputProps={{
                      classNames: {
                        input: `font-normal text-[14px]/[20px] text-secondary-900`,
                        inputWrapper: `px-[8px] py-[6px] bg-white border-1 border-default-300 hover:border-default-300  rounded-[12px] h-[48px] min-h-[48px] shadow-none`,
                        label: `font-bold text-[14px]/[20px]`,
                      },
                    }}
                    classNames={{
                      base: `text-sm text-secondary-950 bg-transparen w-[213px]`,
                      selectorButton: `text-[#6C727F]`,
                      popoverContent: `border border-default-300`,
                    }}
                  >
                    {(kpis?.Data ?? []).map((kpi) => (
                      <AutocompleteItem
                        className="data-[selected=true]:opacity-60"
                        key={kpi.Kpiid}
                      >
                        {kpi.Name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              )}
            />
            <RHFInput
              name="filter"
              control={control}
              required
              label="پارامتر ها و فیلتر های دقیق"
              register={register("filter", {
                required: "پارامتر ها و فیلتر های دقیق الزامی است",
              })}
              error={errors.filter?.message}
              inputDirection="rtl"
              fullWidth
              height={48}
              textAlignment="text-right"
            />
            <RHFSelect
              label="سطح دسترسی"
              name="accessLevel"
              required
              rules={{
                required: "سطح دسترسی الزامی است",
              }}
              error={errors.accessLevel?.message}
              control={control}
              height={48}
              options={accessOptions}
              className="w-full"
              fullWidth
            />
            <Controller
              name="deliveryTime"
              control={control}
              rules={{ required: "زمان مورد نیاز جهت تحویل الزامی است" }}
              render={({ field }) => (
                <div className="flex flex-col">
                  <label className="font-bold text-[14px]/[20px] text-secondary-950 mb-[14px]">
                    زمان مورد نیاز جهت تحویل{" "}
                    <span className="text-accent-500">*</span>
                  </label>

                  <div className="relative bg-white border border-default-300 rounded-[12px] h-[48px] flex items-center justify-center">
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      inputClass="text-sm text-secondary-950 text-right w-full h-full px-3 outline-none border-none bg-transparent"
                      containerClassName="w-full"
                    />
                  </div>

                  {errors.deliveryTime && (
                    <p className="text-danger text-[12px]/[18px] mt-1">
                      {errors.deliveryTime.message}
                    </p>
                  )}
                </div>
              )}
            />
            <RHFSelect
              label="دوره آپدیت"
              name="updatePeriod"
              required
              rules={{
                required: "دوره آپدیت الزامی است",
              }}
              error={errors.updatePeriod?.message}
              control={control}
              height={48}
              options={updateOptions}
              className="w-full"
              fullWidth
            />
          </div>
        </div>
        <Textarea
          label="توضیحات"
          labelPlacement="outside"
          name="description"
          value={watch("description")}
          placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
          fullWidth={true}
          type="text"
          variant="bordered"
          isInvalid={!!managerRejectDescriptionError}
          errorMessage="در صورت رد یا ارجاع درخواست باید توضیحات مربوطه وارد شود."
          classNames={{
            inputWrapper: "border border-secondary-950/[.2] rounded-[16px]",
            input: "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
            label: `font-medium text-[14px]/[23px] text-secondary-950`,
          }}
          onChange={(e) => {
            setValue("description", e.target.value);
            if (managerRejectDescriptionError) {
              setManagerRejectDescriptionError(false);
            }
          }}
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
          featureName={FeatureNamesEnum.REPORT}
          isMultiple={false}
          files={files}
          setFiles={setFiles}
        />
      </div>

      <div
        className="max-w-[1184px] w-[1184px] p-5 rounded-[20px] 
        border border-secondary-200 space-y-4"
      >
        <div className="space-y-1">
          <h1 className="text-primary-950 font-medium text-[20px]/[28px]">
            فیلد های مخصوص درخواست AI / ML
          </h1>
        </div>

        <Controller
          name="needToCompare"
          control={control}
          render={({ field }) => (
            <Checkbox
              isSelected={field.value}
              onChange={(checked) => field.onChange(checked)}
              classNames={{
                wrapper: "relative after:bg-primary-950",
              }}
            >
              <div className="font-medium text-[16px]/[30px] text-[#26272B]">
                نیاز به مقایسه با دوره قبل
              </div>
            </Checkbox>
          )}
        />

        <div className="flex flex-col gap-y-4">
          <div>
            <Controller
              name="modelingRequest"
              control={control}
              render={({ field }) => (
                <Checkbox
                  isSelected={field.value}
                  onChange={(checked) => field.onChange(checked)}
                  classNames={{
                    wrapper: "relative after:bg-primary-950",
                  }}
                >
                  <div className="font-medium text-[16px]/[30px] text-[#26272B]">
                    درخواست مدل سازی
                  </div>
                </Checkbox>
              )}
            />

            {errors.modelingRequest && (
              <p className="text-trash text-[12px]">
                {errors.modelingRequest.message}
              </p>
            )}
          </div>
          {modelingRequest && (
            <>
              <RHFSelect
                label="هدف مدل"
                name="modelPurpose"
                required={modelingRequest}
                rules={{ required: "هدف مدل الزامی است" }}
                error={errors.modelPurpose?.message}
                control={control}
                height={48}
                register={register("modelPurpose", {
                  required: "fofofofo",
                })}
                options={AIMLTargetsOptions}
                className="w-full"
                fullWidth
              />
              <RHFInput
                name="targetVariable"
                control={control}
                required={modelingRequest}
                label="متغیر هدف"
                register={register("targetVariable", {
                  required: "متغیر هدف الزامی است",
                })}
                error={errors.targetVariable?.message}
                inputDirection="rtl"
                fullWidth
                height={48}
                textAlignment="text-right"
              />
              <RHFSelect
                label="محدودیت های مدل"
                name="modelLimitation"
                required={modelingRequest}
                rules={{
                  required: "محدودیت های مدل الزامی است",
                }}
                error={errors.modelLimitation?.message}
                control={control}
                height={48}
                options={modelLimitationOptions}
                className="w-full"
                fullWidth
              />
              <Textarea
                label="داده های آموزشی موجود یا نیازمند جمع آوری"
                labelPlacement="outside"
                name="requirements"
                value={watch("requirements")}
                placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
                fullWidth={true}
                type="text"
                isRequired={modelingRequest}
                variant="bordered"
                errorMessage="توضیحات داده های آموزشی موجود یا نیازمند جمع آوری الزامی است"
                classNames={{
                  inputWrapper:
                    "border border-secondary-950/[.2] rounded-[16px]",
                  input:
                    "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
                  label: `font-medium text-[14px]/[23px] text-secondary-950`,
                }}
                required={modelingRequest}
                onChange={(e) => {
                  setValue("requirements", e.target.value);
                  if (requirementRejectDescriptionError) {
                    setrequirementRejectDescriptionError(false);
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
      <CustomButton
        buttonVariant="primary"
        buttonSize="md"
        className="font-semibold text-[14px]/[35px] xl:w-[152px] self-end"
        type="submit"
        disabled={isStartingProcess}
        isLoading={isStartingProcess}
      >
        {formButtonTitle}
      </CustomButton>
    </form>
  );
}

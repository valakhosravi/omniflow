"use client";
import { Controller, useFormContext } from "react-hook-form";
import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import { Textarea } from "@heroui/react";
import AppMultiSelect from "@/components/common/AppMultiSelect";
import AppDatePicker from "@/components/common/AppDatePicker";
import {
  KPI_OTHER_KEY,
  ReportComponentType,
  type ReportTicketFormData,
  type SelectOption,
} from "../reportV1.types";
import { KPI_OPTIONS } from "../utils/report-form-config";

type ReportRequestDescriptionSectionProps = {
  reportType: ReportComponentType;
  options: {
    category: SelectOption[];
    priority: SelectOption[];
    outputFormat: SelectOption[];
    dataScope: SelectOption[];
    access: SelectOption[];
    updatePeriod: SelectOption[];
  };
};

export default function ReportRequestDescriptionSection({
  options,
  reportType,
}: ReportRequestDescriptionSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ReportTicketFormData>();

  return (
    <div
      className="max-w-[1184px] w-[1184px] p-5 rounded-[20px]
      border border-secondary-200 space-y-4"
    >
      <div className="space-y-1">
        <h1 className="text-primary-950 font-medium text-[16px]">
          شرح درخواست
        </h1>
        <p className="text-secondary-400 font-medium text-[14px]/[27px]">
          لطفا اطلاعات مربوط به تیکت را تکمیل کرده و روی ثبت درخواست کلیک کنید.
        </p>
      </div>

      <div
        className="w-full p-5 rounded-[20px] border border-secondary-200 bg-pagination-dropdown
        space-y-4"
      >
        <div className="w-full grid grid-cols-3 items-center justify-between gap-4">
          <AppInput
            {...(reportType == ReportComponentType.CREATE
              ? register("title", {
                  required: "عنوان درخواست الزامی است",
                })
              : register("title"))}
            label="عنوان درخواست"
            required={reportType == ReportComponentType.CREATE}
            error={errors.title?.message}
            readOnly={reportType == ReportComponentType.EDIT}
            className="w-full"
            dir="rtl"
          />
          <Controller
            name="requestType"
            control={control}
            rules={{ required: "نوع درخواست الزامی است" }}
            render={({ field }) => (
              <AppSelect
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="نوع درخواست"
                required
                error={errors.requestType?.message}
                options={options.category}
                className="w-full"
              />
            )}
          />
          <Controller
            name="order"
            control={control}
            rules={{ required: "سطح اولویت الزامی است" }}
            render={({ field }) => (
              <AppSelect
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="سطح اولویت"
                required
                error={errors.order?.message}
                options={options.priority}
                className="w-full"
              />
            )}
          />
          <AppInput
            {...register("purpose", {
              required: "هدف تجاری الزامی است",
            })}
            required
            label="هدف تجاری"
            error={errors.purpose?.message}
            className="w-full"
            dir="rtl"
          />
          <Controller
            name="requiredOutput"
            control={control}
            rules={{ required: "نوع خروجی مورد نیاز الزامی است" }}
            render={({ field }) => (
              <AppSelect
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="نوع خروجی مورد نیاز"
                required
                error={errors.requiredOutput?.message}
                options={options.outputFormat}
                className="w-full"
              />
            )}
          />
          <Controller
            name="dataRange"
            control={control}
            rules={{ required: "دامنه داده الزامی است" }}
            render={({ field }) => (
              <AppSelect
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="دامنه داده"
                required
                error={errors.dataRange?.message}
                options={options.dataScope}
                className="w-full"
              />
            )}
          />
          <Controller
            name="kpis"
            control={control}
            rules={{
              required: "شاخص های دقیق مورد نیاز ضروری است.",
              validate: (value) => {
                if (!value || value.length === 0) {
                  return "انتخاب شاخص دقیق مورد نیاز الزامی است";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Controller
                name="kpisOther"
                control={control}
                rules={{
                  validate: (value, formValues) => {
                    if (
                      formValues.kpis?.includes(KPI_OTHER_KEY) &&
                      !value?.trim()
                    ) {
                      return "در صورت انتخاب سایر، مشخصات شاخص الزامی است";
                    }
                    return true;
                  },
                }}
                render={({ field: otherField }) => (
                  <AppMultiSelect
                    showSearch={false}
                    maxDisplayItems={2}
                    items={KPI_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    label="شاخص های دقیق مورد نیاز"
                    required
                    placeholder="شاخص مورد نظر را انتخاب کنید"
                    error={errors.kpis?.message}
                    otherOptionKey={KPI_OTHER_KEY}
                    otherOptionLabel="سایر"
                    otherValue={otherField.value ?? ""}
                    onOtherChange={otherField.onChange}
                    onOtherBlur={otherField.onBlur}
                    otherLabel="مشخصات شاخص سایر"
                    otherPlaceholder="شاخص مورد نظر را به صورت دستی وارد کنید"
                    otherError={errors.kpisOther?.message}
                  />
                )}
              />
            )}
          />
          <AppInput
            {...register("filter", {
              required: "پارامتر ها و فیلتر های دقیق الزامی است",
            })}
            required
            label="پارامتر ها و فیلتر های دقیق"
            error={errors.filter?.message}
            className="w-full"
            dir="rtl"
          />
          <Controller
            name="accessLevel"
            control={control}
            rules={{ required: "سطح دسترسی الزامی است" }}
            render={({ field }) => (
              <AppSelect
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="سطح دسترسی"
                required
                error={errors.accessLevel?.message}
                options={options.access}
                className="w-full"
              />
            )}
          />
          <Controller
            name="deliveryTime"
            control={control}
            rules={{ required: "زمان مورد نیاز جهت تحویل الزامی است" }}
            render={({ field }) => (
              <AppDatePicker
                label="زمان مورد نیاز جهت تحویل"
                required
                height={48}
                cellWidth={36}
                cellHeight={36}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.deliveryTime?.message}
              />
            )}
          />
          <Controller
            name="updatePeriod"
            control={control}
            rules={{ required: "دوره آپدیت الزامی است" }}
            render={({ field }) => (
              <AppSelect
                ref={field.ref}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="دوره آپدیت"
                required
                error={errors.updatePeriod?.message}
                options={options.updatePeriod}
                className="w-full"
              />
            )}
          />
        </div>
      </div>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea
            label="توضیحات"
            labelPlacement="outside"
            placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
            fullWidth={true}
            type="text"
            variant="bordered"
            classNames={{
              inputWrapper: "border border-secondary-950/[.2] rounded-[16px]",
              input:
                "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
              label: "font-medium text-[14px]/[23px] text-secondary-950",
            }}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
    </div>
  );
}

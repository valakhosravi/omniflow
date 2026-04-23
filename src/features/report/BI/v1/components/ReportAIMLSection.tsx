"use client";
import { Controller, useFormContext } from "react-hook-form";
import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import { Checkbox, Textarea } from "@heroui/react";
import { ReportTicketFormData } from "../reportV1.types";
import type { SelectOption } from "../reportV1.types";

type ReportAIMLSectionProps = {
  options: {
    AIMLTarget: SelectOption[];
    modelLimitation: SelectOption[];
  };
};

export default function ReportAIMLSection({ options }: ReportAIMLSectionProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ReportTicketFormData>();

  const modelingRequest = watch("modelingRequest");

  return (
    <div
      className="max-w-[1184px] w-[1184px] p-5 rounded-[20px]
      border border-secondary-200 space-y-4"
    >
      <div className="space-y-1">
        <h1 className="text-primary-950 font-medium text-[16px]">
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
            <Controller
              name="modelPurpose"
              control={control}
              rules={{ required: "هدف مدل الزامی است" }}
              render={({ field }) => (
                <AppSelect
                  ref={field.ref}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="هدف مدل"
                  required={modelingRequest}
                  error={errors.modelPurpose?.message}
                  options={options.AIMLTarget}
                  className="w-full"
                />
              )}
            />
            <AppInput
              {...register("targetVariable", {
                required: "متغیر هدف الزامی است",
              })}
              required={modelingRequest}
              label="متغیر هدف"
              error={errors.targetVariable?.message}
              className="w-full"
              dir="rtl"
            />
            <Controller
              name="modelLimitation"
              control={control}
              rules={{ required: "محدودیت های مدل الزامی است" }}
              render={({ field }) => (
                <AppSelect
                  ref={field.ref}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="محدودیت های مدل"
                  required={modelingRequest}
                  error={errors.modelLimitation?.message}
                  options={options.modelLimitation}
                  className="w-full"
                />
              )}
            />
            <Controller
              name="requirements"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="داده های آموزشی موجود یا نیازمند جمع آوری"
                  labelPlacement="outside"
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
                    label: "font-medium text-[14px]/[23px] text-secondary-950",
                  }}
                  required={modelingRequest}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </>
        )}
      </div>
    </div>
  );
}

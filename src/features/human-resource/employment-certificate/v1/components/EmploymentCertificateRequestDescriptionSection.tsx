import React from "react";
import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import AutoFilledInformationSection from "./EmploymentCertificateAutoFilledInformationSection";
import type { RequestDescriptionSectionProps } from "../employment-certificate.types";

export default function RequestDescriptionSection({
  register,
  errors,
  autoFilledData,
}: RequestDescriptionSectionProps) {
  return (
    <>
      <div className="border border-neutral-200 p-4 rounded-[20px] mb-3">
        <div className="mb-5">
          <div className="mb-2 text-lg text-brand font-medium">شرح درخواست</div>
          <div className="text-sm text-color-neutral-500">
            لطفا سازمان یا اداره هدف را جهت نامه اشتغال به کار تکمیل کرده و
            درخواست خود را ثبت کنید.
          </div>
        </div>
        <div className="flex justify-between items-center gap-6">
          <AppInput
            {...register("ReceiverOrganization", {
              required: "لطفا نام سازمان یا اداره را وارد کنید",
              validate: (value: string) => {
                if (!value || !value.trim()) {
                  return "لطفا نام سازمان یا اداره را وارد کنید";
                }
                return true;
              },
            })}
            className="flex-1"
            label="سازمان / اداره هدف"
            placeholder="نام سازمان یا اداره را وارد کنید"
            required
            error={errors.ReceiverOrganization?.message}
            data-cy="receiver-organization-input"
          />
          <AppInput
            {...register("ForReason")}
            className="flex-1"
            label="جهت"
            placeholder="هدف از درخواست (اختیاری)"
            labelExtension={
              <span className="text-sm text-color-neutral-500 font-normal">
                (اختیاری)
              </span>
            }
            error={errors.ForReason?.message}
            data-cy="for-reason-input"
          />
          <AppSelect
            {...register("Language", {
              required: "انتخاب زبان نامه",
            })}
            className="flex-1"
            label="انتخاب زبان نامه"
            placeholder="زبان نامه را انتخاب کنید"
            required
            error={errors.Language?.message}
            options={[{ label: "فارسی", value: "fa" }]}
            defaultValue="fa"
            data-cy="language-select"
          />
        </div>
      </div>
      <div className="border border-neutral-200 p-4 rounded-[20px] mb-3 w-full">
        <AutoFilledInformationSection data={autoFilledData} />
      </div>
    </>
  );
}

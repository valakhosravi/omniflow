import React from "react";
import RHFInput from "@/ui/RHFInput";
import RHFSelect from "@/ui/RHFSelect";
import AutoFilledInformationSection from "./AutoFilledInformationSection";

interface RequestDescriptionSectionProps {
  register: any;
  errors: any;
  watchedValues: any;
  control: any;
}

export default function RequestDescriptionSection({
  register,
  errors,
  watchedValues,
  control,
}: RequestDescriptionSectionProps) {
  const languageOptions = [
    { label: "فارسی", value: "fa" },
    // { label: "انگلیسی", value: "en" },
  ];

  return (
    <div className="border border-[#D8D9DF] p-[12px] rounded-[20px] mb-[12px] w-[1024px] md:w-[1095px]">
      <div className="border border-[#D8D9DF] p-[12px] rounded-[16px] bg-[#F8F9FA] mb-[20px]">
        <div className="mb-[20px]">
          <div className="mb-[4px] text-[20px] text-[#1C3A63]">شرح درخواست</div>
          <div className="text-[14px] text-[#8F94A1]">
            لطفا سازمان یا اداره هدف را جهت نامه اشتغال به کار تکمیل کرده و
            درخواست خود را ثبت کنید.
          </div>
        </div>
        <div className="flex justify-between items-center gap-[24px]">
          <RHFInput
            name="ReceiverOrganization"
            containerClassName="flex-1"
            label="سازمان / اداره هدف"
            placeholder="نام سازمان یا اداره را وارد کنید"
            width={205}
            required
            register={register("ReceiverOrganization", {
              required: "لطفا نام سازمان یا اداره را وارد کنید",
              validate: (value: string) => {
                if (!value || !value.trim()) {
                  return "لطفا نام سازمان یا اداره را وارد کنید";
                }
                return true;
              },
            })}
            error={errors.ReceiverOrganization?.message}
            inputDirection="rtl"
            textAlignment="text-right"
            data-cy="receiver-organization-input"
          />
          <RHFInput
            containerClassName="flex-1"
            name="ForReason"
            label="جهت"
            placeholder="هدف از درخواست (اختیاری)"
            width={205}
            labelExention={
              <span className="text-[14px] text-[#8F94A1] font-[400]">
                (اختیاری)
              </span>
            }
            register={register("ForReason")}
            error={errors.ForReason}
            inputDirection="rtl"
            textAlignment="text-right"
            data-cy="for-reason-input"
          />
          <RHFSelect
            containerClassName="flex-1"
            name="Language"
            label="انتخاب زبان نامه"
            placeholder="زبان نامه را انتخاب کنید"
            width={205}
            required
            control={control}
            rules={{
              required: "انتخاب زبان نامه",
              validate: (value: any) => value !== 0 || "انتخاب زبان نامه",
            }}
            register={register}
            error={errors.Language}
            options={languageOptions}
            defaultValue="fa"
            data-cy="language-select"
          />
        </div>
      </div>
      <AutoFilledInformationSection />
    </div>
  );
}

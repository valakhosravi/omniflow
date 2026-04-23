import React from "react";
import { useForm } from "react-hook-form";
import type { AutoFilledData } from "../employment-certificate.types";
import AppInput from "@/components/common/AppInput";
import { AppIcon } from "@/components/common/AppIcon";

interface AutoFilledInformationSectionProps {
  data: AutoFilledData;
}

export default function AutoFilledInformationSection({
  data,
}: AutoFilledInformationSectionProps) {
  const { register } = useForm({ defaultValues: data });

  return (
    <div>
      <div className="mb-2 text-sm text-color-neutral-500 flex items-center">
        <AppIcon name="InfoCircle" className="size-4" />
        <span className="ms-1">اطلاعات زیر به صورت خودکار درج شده‌اند و امکان تغییر آن وجود ندارد.</span>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <AppInput
          {...register("fullName")}
          label="نام و نام خانوادگی"
          readOnly
          tabIndex={-1}
        />
        <AppInput
          {...register("fatherName")}
          label="نام پدر"
          readOnly
          tabIndex={-1}
        />
        <AppInput
          {...register("nationalCode")}
          label="کدملی"
          readOnly
          tabIndex={-1}
        />
        <AppInput
          {...register("jobPosition")}
          label="سمت شغلی"
          readOnly
          tabIndex={-1}
        />
        <AppInput
          {...register("mobile")}
          label="شماره تماس"
          readOnly
          tabIndex={-1}
        />
        <AppInput
          {...register("startDate")}
          label="تاریخ استخدام"
          readOnly
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

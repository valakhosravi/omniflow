import React from "react";
import RHFInput from "@/ui/RHFInput";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useForm } from "react-hook-form";

export default function AutoFilledInformationSection() {
  const { userDetail } = useAuth();

  const { control } = useForm({
    defaultValues: {
      fullName: userDetail?.UserDetail?.FullName || "",
      fatherName: userDetail?.UserDetail?.FatherName || "",
      nationalCode: userDetail?.UserDetail?.NationalCode || "",
      jobPosition: userDetail?.UserDetail?.Title || "",
      mobile: userDetail?.UserDetail?.Mobile || "",
      startDate: userDetail?.UserDetail?.EmploymentDate
        ? new Date(userDetail?.UserDetail?.EmploymentDate)
            .toLocaleString("fa-IR")
            .split(", ")[0]
        : "",
    },
  });

  return (
    <div className="">
      <div className="text-[14px] text-[#8F94A1] mb-[12px]">
        اطلاعات زیر به صورت خودکار درج شده‌اند و امکان تغییر آن وجود ندارد.
      </div>
      <div className="grid grid-cols-3 gap-[24px]">
        <RHFInput
          textAlignment="text-right"
          tabIndex={-1}
          name="fullName"
          label="نام و نام خانوادگی"
          placeholder=""
          width={205}
          readOnly
          control={control}
        />
        <RHFInput
          textAlignment="text-right"
          tabIndex={-1}
          name="fatherName"
          label="نام پدر"
          placeholder=""
          width={205}
          readOnly
          control={control}
        />
        <RHFInput
          tabIndex={-1}
          name="nationalCode"
          label="کدملی"
          placeholder=""
          width={205}
          readOnly
          control={control}
        />
        <RHFInput
          textAlignment="text-right"
          tabIndex={-1}
          name="jobPosition"
          label="سمت شغلی"
          placeholder=""
          width={205}
          readOnly
          control={control}
        />
        <RHFInput
          tabIndex={-1}
          name="mobile"
          label="شماره تماس"
          placeholder=""
          width={205}
          readOnly
          control={control}
        />
        <RHFInput
          tabIndex={-1}
          name="startDate"
          label="تاریخ استخدام"
          placeholder=""
          width={205}
          readOnly
          control={control}
        />
      </div>
    </div>
  );
}

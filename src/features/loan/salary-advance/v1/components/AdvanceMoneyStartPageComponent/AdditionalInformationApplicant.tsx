"use client";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { toPersianDurationFromNow } from "../../utils/toPersianDurationFromNow";
import { toLocalDateShort } from "@/utils/dateFormatter";
import WarningBadge from "@/ui/WarningBadge";
import { getMonthsDifference } from "../../utils/ruleEngine";

export default function AdditionalInformationApplicant({
  employmentDurationThreshold,
}: {
  employmentDurationThreshold: number;
}) {
  const { userDetail } = useAuth();

  const employmentDate = userDetail?.UserDetail.EmploymentDate
    ? new Date(userDetail.UserDetail.EmploymentDate)
    : null;
  const currentDate = new Date();
  const monthsSinceEmployment = employmentDate
    ? getMonthsDifference(employmentDate, currentDate)
    : 0;

  return (
    <div className="p-4 rounded-[20px] bg-secondary-50">
      <h1 className="text-primary-950">اطلاعات تکمیلی درخواست دهنده مساعده</h1>
      <div className="w-[337px] bg-secondary-100 my-[13px] h-[1px]" />
      <div className="flex items-center justify-between font-medium text-[14px]/[27px] mb-1">
        <div>
          <span className="text-secondary-400">تاریخ استخدام </span>
          <span className="text-primary-950">
            (
            {toPersianDurationFromNow(
              userDetail?.UserDetail.EmploymentDate ?? "",
            )}
            )
          </span>
        </div>
        <div className="text-primary-950">
          {toLocalDateShort(userDetail?.UserDetail.EmploymentDate ?? "")}
        </div>
      </div>
      {monthsSinceEmployment >= employmentDurationThreshold ? (
        <div className="font-medium text-[12px]/[22px] text-[#8F94A1]">
          از تاریخ استخدام باید ۶ ماه گذشته باشد.
        </div>
      ) : (
        <WarningBadge
          message={`تاریخ استخدام شما کمتر از ${employmentDurationThreshold} ماه گذشته است.`}
        />
      )}
    </div>
  );
}

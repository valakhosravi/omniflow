import AppInfoRow from "@/components/common/AppInfoRow/AppInfoRow";
import { LoanRequestDetails } from "@/models/advance-money/LoanRequestDetails";
import { SalaryAdvancedPaidRequest } from "@/models/advance-money/SalaryAdvancedPaidRequest";
import { EmployeeInfo } from "@/models/employmentCertificate/human-resource/EmployeeInfo";
import { formatTimePeriod } from "@/utils/dateFormatter";
import {
  Calendar,
  Card,
  CardCoin,
  Coin,
  Location,
  Money,
  PercentageCircle,
  PercentageSquare,
  SmsTracking,
  User,
  UserSquare,
  UserTag,
  Warning2,
} from "iconsax-reactjs";

interface SummaryOfRequestProps {
  StatusCode: number | undefined;
  userData: EmployeeInfo | undefined;
  loanRequestDetails: LoanRequestDetails | undefined;
  formKey: string;
  salaryAdvancedPaidRequest: SalaryAdvancedPaidRequest[] | undefined;
  trackingCode: number | undefined;
}

export default function SummaryOfRequest({
  StatusCode,
  userData,
  loanRequestDetails,
  formKey,
  salaryAdvancedPaidRequest,
  trackingCode,
}: SummaryOfRequestProps) {
  const infoRows = [
    {
      icon: <User size={16} />,
      title: "نام و نام خانوادگی",
      value: userData?.FullName || "",
    },
    // {
    //   icon: <PercentageSquare size={16} />,
    //   title: "درصد مساعده درخواستی",
    //   value: `${(loanRequestDetails?.AmountRatio ?? 1) * 100}%`,
    // },
    {
      icon: <UserTag size={16} />,
      title: "شماره پرسنلی",
      value: Number(userData?.PersonnelId) || "",
    },
    {
      icon: <SmsTracking size={16} />,
      title: "کد پیگیری",
      value: Number(trackingCode) || "",
    },
    {
      icon: <UserTag size={16} />,
      title: "سمت",
      value: userData?.Title || "",
    },
    // Conditionally include Amount only if it has a value
    ...(loanRequestDetails?.Amount
      ? [
          {
            icon: <Coin size={16} />,
            title: "مبلغ درخواستی",
            value: `${loanRequestDetails.Amount.toLocaleString()} ریال`,
          },
        ]
      : []),
    // Conditionally include percentage field only for salary-advance-request-hrh-check formKey
    ...(formKey === "salary-advance-request-hrh-check" ||
    formKey === "salary-advance-request-pre-check"
      ? [
          {
            icon: <PercentageCircle size={16} />,
            title: "درصد درخواست مساعده",
            value: `${(loanRequestDetails?.AmountRatio || 0) * 100}%`,
          },
        ]
      : []),
    ...(formKey === "salary-advance-request-hrh-check" ||
    formKey === "salary-advance-request-pre-check"
      ? [
          {
            icon: <PercentageCircle size={16} />,
            title: "امکان درخواست حداکثر ",
            value: `${loanRequestDetails?.MaxLoansPerMonth || 0} بار در سال`,
          },
        ]
      : []),
    ...(formKey === "salary-advance-request-hrh-check" ||
    formKey === "salary-advance-request-hrm-check" ||
    formKey === "salary-advance-request-pre-check"
      ? [
          {
            icon: <Warning2 size={16} />,
            title: "دارای شرایط خاص",
            value: loanRequestDetails?.IsStandard ? (
              <div className="text-[14px] font-bold">خیر</div>
            ) : (
              <div className="text-[14px] font-bold">بله</div>
            ),
          },
        ]
      : []),
    ...(formKey === "salary-advance-request-pre-check"
      ? [
          {
            icon: <Calendar size={16} />,
            title: "تعداد ماه بازپرداخت",
            value: `${loanRequestDetails?.RepaymentMonth || 0} ماه`,
          },
        ]
      : []),
    ...(formKey === "salary-advance-request-hrh-check"
      ? [
          {
            icon: <Money size={16} />,
            title: "تعداد درخواست های ثبت شده در سال",
            value: `${
              salaryAdvancedPaidRequest?.length &&
              salaryAdvancedPaidRequest?.length > 0
                ? salaryAdvancedPaidRequest.length
                : "0"
            }`,
          },
        ]
      : []),
    ...(formKey === "salary-advance-request-hrh-check"
      ? [
          {
            icon: <Calendar size={16} />,
            title: "تاریخ استخدام",
            value: (
              <div>
                <span>
                  {new Date(userData?.EmploymentDate || "")
                    .toLocaleString("fa-IR")
                    .split(", ")[0] || ""}
                </span>
                <span className="text-xs text-[#1C3A6399]">
                  {userData?.EmploymentDate
                    ? ` (${formatTimePeriod(userData.EmploymentDate)})`
                    : ""}
                </span>
              </div>
            ),
          },
        ]
      : []),
    ...(formKey === "salary-advance-request-hrh-check"
      ? [
          {
            icon: <CardCoin size={16} />,
            title: "کد ملی",
            value: userData?.NationalCode || "",
          },
        ]
      : []),
    ...(formKey === "salary-advance-request-te-check" &&
    loanRequestDetails?.Destination
      ? [
          {
            icon: <CardCoin size={16} />,
            title: "مقصد",
            value: loanRequestDetails.Destination,
          },
        ]
      : []),
  ];

  return (
    <div
      className={`rounded-[20px] border border-[#1C3A631A] bg-[#f8f9fa] p-4 ${
        (StatusCode === 100 || StatusCode === 112) && "mb-4"
      }`}
    >
      <div className="text-[14px] text-[#1C3A63] font-[500] mb-4 pb-3 border-b border-[#1C3A631A]">
        خلاصه درخواست مساعده
      </div>
      <div className="flex flex-col gap-4">
        {infoRows.map((item, index) => (
          <AppInfoRow
            key={index}
            icon={item.icon}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
}

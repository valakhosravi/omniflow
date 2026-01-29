import {
  Buildings,
  Card,
  Chart,
  Code,
  Copy,
  Document,
  DocumentText,
  Export,
  Flag,
  NoteText,
  People,
  Profile2User,
  Setting,
  SmsTracking,
  Subtitle,
  TickCircle,
  User,
} from "iconsax-reactjs";
import { Chip } from "@heroui/react";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { useGetEmployeeInfoByPersonnelId } from "@/hooks/process/useHumanResource";
import AppInfoRow from "@/components/common/AppInfoRow/AppInfoRow";
import { useEffect, useMemo } from "react";
import {
  GetDevelopmentRequestDetailsModel,
  GetDevelopmentTicketModel,
} from "../../types/DevelopmentRequests";
import { useGetDevelopmentRequestDetailsQuery } from "../../api/developmentApi";

interface RequestSummaryProps {
  requestId: string;
  developRequestDetails: GeneralResponse<GetDevelopmentTicketModel> | undefined;
  setDevelopmentData?: (data: GetDevelopmentRequestDetailsModel) => void;
}

export default function RequestSummary({
  requestId,
  developRequestDetails,
  setDevelopmentData,
}: RequestSummaryProps) {
  const { data: developTicketDetail, isLoading } =
    useGetDevelopmentRequestDetailsQuery(Number(requestId));

  useEffect(() => {
    if (developTicketDetail?.Data && setDevelopmentData) {
      setDevelopmentData(developTicketDetail.Data);
    }
  }, [developTicketDetail]);

  const { employeeInfoData } = useGetEmployeeInfoByPersonnelId(
    developRequestDetails?.Data?.PersonnelId
  );

  const data = developTicketDetail?.Data;

  const formData = useMemo(() => {
    const baseData = [
      {
        icon: <User size={16} />,
        title: "نام و نام خانوادگی",
        value: employeeInfoData?.Data?.FullName || data?.FullName || "",
      },
      {
        icon: <Profile2User size={16} />,
        title: "سمت",
        value: employeeInfoData?.Data?.Title || "",
      },
      {
        icon: <Card size={16} />,
        title: "کد پرسنلی",
        value: employeeInfoData?.Data?.PersonnelId || "",
      },
      {
        icon: <Document size={16} />,
        title: "نوع درخواست",
        value: data?.RequestTypeName,
      },
      {
        icon: <Flag size={16} />,
        title: "اولویت",
        value: (
          <Chip
            className={`!font-medium !text-[12px]/[22px] rounded-[24px] 
            py-[7px] px-[15px] h-[32px] ${
              data?.PriorityName === "کم" || data?.PriorityName === "پایین"
                ? "text-blue-600 bg-blue-100"
                : data?.PriorityName === "متوسط"
                ? "text-yellow-600 bg-yellow-100"
                : data?.PriorityName === "بالا"
                ? "text-red-600 bg-red-100"
                : ""
            }`}
          >
            {data?.PriorityName}
          </Chip>
        ),
      },
      {
        icon: <Subtitle size={16} />,
        title: "عنوان درخواست",
        value: developRequestDetails?.Data?.Title || "",
      },
      {
        icon: <SmsTracking size={16} />,
        title: "کد پیگیری",
        value: Number(developRequestDetails?.Data?.TrackingCode) || "",
      },
      {
        icon: <Buildings size={16} />,
        title: "نام واحد درخواست دهنده",
        value: data?.DeputyName || "",
      },
      {
        icon: <Profile2User size={16} />,
        title: "مدیر تماس ذینفع",
        value: data?.StackHolderContactDirector || "",
      },
      {
        icon: <Copy size={16} />,
        title: "آیا فرآیند مشابهی وجود دارد؟",
        value: data?.HasSimilarProcessName || "",
      },
      {
        icon: <TickCircle size={16} />,
        title: "آیا منطبق با الزامات مقرراتی است؟",
        value: data?.IsRegulatoryCompliantName || "",
      },
      {
        icon: <People size={16} />,
        title: "مشتریان ذینفع",
        value: data?.BeneficialCustomers || "",
      },
      {
        icon: <NoteText size={16} />,
        title: "توضیحات استفاده مشتری",
        value: data?.CustomerUsageDescription || "",
        isTextArea: true,
      },
      {
        icon: <Setting size={16} />,
        title: "چه ویژگی‌هایی مد نظر است؟",
        value: data?.RequestedFeatures || "",
        isTextArea: true,
      },
      {
        icon: <DocumentText size={16} />,
        title: "به گزارشات نیاز است؟",
        value: data?.IsReportRequired ? "بله" : "خیر",
      },
      {
        icon: <Export size={16} />,
        title: "خروجی مورد نظر چیست؟",
        value: data?.ExpectedOutput || "",
      },
      {
        icon: <Code size={16} />,
        title:
          "جزییات فنی مانند یکپارچگی با سیستم‌های دیگر و یا پلتفرم‌ها به چه صورت است؟",
        value: data?.TechnicalDetails || "",
        isTextArea: true,
      },
      {
        icon: <Chart size={16} />,
        title: "شاخص های اصلی سنجش عملکرد سیستم چیست؟",
        value: data?.Kpi || "",
      },
      {
        icon: <Document size={16} />,
        title: "شماره نامه های مرتبط (در صورت وجود)",
        value: data?.LetterNumber || "",
      },
      // {
      //   icon: <User size={16} />,
      //   title: "ذینفع",
      //   value: data?.StackHolder || "",
      // },
      {
        icon: <NoteText size={16} />,
        title: "توضیحات پروژه",
        type: "description",
        value: data?.Description,
        isTextArea: true,
      },
      {
        icon: <DocumentText size={16} />,
        title: "توضیحات اضافی پروژه",
        type: "description",
        value: data?.ExtraDescription || "",
        isTextArea: true,
      },
    ];

    // Conditionally add fields
    if (data?.HasSimilarProcess === 1 && data?.SimilarProcessDescription) {
      baseData.splice(10, 0, {
        icon: <NoteText size={16} />,
        title: "توضیحات فرآیند مشابه",
        value: data.SimilarProcessDescription,
        isTextArea: true,
      });
    }

    if (
      data?.IsRegulatoryCompliant === 2 &&
      data?.RegulatoryCompliantDescription
    ) {
      const insertIndex =
        baseData.findIndex(
          (item) => item.title === "آیا منطبق با الزامات مقرراتی است؟"
        ) + 1;
      baseData.splice(insertIndex, 0, {
        icon: <NoteText size={16} />,
        title: "توضیحات عدم انطباق با الزامات مقرراتی",
        value: data.RegulatoryCompliantDescription,
        isTextArea: true,
      });
    }

    if (data?.IsReportRequired && data?.ReportPath) {
      const insertIndex =
        baseData.findIndex((item) => item.title === "به گزارشات نیاز است؟") + 1;
      baseData.splice(insertIndex, 0, {
        icon: <DocumentText size={16} />,
        title: "گزارشات فعلی در چه مسیری ارائه می شود؟",
        value: data.ReportPath,
      });
    }

    return baseData;
  }, [data, employeeInfoData?.Data, developRequestDetails?.Data]);

  return (
    <div
      className="bg-primary-950/[.03] border border-primary-950/[.1] rounded-[20px]
        px-5 py-4"
    >
      <h4 className="font-medium text-[14px]/[27px] text-primary-950">
        خلاصه درخواست توسعه / تغییر
      </h4>
      <div className="h-[1px] bg-primary-950/[.1] w-full mt-3 mb-4" />
      <div className="flex flex-col gap-y-4">
        {formData.map((data, index) => {
          const isLong =
            (developTicketDetail?.Data?.Description ?? "").length > 100;

          return (
            // <div key={index} className="flex flex-col gap-y-1">
            //   <div
            //     className={`flex justify-between ${
            //       isLong
            //         ? "flex-col items-start gap-y-2"
            //         : "flex-row items-center"
            //     }`}
            //   >
            //     <div className="flex items-center gap-x-2 text-[14px]/[27px]">
            //       <div className="p-2 bg-white rounded-[8px] border border-primary-950/[.1]">
            //         {data.icon}
            //       </div>
            //       <h6 className="font-medium text-primary-950/[.5]">
            //         {data.title}
            //       </h6>
            //     </div>
            //     <p className="font-medium text-primary-950">{data.value}</p>
            //   </div>
            // </div>
            <AppInfoRow
              icon={data.icon}
              title={data.title}
              value={data.value}
              isTextArea={data.isTextArea}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
}

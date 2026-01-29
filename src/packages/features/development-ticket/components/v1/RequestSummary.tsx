import {
  Arrow,
  Buildings,
  Global,
  SmsTracking,
  Subtitle,
  User,
  UserSquare,
} from "iconsax-reactjs";
import { useGetDevelopmentRequestDetailsQuery } from "../../api/developmentApi";
import { Chip } from "@heroui/react";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { useGetEmployeeInfoByPersonnelId } from "@/hooks/process/useHumanResource";
import AppInfoRow from "@/components/common/AppInfoRow/AppInfoRow";

interface RequestSummaryProps {
  requestId: string;
  developRequestDetails: GeneralResponse<GetDevelopmentTicketModel> | undefined;
}

export default function RequestSummary({
  requestId,
  developRequestDetails,
}: RequestSummaryProps) {
  const { data: developTicketDetail, isLoading } =
    useGetDevelopmentRequestDetailsQuery(Number(requestId));

  const { employeeInfoData } = useGetEmployeeInfoByPersonnelId(
    developRequestDetails?.Data?.PersonnelId
  );

  const formData = [
    {
      icon: <User size={16} />,
      title: "نام و نام خانوادگی",
      value: employeeInfoData?.Data?.FullName || "",
    },
    {
      icon: <User size={16} />,
      title: "سمت",
      value: employeeInfoData?.Data?.Title || "",
    },
    {
      icon: <UserSquare size={16} />,
      title: "کد پرسنلی",
      value: employeeInfoData?.Data?.PersonnelId || "",
    },
    {
      icon: <Arrow size={16} />,
      title: "نوع درخواست",
      value: developTicketDetail?.Data?.RequestTypeName,
    },
    {
      icon: <Global size={16} />,
      title: "اولویت",
      value: (
        <Chip
          className={`!font-medium !text-[12px]/[22px] rounded-[24px] 
            py-[7px] px-[15px] h-[32px] ${
              developTicketDetail?.Data?.PriorityName === "کم"
                ? "text-trash bg-accent-400"
                : developTicketDetail?.Data?.PriorityName === "متوسط"
                ? "text-accent-300 bg-accent-200"
                : developTicketDetail?.Data?.PriorityName === "بالا"
                ? "text-accent-700 bg-accent-600"
                : ""
            }`}
        >
          {developTicketDetail?.Data?.PriorityName}
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
      icon: <User size={16} />,
      title: "توضیحات پروژه",
      type: "description",
      value: developTicketDetail?.Data?.Description,
      isTextArea: true,
    },
    {
      icon: <User size={16} />,
      title: "توضیحات اضافی پروژه",
      type: "description",
      value: developTicketDetail?.Data?.ExtraDescription,
      isTextArea: true,
    },
  ];

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

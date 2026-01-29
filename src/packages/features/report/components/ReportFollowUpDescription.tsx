import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { ReportRequest } from "../types/ReportModels";
import {
  Calendar,
  Coin,
  Data,
  Document,
  Mobile,
  SmsTracking,
  Solana,
  TimerStart,
  Truck,
  User,
} from "iconsax-reactjs";
import { useGetRequestByIdQuery } from "../../task-inbox/api/RequestApi";
import InvoiceDetail from "../../logistics/invoice/components/InvoiceDetail";

import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { useState } from "react";
import { FileType } from "@/components/common/AppFile/AppFile.types";

interface ReportFollowUpDescriptionProps {
  requestId?: string;
  requestStatus: GetLastRequestStatus | undefined;
  reportData: GeneralResponse<ReportRequest> | undefined;
}

export default function ReportFollowUpDescription({
  reportData,
  requestId,
}: ReportFollowUpDescriptionProps) {
  const { data: requestData } = useGetRequestByIdQuery(Number(requestId));
  const [files, setFiles] = useState<FileType[] | []>([]);

  const formData = [
    {
      icon: <User size={16} />,
      title: "عنوان درخواست",
      value: requestData?.Data?.Title || "",
    },
    {
      icon: <Truck size={16} />,
      title: "نوع درخواست",
      value: reportData?.Data?.CategoryName,
    },
    {
      icon: <Solana size={16} />,
      title: "سطح اولویت",
      value: reportData?.Data?.PriorityName,
    },
    {
      icon: <Data size={16} />,
      title: "هدف تجاری",
      value: reportData?.Data?.Target || "",
    },
    {
      icon: <Mobile size={16} />,
      title: "شرح درخواست",
      value: reportData?.Data?.Description || "ندارد",
    },
    {
      icon: <TimerStart size={16} />,
      title: "نوع خروجی مورد نیاز",
      value: reportData?.Data?.OutputFormatName,
    },
    {
      icon: <SmsTracking size={16} />,
      title: "دامنه داده",
      value: reportData?.Data?.DataScopeName,
    },
    {
      icon: <Coin size={16} />,
      title: "شاخص های دقیق مورد نیاز",
      value: reportData?.Data?.KpiName,
    },
    {
      icon: <Calendar size={16} />,
      title: "پارامتر ها و فیلتر های دقیق",
      value: reportData?.Data?.Filters || "",
    },
    {
      icon: <Calendar size={16} />,
      title: "سطح دسترسی",
      value: reportData?.Data?.DataAccessName || "",
    },
    {
      icon: <Calendar size={16} />,
      title: "دوره آپدیت",
      value: reportData?.Data?.ReportUpdateName || "",
    },

    {
      icon: <Calendar size={16} />,
      title: "زمان مورد نیاز جهت تحویل",
      value: reportData?.Data?.DelivaryDate || "",
    },
    {
      icon: <Calendar size={16} />,
      title: "درخواست مدل سازی",
      value: reportData?.Data?.ModelLimitationName || "",
    },
    {
      icon: <Document size={16} />,
      title: "پیوست‌ها",
      value: (
        <>
          {requestId && (
            <AppFile
              setFiles={setFiles}
              requestId={requestId}
              files={files}
              enableUpload={false}
              featureName={FeatureNamesEnum.REPORT}
            />
          )}
        </>
      ),
    },
  ];

  const isLong = (reportData?.Data?.Description ?? "").length > 100;

  return (
    <div className="col-span-8 border border-primary-950/[.1] rounded-[20px] p-4 space-y-[24px] mb-4">
      <h4 className="font-medium text-[16px]/[30px] text-primary-950">
        شرح درخواست
      </h4>
      <div className="h-[1px] bg-primary-950/[.1] w-full mt-3 mb-4" />
      <InvoiceDetail
        title="خلاصه درخواست گزارش"
        formData={formData}
        requestId={requestId ?? ""}
        isLong={isLong}
      />
    </div>
  );
}

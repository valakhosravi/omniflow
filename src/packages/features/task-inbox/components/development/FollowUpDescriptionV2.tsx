import AppInfoRow from "@/components/common/AppInfoRow/AppInfoRow";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import { useGetDevelopmentRequestDetailsQuery } from "@/packages/features/development-ticket/api/developmentApi";
import { Button, Chip } from "@heroui/react";
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
  Folder,
  NoteText,
  People,
  Profile2User,
  Setting,
  SmsTracking,
  Subtitle,
  TickCircle,
  User,
} from "iconsax-reactjs";
import { useCallback, useMemo, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { addToaster } from "@/ui/Toaster";
import { useRouter } from "next/navigation";
import { useSendMessageMutation } from "@/packages/camunda";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { GetDevelopmentTicketModel } from "@/packages/features/development-ticket/types/DevelopmentRequests";
import { useGetEmployeeInfoByPersonnelId } from "@/hooks/process/useHumanResource";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";

interface FollowUpDescriptionProps {
  requestStatus: GetLastRequestStatus | undefined;
  formKey: string;
  requestId: string;
  developRequestDetails: GeneralResponse<GetDevelopmentTicketModel> | undefined;
}

export default function FollowUpDescription({
  requestStatus,
  formKey,
  requestId,
  developRequestDetails,
}: FollowUpDescriptionProps) {
  const { data: developTicketDetail, isLoading } =
    useGetDevelopmentRequestDetailsQuery(Number(requestId));
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const router = useRouter();
  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  const { employeeInfoData } = useGetEmployeeInfoByPersonnelId(
    developRequestDetails?.Data?.PersonnelId
  );

  const data = developTicketDetail?.Data;
  const [files, setFiles] = useState<FileType[] | []>([]);

  const infoRows = useMemo(() => {
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
        value: data?.Description,
        isTextArea: true,
      },
      {
        icon: <DocumentText size={16} />,
        title: "توضیحات اضافی پروژه",
        value: data?.ExtraDescription || "",
        isTextArea: true,
      },
      {
        icon: <Folder size={16} />,
        title: "فایل ها",
        value: (
          <div>
            {requestId && (
              <AppFile
                requestId={requestId}
                files={files}
                setFiles={setFiles}
                enableUpload={false}
                featureName={FeatureNamesEnum.DEVELOPMENT}
              />
            )}
          </div>
        ),
      },
    ];

    // Conditionally add fields
    if (data?.HasSimilarProcess === 1 && data?.SimilarProcessDescription) {
      baseData.splice(10, 0, {
        icon: <User size={16} />,
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
        icon: <User size={16} />,
        title: "توضیحات عدم انطباق با الزامات مقرراتی",
        value: data.RegulatoryCompliantDescription,
        isTextArea: true,
      });
    }

    if (data?.IsReportRequired && data?.ReportPath) {
      const insertIndex =
        baseData.findIndex((item) => item.title === "به گزارشات نیاز است؟") + 1;
      baseData.splice(insertIndex, 0, {
        icon: <User size={16} />,
        title: "گزارشات فعلی در چه مسیری ارائه می شود؟",
        value: data.ReportPath,
      });
    }

    return baseData;
  }, [data, employeeInfoData?.Data, developRequestDetails?.Data, requestId]);

  const onSendMessageClick = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, []);

  const handleCancelModal = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    sendMessage({
      body: {
        messageName: "Development-Terminate-Request-Message",
        processInstanceId: developRequestDetails?.Data?.InstanceId || "",
      },
    })
      .unwrap()
      .then(() => {
        addToaster({
          color: "success",
          title: "درخواست با موفقیت لغو شد",
        });
        setIsConfirmModalOpen(false);
        router.push("/task-inbox/requests");
      })
      .catch((error) => {
        addToaster({
          color: "danger",
          title: error.message || "خطا در لغو درخواست",
        });
      });
  }, [sendMessage, developRequestDetails?.Data, router]);

  return (
    <>
      <div className="col-span-8 space-y-5">
        <div className="border border-[#D8D9DF] p-4 rounded-[20px]">
          <div className="text-[#1C3A63] pb-3 mb-4 border-b border-[#1C3A631A]">
            شرح درخواست
          </div>
          <div
            className={`rounded-[20px] border border-[#1C3A631A] bg-[#f8f9fa] p-4 mb-2 ${
              requestStatus?.StatusCode === 100 && "mb-4"
            }`}
          >
            <div className="text-[14px] text-[#1C3A63] font-[500] mb-4 pb-3 border-b border-[#1C3A631A]">
              خلاصه درخواست توسعه / تغییر
            </div>
            <div className="flex flex-col gap-4">
              {infoRows.map((item, index) => (
                <AppInfoRow
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  value={item.value}
                  isTextArea={item.isTextArea}
                />
              ))}
            </div>
          </div>
          {
            /* follow-up */
            formKey === "follow-up" &&
              requestStatus &&
              requestStatus.CanBeCanceled && (
                <div className="text-left mt-4">
                  <Button
                    variant="bordered"
                    className="text-[#FF1751] border-[#26272B33] border-1 rounded-[12px]"
                    size="md"
                    onPress={onSendMessageClick}
                  >
                    لغو درخواست
                  </Button>
                </div>
              )
          }
        </div>
      </div>
      <ConfirmModal
        isConfirmModalOpen={isConfirmModalOpen}
        onClose={handleCancelModal}
        handleConfirmCancel={handleConfirmCancel}
        isSendingMessage={isSendingMessage}
      />
    </>
  );
}

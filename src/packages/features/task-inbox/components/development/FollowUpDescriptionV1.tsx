import AppInfoRow from "@/components/common/AppInfoRow/AppInfoRow";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import { useGetDevelopmentRequestDetailsQuery } from "@/packages/features/development-ticket/api/developmentApi";
import { Button, Chip } from "@heroui/react";
import {
  Arrow,
  Global,
  PictureFrame,
  SmsTracking,
  Subtitle,
  User,
} from "iconsax-reactjs";
import { useCallback, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { addToaster } from "@/ui/Toaster";
import { useRouter } from "next/navigation";
import { useSendMessageMutation } from "@/packages/camunda";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { GetDevelopmentTicketModel } from "@/packages/features/development-ticket/types/DevelopmentRequests";
import UploadMultipleFile from "@/packages/features/development-ticket/components/v1/UploadMultipleFile";

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

  const infoRows = [
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
      value: developRequestDetails?.Data?.TrackingCode || "",
    },
    {
      icon: <User size={16} />,
      title: "توضیحات پروژه",
      value: developTicketDetail?.Data?.Description,
      isTextArea: true,
    },
    {
      icon: <User size={16} />,
      title: "توضیحات اضافی پروژه",
      value: developTicketDetail?.Data?.ExtraDescription,
      isTextArea: true,
    },
    {
      icon: <PictureFrame size={16} />,
      title: "فایل ها",
      value: (
        <UploadMultipleFile
          requestId={requestId}
          classNames="w-full"
          canUpload={false}
          dir="ltr"
        />
      ),
    },
  ];

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
        {/* <UploadMultipleFile
          requestId={requestId}
          classNames="w-full"
          title="بارگذاری فایل"
          canUpload={false}
        /> */}
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

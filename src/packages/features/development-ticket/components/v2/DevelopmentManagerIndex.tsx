"use client";
import { Refresh, User } from "iconsax-reactjs";
import RequestDescription from "./RequestDescription";
import RequestDetail from "./RequestDetail";
import CustomButton from "@/ui/Button";
import { useDisclosure } from "@heroui/react";
import { useGetDevelopmentTicketQuery } from "../../api/developmentApi";
import { useRequestStatus } from "@/packages/features/task-inbox/hooks/useRequestStatus";
import { useRequestTimeline } from "@/packages/features/task-inbox/hooks/useRequestTimeline";
import TaskInboxLayout from "@/packages/features/task-inbox/layouts";
import RequestFlowModal from "@/packages/features/task-inbox/components/RequestFlowModal";
import { STATUS_STYLES } from "@/packages/features/task-inbox/constants/constant";

interface DevelopmentManagerProps {
  formKey?: string;
  requestId?: string;
}

export default function DevelopmentManagerIndex({
  formKey,
  requestId,
}: DevelopmentManagerProps) {
  const {
    data: developRequestDetails,
    isLoading,
    error,
  } = useGetDevelopmentTicketQuery(Number(requestId));

  const { requestStatus, refetch } = useRequestStatus({
    requestId: Number(requestId),
  });

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

  const { requestTimeline, refetch: refetchRequestTimeline } =
    useRequestTimeline({ requestId: Number(requestId) });

  const formData = [
    {
      title: "وضعیت درخواست",
      value: (
        <div
          className={`text-[14px] py-1 px-3 font-[600] rounded-[24px] ${
            STATUS_STYLES[requestStatus?.StatusCode || 0]
          }`}
        >
          {requestStatus?.StatusName || ""}
        </div>
      ),
      icon: <Refresh size={16} />,
    },
    {
      title: "نام و نام خانوادگی",
      value: requestStatus?.FullName || "",
      icon: <User size={16} />,
    },
    {
      title: "سمت",
      value: requestStatus?.JobPositionName || "",
      icon: <User size={16} />,
    },
  ];

  return (
    <TaskInboxLayout>
      <>
        <div className="px-4 py-6">
          <div className="flex items-center mb-4 justify-between">
            <div className="inline-flex items-center gap-2">
              {/* <Icon name="tag" /> */}
              <span className="text-[#1C3A63] text-[16px] font-[500]">
                درخواست تیکت توسعه
              </span>
            </div>
            <div>
              <CustomButton
                buttonVariant="outline"
                buttonSize="md"
                startContent={<Refresh size={20} />}
                onPress={onRequestFlowOpen}
              >
                مراحل گردش درخواست
              </CustomButton>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <RequestDescription
              formKey={formKey}
              requestId={requestId}
              requestStatus={requestStatus}
              refetch={refetch}
              developRequestDetails={developRequestDetails}
            />
            <RequestDetail
              formData={formData}
              CreatedDate={developRequestDetails?.Data?.CreatedDate}
            />
          </div>
        </div>
      </>
      <RequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </TaskInboxLayout>
  );
}

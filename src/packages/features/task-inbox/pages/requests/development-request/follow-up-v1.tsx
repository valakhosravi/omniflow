import CustomButton from "@/ui/Button";
import { Refresh, User } from "iconsax-reactjs";
import React from "react";
import RequestDetail from "@/packages/features/development-ticket/components/v1/RequestDetail";
import { useRequestStatus } from "../../../hooks/useRequestStatus";
import { STATUS_STYLES } from "../../../constants/constant";
import { useGetDevelopmentTicketQuery } from "@/packages/features/development-ticket/api/developmentApi";
import TaskInboxLayout from "../../../layouts";
import { useDisclosure } from "@heroui/react";
import RequestFlowModal from "../../../components/RequestFlowModal";
import { useRequestTimeline } from "../../../hooks/useRequestTimeline";
import FollowUpDescription from "../../../components/development/FollowUpDescriptionV1";

interface DevelopmentRequestFollowUpPageProps {
  requestId: string;
  formKey: string;
}
export default function DevelopmentRequestFollowUpPage({
  requestId,
  formKey,
}: DevelopmentRequestFollowUpPageProps) {
  const { requestStatus, refetch } = useRequestStatus({
    requestId: Number(requestId),
  });
  const { data: developRequestDetails } = useGetDevelopmentTicketQuery(
    Number(requestId)
  );

  const detailRows = [
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

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

  const { requestTimeline, refetch: refetchRequestTimeline } =
    useRequestTimeline({ requestId: Number(requestId) });

  return (
    <TaskInboxLayout>
      <div className="px-4 py-6">
        <div className="flex items-center mb-4 justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="text-[#1C3A63] text-[16px] font-[500]">
              درخواست تیکت توسعه
            </span>
          </div>
          <CustomButton
            buttonVariant="outline"
            buttonSize="md"
            startContent={<Refresh size={20} />}
            onPress={onRequestFlowOpen}
          >
            مراحل گردش درخواست
          </CustomButton>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <FollowUpDescription
            requestStatus={requestStatus}
            formKey={formKey}
            requestId={requestId}
            developRequestDetails={developRequestDetails}
          />
          <RequestDetail
            formData={detailRows}
            CreatedDate={developRequestDetails?.Data?.CreatedDate}
          />
        </div>
      </div>
      <RequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </TaskInboxLayout>
  );
}

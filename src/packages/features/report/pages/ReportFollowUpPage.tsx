import { Refresh, User } from "iconsax-reactjs";
import { STATUS_STYLES } from "../../task-inbox/constants/constant";
import { useRequestStatus } from "../../task-inbox/hooks/useRequestStatus";
import { useRequestTimeline } from "../../task-inbox/hooks/useRequestTimeline";
import ProcurementCheckLayout from "../../logistics/invoice/layouts/ProcurementCheckLayout";
import CustomButton from "@/ui/Button";
import { useDisclosure } from "@heroui/react";
import RequestFlowModal from "../../task-inbox/components/RequestFlowModal";
import RequestDetail from "../../development-ticket/components/v2/RequestDetail";
import ReportFollowUpDescription from "../components/ReportFollowUpDescription";
import { useGetReportByRequestIdQuery } from "../api/ReportApi";

export default function ReportFollowUpPage({
  requestId,
}: {
  requestId: string;
}) {
  const { requestTimeline, refetch: refetchRequestTimeline } =
    useRequestTimeline({ requestId: Number(requestId) });
  const { requestStatus, refetch } = useRequestStatus({
    requestId: Number(requestId),
  });
  const { data: reportData } = useGetReportByRequestIdQuery(Number(requestId), {
    skip: !requestId,
  });

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

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
    <ProcurementCheckLayout>
      <div className="flex items-center mb-4 justify-between px-4 pt-6">
        <div className="inline-flex items-center gap-2">
          <span className="text-[#1C3A63] text-[16px] font-[500]">
            درخواست گزارش
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
      <div className="h-[calc(100%-105px)] grid grid-cols-12 gap-4 px-4 py-6">
        <ReportFollowUpDescription
          requestId={requestId}
          requestStatus={requestStatus}
          reportData={reportData}
        />
        <RequestDetail
          formData={formData}
          CreatedDate={requestStatus?.CreatedDate}
        />
      </div>
      <RequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </ProcurementCheckLayout>
  );
}

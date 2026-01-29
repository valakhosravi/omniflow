import { useDisclosure } from "@heroui/react";
import { useGetInvoiceByRequestIdQuery } from "../api/InvoiceApi";
import { useRequestStatus } from "@/packages/features/task-inbox/hooks/useRequestStatus";
import { useRequestTimeline } from "@/packages/features/task-inbox/hooks/useRequestTimeline";
import ProcurementCheckLayout from "../layouts/ProcurementCheckLayout";
import RequestFlowModal from "@/packages/features/task-inbox/components/RequestFlowModal";
import RequestDetail from "@/packages/features/development-ticket/components/v2/RequestDetail";
import { STATUS_STYLES } from "@/packages/features/task-inbox/constants/constant";
import { Refresh, User } from "iconsax-reactjs";
import CustomButton from "@/ui/Button";
import ProcurementSecondCheckDescription from "../components/ProcurementSecondCheckDescription";

export default function ProcurementSecondCheckIndex({
  formKey,
  requestId,
}: {
  formKey: string;
  requestId: string;
}) {
  const { requestTimeline, refetch: refetchRequestTimeline } =
    useRequestTimeline({ requestId: Number(requestId) });
  const { requestStatus, refetch } = useRequestStatus({
    requestId: Number(requestId),
  });
  const { data: invoiceData } = useGetInvoiceByRequestIdQuery(
    Number(requestId),
    { refetchOnMountOrArgChange: true }
  );
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
            درخواست پرداخت صورتحساب
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
        <ProcurementSecondCheckDescription
          requestId={requestId}
          requestStatus={requestStatus}
          refetch={refetch}
          invoiceDetails={invoiceData}
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

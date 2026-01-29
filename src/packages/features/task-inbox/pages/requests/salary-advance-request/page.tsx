"use client";

import TaskInboxLayout from "../../../layouts";
import { Spinner, useDisclosure } from "@/ui/NextUi";
import { Refresh, User } from "iconsax-reactjs";
import { useRequestStatus } from "../../../hooks/useRequestStatus";
import {
  useGetLoanRequestByRequestIdQuery,
  useGetTimelineQuery,
} from "@/packages/features/advance-money/api/advanceMoneyApi";
import RequestDetail from "@/packages/features/development-ticket/components/v2/RequestDetail";
import { STATUS_STYLES } from "../../../constants/constant";
import RequestDescription from "../../../components/RequestDescription";
import CustomButton from "@/ui/Button";
import RequestFlowModal from "../../../components/RequestFlowModal";
import { useRequestTimeline } from "../../../hooks/useRequestTimeline";

interface SalaryAdvanceRequestPageProps {
  requestId: string;
  formKey: string;
}

export default function SalaryAdvanceRequestPage({
  requestId,
  formKey,
}: SalaryAdvanceRequestPageProps) {
  const {
    data: loanRequestDetails,
    isLoading,
    error,
  } = useGetLoanRequestByRequestIdQuery(Number(requestId), {
    refetchOnMountOrArgChange: true,
  });
  const { data: timelineData, isLoading: isTimelineLoading } =
    useGetTimelineQuery(Number(requestId), {
      refetchOnMountOrArgChange: true,
    });

  const { requestStatus, refetch } = useRequestStatus({
    requestId: Number(requestId),
    refetchOnMountOrArgChange: true,
  });

  // Add request flow modal state
  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

  // Add request timeline hook
  const { requestTimeline, refetch: refetchRequestTimeline } =
    useRequestTimeline({ requestId: Number(requestId) });

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

  if (isLoading || isTimelineLoading) {
    return (
      <TaskInboxLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </TaskInboxLayout>
    );
  }

  if (error) {
    return (
      <TaskInboxLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">خطا در بارگذاری اطلاعات</div>
        </div>
      </TaskInboxLayout>
    );
  }

  return (
    <TaskInboxLayout>
      <div className="px-4 py-6">
        <div className="flex items-center mb-4 justify-between">
          <div className="inline-flex items-center gap-2">
            {/* <TagIcon fill="#4A85E7" /> */}
            <span className="text-[#1C3A63] text-[16px] font-[500]">
              درخواست مساعده
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
            loanRequestDetails={loanRequestDetails?.Data}
            refetch={refetch}
          />
          <RequestDetail
            formData={detailRows}
            CreatedDate={loanRequestDetails?.Data?.CreatedDate}
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

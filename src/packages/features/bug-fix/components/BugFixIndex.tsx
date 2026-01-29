"use client";

import CustomButton from "@/ui/Button";
import BugFixForm from "./BugFixForm";
import TaskInboxLayout from "../../task-inbox/layouts";
import { Refresh, User } from "iconsax-reactjs";
import RequestFlowModal from "../../task-inbox/components/RequestFlowModal";
import { useDisclosure } from "@heroui/react";
import { useRequestTimeline } from "../../task-inbox/hooks/useRequestTimeline";
import RequestDetail from "../../development-ticket/components/v2/RequestDetail";
import { STATUS_STYLES } from "../../task-inbox/constants/constant";
import { useRequestStatus } from "../../task-inbox/hooks/useRequestStatus";
import {
  ActionsConfig,
  BugFixPagesTypes,
  SelectInputConfig,
} from "../BugFix.types";

export default function BugFixIndex<T>({
  requestId,
  selectInputConfig,
  requestBugFixActions,
  hasAcceptRequestButton = false,
  pageType,
  unit,
}: {
  requestBugFixActions?: ActionsConfig<T>;
  hasAcceptRequestButton: boolean;
  selectInputConfig?: SelectInputConfig[];
  requestId: string;
  pageType: BugFixPagesTypes;
  unit?: "infra" | "payment";
}) {
  const { requestTimeline, refetch: refetchRequestTimeline } =
    useRequestTimeline({ requestId: Number(requestId) });
  const {
    requestStatus,
    refetch: refetchRequestStatus,
    isLoading: isLoadingRequestStatus,
  } = useRequestStatus({
    requestId: Number(requestId),
  });

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

  return (
    <TaskInboxLayout>
      <div className="px-4  pt-6">
        <div className="flex items-center mb-4 justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="text-[#1C3A63] text-[16px] font-[500]">
              درخواست رفع باگ
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
      </div>

      <div className="grid grid-cols-12 gap-4 mx-4">
        <div className="col-span-8">
          <BugFixForm<T>
            unit={unit}
            pageType={pageType}
            requestId={requestId}
            selectInputConfig={selectInputConfig}
            hasAcceptRequestButton={hasAcceptRequestButton}
            {...(requestBugFixActions
              ? { requestBugFixActions: requestBugFixActions }
              : {})}
          />
        </div>

        <RequestDetail
          formData={detailRows}
          CreatedDate={requestStatus?.CreatedDate}
        />
      </div>
      <RequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </TaskInboxLayout>
  );
}

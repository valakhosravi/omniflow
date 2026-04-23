"use client";

import { Spinner, useDisclosure } from "@heroui/react";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useGetBugInfoByRequestIdQuery } from "../../../Bug.services";
import BugFixCreateForm from "../../Start/BugFixCreateForm";
import { BugFixComponentType } from "../../../Bug.types";
import { useSearchParams } from "next/navigation";
import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";
import {
  useGetLastRequestStatusQuery,
  useGetRequestByIdQuery,
  useGetRequestTimelineQuery,
} from "@/services/commonApi/commonApi";
import StartProcessHeader from "@/components/common/AppStartProcessHeader";
import AppButton from "@/components/common/AppButton/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import AppRequestDetail from "@/components/common/AppRequestDetails";
import { STATUS_STYLES } from "@/components/common/AppRequestDetails/AppRequestDetails.const";

function BugEditPageComponent() {
  const searchParams = useSearchParams();
  const requestId = searchParams?.get("requestId");

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();
  const { data: requestTimeline } = useGetRequestTimelineQuery(
    Number(requestId),
    {
      skip: !requestId,
    },
  );

  const { data: requestDetails } = useGetRequestByIdQuery(Number(requestId));

  const {
    data: bugFixRequestData,
    isLoading: isBugFixDataLoading,
    error: bugFixDataError,
  } = useGetBugInfoByRequestIdQuery(
    {
      requestId: String(requestId),
      processName: "Bug",
      trackingCode: String(requestDetails?.Data?.TrackingCode),
    },
    {
      skip:
        !requestId ||
        isNaN(Number(requestId)) ||
        !requestDetails?.Data?.TrackingCode,
    },
  );

  const { data: requestStatus } = useGetLastRequestStatusQuery(
    Number(requestId),
    {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    },
  );

  const detailRows = [
    {
      title: "وضعیت درخواست",
      value: (
        <div
          className={`text-[14px] py-1 px-3 font-[600] rounded-[24px] ${
            STATUS_STYLES[requestStatus?.Data?.StatusCode || 0]
          }`}
        >
          {requestStatus?.Data?.StatusName || ""}
        </div>
      ),
      icon: <AppIcon name="Refresh" size={16} />,
    },
    {
      title: "نام و نام خانوادگی",
      value: requestStatus?.Data?.FullName || "",
      icon: <AppIcon name="User" size={16} />,
    },
    {
      title: "سمت",
      value: requestStatus?.Data?.JobPositionName || "",
      icon: <AppIcon name="User" size={16} />,
    },
  ];

  if (isBugFixDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (bugFixDataError || !bugFixRequestData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">خطا در بارگذاری اطلاعات</div>
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-between  items-center">
        <div>
          <StartProcessHeader title={"ویرایش تیکت باگ"} />
        </div>

        <AppButton
          label="مراحل گردش درخواست"
          variant="outline"
          icon="Refresh"
          onClick={onRequestFlowOpen}
        />
      </div>

      <div className={"grid grid-cols-12 mx-[20px] mt-5"}>
        <div className={"col-span-8 flex justify-end"}>
          {requestId && (
            <BugFixCreateForm
              pageType={BugFixComponentType.EDIT}
              requestId={requestId.toString()}
              data={bugFixRequestData?.Data}
            />
          )}
        </div>

        <div className="grid grid-cols-4 mr-8  col-span-4  justify-end">
          <AppRequestDetail
            formData={detailRows}
            CreatedDate={requestStatus?.Data?.CreatedDate}
          />
        </div>
      </div>

      <AppRequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </>
  );
}

export default AppWithTaskInboxSidebar(BugEditPageComponent);

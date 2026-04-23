"use client";
import AppButton from "@/components/common/AppButton/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import DevelopmentCreateForm from "./DevelopmentCreateForm";
import {
  useGetLastRequestStatusQuery,
  useGetRequestTimelineQuery,
} from "@/services/commonApi/commonApi";
import { useDisclosure } from "@heroui/react";
import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";
import { useParams } from "next/navigation";
import AppRequestDetail from "@/components/common/AppRequestDetails";
import { STATUS_STYLES } from "@/components/common/AppRequestDetails/AppRequestDetails.const";
import { DevelopmentPagesEnum } from "../../development.types";
import StartProcessHeader from "@/components/common/AppStartProcessHeader";

export default function DevelopmentCreateIndex({
  pageType,
}: {
  pageType: DevelopmentPagesEnum;
}) {
  const params = useParams();
  const requestId = Number(params?.requestId);
  const isEditMode = pageType === DevelopmentPagesEnum.EDIT;
  const title = isEditMode ? "ویرایش تیکت توسعه" : "ثبت تیکت توسعه";

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

  const { data: requestTimeline } = useGetRequestTimelineQuery(requestId, {
    skip: !requestId || !isEditMode,
    refetchOnMountOrArgChange: true,
  });

  const { data: requestStatus } = useGetLastRequestStatusQuery(requestId, {
    skip: !requestId || !isEditMode,
    refetchOnMountOrArgChange: true,
  });

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

  return (
    <>
      <div className="flex justify-between  items-center">
        <div>
          <StartProcessHeader title={title} />
        </div>
        {isEditMode && (
          <AppButton
            label="مراحل گردش درخواست"
            variant="outline"
            onClick={onRequestFlowOpen}
          />
        )}
      </div>

      <div
        className={
          isEditMode
            ? "grid grid-cols-12 mx-[20px] mt-5"
            : "flex w-full justify-center"
        }
      >
        <div
          className={isEditMode ? "col-span-8 flex justify-end" : "col-span-12"}
        >
          <DevelopmentCreateForm pageType={pageType} />
        </div>

        {isEditMode && (
          <div className="grid grid-cols-4 mr-8  col-span-4  justify-end">
            <AppRequestDetail
              formData={detailRows}
              CreatedDate={requestStatus?.Data?.CreatedDate}
            />
          </div>
        )}
      </div>
      {isEditMode && (
        <AppRequestFlowModal
          isOpen={isRequestFlowOpen}
          onOpenChange={onOpenChangeRequestFlow}
          requestTimeline={requestTimeline}
        />
      )}
    </>
  );
}

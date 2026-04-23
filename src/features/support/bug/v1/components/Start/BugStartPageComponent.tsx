"use client";

import AppButton from "@/components/common/AppButton/AppButton";
import { useDisclosure } from "@heroui/react";
import { BugFixComponentType, BugFixIndexPropsType } from "../../Bug.types";
import StartProcessHeader from "@/components/common/AppStartProcessHeader";
import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";
import { useGetRequestTimelineQuery } from "@/services/commonApi/commonApi";
import BugFixCreateForm from "./BugFixCreateForm";

export default function BugStartPageComponent({
  type,
  requestId,
  BugFixData,
}: BugFixIndexPropsType) {
  const isEditMode = type === BugFixComponentType.EDIT;
  const title =
    type === BugFixComponentType.EDIT
      ? "ویرایش تیکت رفع باگ"
      : "ثبت تیکت رفع باگ";
  const BugFixInfo =
    type === BugFixComponentType.EDIT && BugFixData ? BugFixData.Data : null;

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

  const { data: requestTimeline } = useGetRequestTimelineQuery(
    Number(requestId),
    {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    },
  );

  return (
    <div className="container mx-auto">
      <div className="flex justify-between  items-center">
        <div>
          <StartProcessHeader title={title} />
        </div>
        {isEditMode && (
          <AppButton
            label="مراحل گردش درخواست"
            variant="outline"
            icon="Refresh"
            onClick={onRequestFlowOpen}
          />
        )}
      </div>
      <div
        className={
          isEditMode
            ? "flex gap-x-4 items-start justify-center"
            : "flex gap-x-4 items-start justify-center mt-10"
        }
      >
        {isEditMode && BugFixInfo && (
          <BugFixCreateForm
            pageType={BugFixComponentType.EDIT}
            data={BugFixInfo}
          />
        )}
        {!isEditMode && (
          <BugFixCreateForm pageType={BugFixComponentType.CREATE} />
        )}
      </div>
      <AppRequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </div>
  );
}

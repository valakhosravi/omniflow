"use client";

import CustomButton from "@/ui/Button";
import AdvanceMoneyLayout from "../../advance-money/layouts";
import DevelopmentTicketHeader from "../../development-ticket/components/v2/DevelopmentTicketHeader";
import BugFixForm from "../components/BugFixCreateForm";
import { Refresh } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useDisclosure } from "@heroui/react";
import GeneralResponse from "@/models/general-response/general_response";
import { GetRequestTimelineModel } from "@/models/camunda-process/GetRequests";
import { useLazyGetRequestTimelineQuery } from "../../task-inbox/api/RequestApi";
import RequestFlowModal from "../../task-inbox/components/RequestFlowModal";
import { BugFixComponentType, BugFixIndexPropsType } from "../BugFix.types";

export default function BugFixPageComponent({
  type,
  requestId,
  BugFixData,
}: BugFixIndexPropsType) {
  const [requestTimelineMethod] = useLazyGetRequestTimelineQuery();
  const [requestTimeline, setRequestTimeline] = useState<
    GeneralResponse<GetRequestTimelineModel[]> | undefined
  >(undefined);

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

  useEffect(() => {
    if (isEditMode && requestId) {
      requestTimelineMethod(Number(requestId)).then((res) =>
        setRequestTimeline(res.data)
      );
    }
  }, [requestId, isEditMode, requestTimelineMethod, setRequestTimeline]);

  return (
    <AdvanceMoneyLayout>
      <div className="flex justify-between  items-center px-4 ">
        <div>
          <DevelopmentTicketHeader title={title} />
        </div>
        {isEditMode && (
          <CustomButton
            buttonVariant="outline"
            buttonSize="md"
            startContent={<Refresh size={20} />}
            onPress={onRequestFlowOpen}
          >
            مراحل گردش درخواست
          </CustomButton>
        )}
      </div>
      <div className="flex gap-x-4 items-start justify-center">
        {isEditMode && BugFixInfo && (
          <BugFixForm pageType={BugFixComponentType.EDIT} data={BugFixInfo} />
        )}
        {!isEditMode && <BugFixForm pageType={BugFixComponentType.CREATE} />}
      </div>
      <RequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </AdvanceMoneyLayout>
  );
}

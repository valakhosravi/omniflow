"use client";
import GeneralResponse from "@/packages/core/types/api/general_response";
import AdvanceMoneyLayout from "../../advance-money/layouts";
import ReportForm from "../components/ReportForm";
import { ReportComponentType, ReportRequest } from "../types/ReportModels";
import CustomButton from "@/ui/Button";
import { Refresh } from "iconsax-reactjs";
import { useDisclosure } from "@heroui/react";
import RequestFlowModal from "../../task-inbox/components/RequestFlowModal";
import { useLazyGetRequestTimelineQuery } from "../../task-inbox/api/RequestApi";
import { useEffect, useState } from "react";
import { GetRequestTimelineModel } from "@/models/camunda-process/GetRequests";
import DevelopmentTicketHeader from "../../development-ticket/components/v2/DevelopmentTicketHeader";

type ReportIndexPropsType = {
  type: ReportComponentType;
  requestId?: string;
  reportData?: GeneralResponse<ReportRequest>;
};

export default function ReportIndex({
  type,
  requestId,
  reportData,
}: ReportIndexPropsType) {
  const [requestTimelineMethod] = useLazyGetRequestTimelineQuery();
  const [requestTimeline, setRequestTimeline] = useState<
    GeneralResponse<GetRequestTimelineModel[]> | undefined
  >(undefined);

  const isEditMode = type === ReportComponentType.EDIT;
  const title =
    type === ReportComponentType.EDIT ? "ویرایش تیکت گزارش" : "ثبت تیکت گزارش";
  const reportInfo =
    type === ReportComponentType.EDIT && reportData ? reportData.Data : null;

  useEffect(() => {
    if (isEditMode && requestId) {
      requestTimelineMethod(Number(requestId)).then((res) =>
        setRequestTimeline(res.data)
      );
    }
  }, [requestId, isEditMode, requestTimelineMethod, setRequestTimeline]);

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

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
        {isEditMode && reportInfo && (
          <ReportForm reportType={type} reportInfo={reportInfo} />
        )}
        {!isEditMode && <ReportForm reportType={type} />}
      </div>
      <RequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </AdvanceMoneyLayout>
  );
}

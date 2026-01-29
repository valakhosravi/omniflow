import { Icon } from "@/ui/Icon";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@/ui/NextUi";
import TimelineItem from "./TimelineItem";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { GetRequestTimelineModel } from "@/models/camunda-process/GetRequests";

interface RequestFlowModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  requestTimeline: GeneralResponse<GetRequestTimelineModel[]> | undefined;
}

export default function RequestFlowModal({
  isOpen,
  onOpenChange,
  requestTimeline,
}: RequestFlowModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent className="!w-[746px] max-w-[746px] max-h-[647px] overflow-y-auto">
        <ModalHeader className="flex justify-between items-center pt-[16px] px-[16px]">
          <h1 className="font-semibold text-[16px]/[24px] text-secondary-950">
            فعالیت‌ها
          </h1>
          <Icon
            name="close"
            className="text-secondary-300 cursor-pointer"
            onClick={() => onOpenChange(false)}
          />
        </ModalHeader>
        <div className="mt-[8px] mb-[16px] mx-[16px] bg-background-devider h-[1px]" />
        <ModalBody className="p-4">
          <div>
            {requestTimeline?.Data?.map((timeline, index) => {
              const isLast = index === (requestTimeline?.Data?.length ?? 0) - 1;

              return (
                <TimelineItem
                  key={index}
                  formattedIndex={(index + 1).toString()}
                  timeline={timeline}
                  isLast={isLast}
                />
              );
            })}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

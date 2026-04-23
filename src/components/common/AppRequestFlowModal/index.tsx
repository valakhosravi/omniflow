import { AppIcon } from "@/components/common/AppIcon";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@/ui/NextUi";
import type { AppRequestFlowModalProps } from "./AppRequestFlowModal.types";
import TimelineItem from "./components/TimelineItem";

export default function AppRequestFlowModal({
  isOpen,
  onOpenChange,
  requestTimeline,
}: AppRequestFlowModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent className="!w-[746px] max-w-[746px] max-h-[647px] overflow-y-auto">
        <ModalHeader className="flex justify-between items-center pt-[16px] px-[16px]">
          <h1 className="font-semibold text-[16px]/[24px] text-secondary-950">
            فعالیت‌ها
          </h1>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-secondary-300 cursor-pointer"
            aria-label="بستن"
          >
            <AppIcon name="CloseCircle" size={20} />
          </button>
        </ModalHeader>
        <div className="mt-[8px] mb-[16px] mx-[16px] bg-background-devider h-[1px]" />
        <ModalBody className="p-4 max-h-[640px] overflow-y-auto">
          <div>
            {requestTimeline?.Data?.map((timeline, index) => {
              const isLast =
                index === (requestTimeline?.Data?.length ?? 0) - 1;

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

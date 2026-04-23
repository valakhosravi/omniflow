import { Modal, ModalBody, ModalContent, ModalHeader } from "@/ui/NextUi";

interface BackupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FooterBackup({ isOpen, onOpenChange }: BackupProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="pb-4">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-primary-950">
              پشتیبانی
            </ModalHeader>
            <ModalBody className="flex flex-col gap-y-0.5 items-center text-secondary-800 font-medium text-[14px]">
              <p>
                در صورت بروز مشکل، لطفاً با ایمیل زیر با ما در ارتباط باشید:
              </p>
              <a
                href="mailto:h.younesdoost@pec.ir"
                className="text-primary hover:underline break-all"
              >
                h.younesdoost@pec.ir
              </a>
              <p>تیم پشتیبانی ما در اسرع وقت پاسخگوی شما خواهد بود.</p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

import CustomButton from "@/ui/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface ResetConfirmModalProps {
  itemId: number | string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number | string) => void;
  isLoading?: boolean;
}

export default function ResetConfirmModal({
  itemId,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ResetConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm(itemId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="font-semibold text-[16px]/[30px] text-secondary-950">
              بازگردانی به نسخه اولیه
            </ModalHeader>
            <ModalBody>
              <p className="font-medium text-[16px]/[30px] text-primary-950/[.7]">
                در صورت بازگردانی٬ امکان بازگشت به نسخه نهایی وجود ندارد٬ آیا
                ازبازگردانی مطمئن هستید؟
              </p>
            </ModalBody>
            <ModalFooter>
              <CustomButton
                buttonSize="sm"
                buttonVariant="outline"
                onPress={onClose}
              >
                انصراف
              </CustomButton>
              <CustomButton
                buttonVariant="primary"
                buttonSize="sm"
                onPress={handleConfirm}
                isLoading={isLoading}
              >
                بازگردانی
              </CustomButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React from "react";

interface ConfirmNeedUserActionModalProps {
  isConfirmModalOpen: boolean;
  onClose: () => void;
  handleConfirm: () => void;
}

export default function ConfirmNeedUserActionModal({
  isConfirmModalOpen,
  onClose: handleCancelModal,
  handleConfirm,
}: ConfirmNeedUserActionModalProps) {
  return (
    <Modal isOpen={isConfirmModalOpen} onClose={handleCancelModal} size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-[#FF1751]">
              تایید ارسال درخواست
            </ModalHeader>
            <ModalBody>
              <p>آیا از ارسال این درخواست مطمئن هستید؟</p>
              <p className="text-sm text-gray-600 mt-2">
                این عمل قابل بازگشت نیست.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                className="text-[#1C3A63] border-[#26272B33] border-1 rounded-[12px]"
                onPress={handleCancelModal}
              >
                انصراف
              </Button>
              <Button
                variant="solid"
                className="bg-[#FF1751] text-white rounded-[12px]"
                onPress={handleConfirm}
              >
                تایید
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

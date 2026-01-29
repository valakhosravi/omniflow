import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React from "react";

interface ConfirmDeleteFileModalProps {
  isConfirmModalOpen: boolean;
  onClose: () => void;
  handleConfirm: () => void;
}

export default function ConfirmDeleteFileModal({
  isConfirmModalOpen,
  onClose: handleCancelModal,
  handleConfirm,
}: ConfirmDeleteFileModalProps) {
  return (
    <Modal isOpen={isConfirmModalOpen} onClose={handleCancelModal} size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-[#FF1751]">تایید حذف فایل</ModalHeader>
            <ModalBody>
              <p>آیا از حذف این فایل مطمئن هستید؟</p>
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

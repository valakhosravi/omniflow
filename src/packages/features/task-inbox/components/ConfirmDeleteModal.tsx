import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";

interface ConfirmDeleteModalProps {
  isConfirmModalOpen: boolean;
  handleCancelModal: () => void;
  handleConfirmCancel: () => void;
  isSendingMessage: boolean;
}

export default function ConfirmDeleteModal({
  isConfirmModalOpen,
  handleCancelModal,
  handleConfirmCancel,
  isSendingMessage,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isConfirmModalOpen} onClose={handleCancelModal} size="sm">
      <ModalContent>
        <>
          <ModalHeader className="text-[#FF1751]">
            تایید لغو درخواست
          </ModalHeader>
          <ModalBody>
            <p>آیا از لغو این درخواست مطمئن هستید؟</p>
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
              onPress={handleConfirmCancel}
              isLoading={isSendingMessage}
            >
              لغو درخواست
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}

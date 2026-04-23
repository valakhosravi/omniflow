import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import CustomButton from "./Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number | string) => void;
  itemId: number | string;
  isLoading?: boolean;
  description?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemId,
  isLoading: externalIsLoading,
  description,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-accent-500">تایید حذف</ModalHeader>
            <ModalBody>
              <p>
                {description ? description : "آیا از حذف این مورد مطمئن هستید؟"}
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
                buttonVariant="danger"
                buttonSize="sm"
                onPress={() => onConfirm(itemId)}
                isLoading={externalIsLoading}
              >
                تایید حذف
              </CustomButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmModal;

"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { Danger } from "iconsax-reactjs";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      hideCloseButton
      className="w-[500px]"
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between font-semibold text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]">
          <span className="text-secondary-950">{title}</span>
          <span className="cursor-pointer" onClick={onClose}>
            <Icon name="close" className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

        <ModalBody className="px-[20px] py-0">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-danger/[.1] rounded-full flex items-center justify-center">
              <Danger size={24} className="text-danger" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] text-primary-950/[.7] leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[20px] pb-[20px] px-[20px]">
          <CustomButton
            type="button"
            buttonVariant="outline"
            onPress={onClose}
            disabled={isLoading}
          >
            انصراف
          </CustomButton>
          <CustomButton
            type="button"
            buttonVariant="primary"
            onPress={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className="!bg-danger hover:!bg-danger/[.9]"
          >
            حذف
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


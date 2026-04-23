"use client";

import { ModalBody, ModalFooter } from "@heroui/react";
import type { ChangeEvent } from "react";
import { AppButton } from "@/components/common/AppButton";
import { AppSelect } from "@/components/common/AppSelect";

type ActionSelectOption = {
  label: string;
  value: string | number;
};

type ActionSelectModalContentProps = {
  message?: string;
  selectLabel: string;
  options: ActionSelectOption[];
  selectedValue?: string;
  onSelectChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  isConfirmDisabled?: boolean;
  confirmLabel?: string;
  submittingLabel?: string;
  cancelLabel?: string;
};

export default function ActionSelectModalContent({
  message,
  selectLabel,
  options,
  selectedValue,
  onSelectChange,
  onClose,
  onConfirm,
  isSubmitting = false,
  isConfirmDisabled = false,
  confirmLabel = "تایید",
  submittingLabel,
  cancelLabel = "انصراف",
}: ActionSelectModalContentProps) {
  return (
    <>
      <ModalBody className="space-y-4">
        {message ? <p className="text-sm text-secondary-600">{message}</p> : null}
        <AppSelect
          label={selectLabel}
          required
          options={options}
          value={selectedValue ?? ""}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onSelectChange(String(e.target.value))
          }
        />
      </ModalBody>
      <ModalFooter>
        <AppButton
          label={cancelLabel}
          variant="outline"
          color="secondary"
          size="small"
          onClick={onClose}
        />
        <AppButton
          label={isSubmitting && submittingLabel ? submittingLabel : confirmLabel}
          variant="contained"
          color="primary"
          size="small"
          loading={isSubmitting}
          disabled={isConfirmDisabled}
          onClick={onConfirm}
        />
      </ModalFooter>
    </>
  );
}

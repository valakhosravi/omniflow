import { ModalBody, ModalFooter } from "@heroui/react";
import { AppButton } from "@/components/common/AppButton";
import type { ButtonColor } from "@/components/common/AppButton";

export type AppConfirmModalContentProps = {
  /** Warning / description message shown in the modal body */
  message: string;
  /** Called when the user presses the cancel button */
  onClose: () => void;
  /** Called when the user confirms the action */
  onConfirm: () => void;
  /** Whether the confirm action is in progress */
  isSubmitting?: boolean;
  /** Label for the confirm button */
  confirmLabel: string;
  /** Label shown on the confirm button while submitting */
  submittingLabel?: string;
  /** Label for the cancel button (defaults to "انصراف") */
  cancelLabel?: string;
  /** Color for the confirm button (defaults to "danger") */
  confirmColor?: ButtonColor;
};

export function AppConfirmModalContent({
  message,
  onClose,
  onConfirm,
  isSubmitting = false,
  confirmLabel,
  submittingLabel,
  cancelLabel = "انصراف",
  confirmColor = "danger",
}: AppConfirmModalContentProps) {
  return (
    <>
      <ModalBody>
        <p>{message}</p>
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
          label={
            isSubmitting && submittingLabel ? submittingLabel : confirmLabel
          }
          variant="contained"
          color={confirmColor}
          size="small"
          loading={isSubmitting}
          onClick={() => onConfirm()}
        />
      </ModalFooter>
    </>
  );
}

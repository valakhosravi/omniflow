import { ModalProps } from "@/models/modal/ModalProps";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@/ui/NextUi";
import { IoIosSave } from "react-icons/io";

export default function ModalTop({
  isOpen,
  onOpenChange,
  title,
  hasForm,
  onSubmit,
  modalBody,
  register,
  handleSubmit,
  errors,
  size,
}: ModalProps) {
  const modalContent = (
    <>
      <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>

      <ModalBody>{modalBody({ register, errors })} </ModalBody>
      <ModalFooter>
        <Button
          color="default"
          variant="light"
          onPress={() => onOpenChange(false)}
        >
          بستن
        </Button>
        <Button
          type="submit"
          color="primary"
          startContent={<IoIosSave className="size-5" />}
          onPress={!hasForm ? () => onOpenChange(false) : undefined}
        >
          ذخیره
        </Button>
      </ModalFooter>
    </>
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
      <ModalContent>
        {(onClose) =>
          hasForm ? (
            <form onSubmit={handleSubmit(onSubmit)}>{modalContent}</form>
          ) : (
            modalContent
          )
        }
      </ModalContent>
    </Modal>
  );
}

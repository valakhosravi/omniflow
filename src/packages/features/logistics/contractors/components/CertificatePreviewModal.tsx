import fetchImageFile from "@/components/food/FetchImageFile";
import { Icon } from "@/ui/Icon";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useEffect, useState } from "react";
interface CertificatePreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: string | undefined;
}

export default function CertificatePreviewModal({
  isOpen,
  onOpenChange,
  certificate,
}: CertificatePreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateFileLoading, setCertificateFileLoading] = useState(false);

  useEffect(() => {
    if (!certificateFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(certificateFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [certificateFile]);

  useEffect(() => {
    async function loadLogo() {
      setCertificateFileLoading(true);
      if (certificate) {
        const file = await fetchImageFile("invoice", certificate);
        setCertificateFile(file);
      } else {
        setCertificateFile(null);
      }
      setCertificateFileLoading(false);
    }
    loadLogo();
  }, [certificate]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent className="!w-[732px] max-w-[732px] max-h-[840px] overflow-y-auto">
        <ModalHeader className="flex justify-between items-center py-0 pt-[20px] px-[24px]">
          <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
            گواهی مالیات بر ارزش افزوده
          </h1>
          <Icon
            name="close"
            className="text-secondary-300 cursor-pointer"
            onClick={() => onOpenChange(false)}
          />
        </ModalHeader>
        <div className="mt-[8px] mx-[24px] bg-background-devider h-[1px]" />
        <ModalBody className="p-[16px] flex items-center justify-center">
          <img
            src={previewUrl ?? ""}
            alt="contractor logo"
            className="size-[500px] rounded-[16px] object-cover"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

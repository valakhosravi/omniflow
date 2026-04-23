"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  RadioGroup,
  Radio,
} from "@/ui/NextUi";
import CustomButton from "@/ui/Button";
import { SignatureSettings } from "../../shared/ContractContentGrid";

interface SignatureSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (settings: SignatureSettings) => void;
  signatureSettings: SignatureSettings;
  onSignatureSettingsChange: (settings: SignatureSettings) => void;
  isLoading?: boolean;
}

export default function SignatureSettingsModal({
  isOpen,
  onClose,
  onSubmit,
  signatureSettings,
  onSignatureSettingsChange,
  isLoading = false,
}: SignatureSettingsModalProps) {
  const handleSubmit = () => {
    onSubmit(signatureSettings);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-right">
              <h3 className="text-[18px] font-semibold text-primary-950">
                تنظیمات امضا
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-primary-950">
                    نام شرکت امضاکننده
                  </label>
                  <Input
                    value={signatureSettings.signerCompanyName}
                    onChange={(e) =>
                      onSignatureSettingsChange({
                        ...signatureSettings,
                        signerCompanyName: e.target.value,
                      })
                    }
                    placeholder="نام شرکت را وارد کنید"
                    size="sm"
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "border-primary-950/[.1]",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-primary-950">
                    نام شخص امضاکننده
                  </label>
                  <Input
                    value={signatureSettings.signerPerson}
                    onChange={(e) =>
                      onSignatureSettingsChange({
                        ...signatureSettings,
                        signerPerson: e.target.value,
                      })
                    }
                    placeholder="نام شخص را وارد کنید"
                    size="sm"
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "border-primary-950/[.1]",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-primary-950">
                    سمت سازمانی امضاکننده
                  </label>
                  <Input
                    value={signatureSettings.signerOrganizationPosition}
                    onChange={(e) =>
                      onSignatureSettingsChange({
                        ...signatureSettings,
                        signerOrganizationPosition: e.target.value,
                      })
                    }
                    placeholder="سمت سازمانی را وارد کنید"
                    size="sm"
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "border-primary-950/[.1]",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-primary-950 mb-1">
                    موقعیت امضا
                  </label>
                  <RadioGroup
                    value={signatureSettings.signaturePlacement}
                    onValueChange={(value) =>
                      onSignatureSettingsChange({
                        ...signatureSettings,
                        signaturePlacement: value as
                          | "endOfContract"
                          | "endOfEachPage",
                      })
                    }
                    orientation="vertical"
                    classNames={{
                      wrapper: "gap-2",
                    }}
                  >
                    <Radio
                      value="endOfContract"
                      classNames={{
                        label: "text-sm text-primary-950",
                      }}
                    >
                      نمایش در انتهای قرارداد
                    </Radio>
                    <Radio
                      value="endOfEachPage"
                      classNames={{
                        label: "text-sm text-primary-950",
                      }}
                    >
                      تکرار در انتهای هر صفحه
                    </Radio>
                  </RadioGroup>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2">
              <CustomButton
                color="default"
                variant="flat"
                onPress={onClose}
                isDisabled={isLoading}
              >
                انصراف
              </CustomButton>
              <CustomButton
                color="primary"
                onPress={handleSubmit}
                isLoading={isLoading}
              >
                ثبت نهایی قرارداد
              </CustomButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}


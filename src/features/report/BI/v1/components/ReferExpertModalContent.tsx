"use client";

import { useState } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { ModalBody, ModalFooter } from "@/ui/NextUi";
import AppButton from "@/components/common/AppButton/AppButton";
import { addToaster } from "@/ui/Toaster";

import type {
  GroupUserItem,
  ReferExpertModalContentProps,
} from "../reportV1.types";

export default function ReferExpertModalContent({
  onClose,
  onConfirm,
  groupUsers,
  isSubmitting,
}: ReferExpertModalContentProps) {
  const [selectedExpert, setSelectedExpert] = useState<GroupUserItem | null>(
    null,
  );

  const handleClose = () => {
    setSelectedExpert(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (!selectedExpert) {
      addToaster({
        color: "danger",
        title: "لطفا کارشناس را انتخاب کنید",
      });
      return;
    }

    await onConfirm({
      expertKey: selectedExpert.Key,
      expertPersonnelId: String(selectedExpert.PersonnelId),
    });
    setSelectedExpert(null);
  };

  return (
    <>
      <ModalBody className="px-[24px] py-0 space-y-4">
        <p className="font-medium text-[16px]/[30px] text-primary-950/[.5]">
          ارجاع به کارشناس
        </p>
        <div className="border border-primary-950/[.1] rounded-[20px] px-5 py-4 h-[150px] min-h-[150px]">
          <Autocomplete
            className="w-full"
            variant="bordered"
            label="کارشناس را انتخاب کنید :"
            labelPlacement="outside"
            isRequired
            placeholder="کارشناسان"
            selectedKey={selectedExpert?.Key}
            onSelectionChange={(key) => {
              const user = groupUsers.find((u) => u.Key === key);
              setSelectedExpert(user || null);
            }}
            errorMessage="انتخاب کارشناس ضروری است."
            popoverProps={{
              offset: 10,
              classNames: {
                content: "shadow-none",
              },
            }}
            inputProps={{
              classNames: {
                input: "font-normal text-[14px]/[20px] text-secondary-400",
                inputWrapper:
                  "px-[8px] py-[6px] border-1 border-primary-950/[.7] rounded-[12px] h-[48px] min-h-[48px] shadow-none",
                innerWrapper: "",
              },
            }}
            classNames={{
              base: "text-sm text-secondary-950 bg-white w-full",
              selectorButton: "text-secondary-400",
              popoverContent: "border border-default-300",
            }}
          >
            {groupUsers.map((user) => (
              <AutocompleteItem
                className="data-[selected=true]:opacity-60"
                key={user.Key}
              >
                {user.DisplayName}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
      </ModalBody>
      <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[150px] pb-[20px] px-[24px]">
        <AppButton
          variant="outline"
          size="small"
          label="انصراف"
          onClick={handleClose}
        />
        <AppButton
          color="primary"
          size="small"
          label="تایید"
          onClick={handleConfirm}
          loading={isSubmitting}
        />
      </ModalFooter>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import AppInput from "@/components/common/AppInput";
import AppFile from "@/components/common/AppFile";
import AppButton from "@/components/common/AppButton/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import useSectionFormValidation, {
  SectionFormValues,
} from "../validations/useSectionFormValidation";
import {
  useCreateSectionMutation,
  useCreateSectionAndUploadFileMutation,
  useUpdateSectionMutation,
  useGetSectionByIdQuery,
} from "../learning.services";

interface SectionFormProps {
  isOpen: boolean;
  onOpenChange: () => void;
  sectionId: number | null;
  seasonId: number;
}

export default function SectionForm({
  isOpen,
  onOpenChange,
  sectionId,
  seasonId,
}: SectionFormProps) {
  const [files, setFiles] = useState<FileType[]>([]);

  const { data: sectionData } = useGetSectionByIdQuery(sectionId!, {
    skip: !sectionId,
  });
  const [createSection, { isLoading: isCreating }] =
    useCreateSectionMutation();
  const [createSectionAndUploadFile, { isLoading: isCreatingWithFile }] =
    useCreateSectionAndUploadFileMutation();
  const [updateSection, { isLoading: isUpdating }] =
    useUpdateSectionMutation();

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useSectionFormValidation();

  useEffect(() => {
    if (sectionId && sectionData?.Data) {
      const d = sectionData.Data;
      setValue("Title", d.Title ?? "");
      setValue("OrderNumber", d.OrderNumber);
    } else {
      reset();
    }
  }, [sectionId, sectionData, setValue, reset]);

  const onSubmit = async (data: SectionFormValues) => {
    if (sectionId) {
      await updateSection({
        id: sectionId,
        body: {
          SeasonId: seasonId,
          SectionId: sectionId,
          Title: data.Title,
          OrderNumber: data.OrderNumber,
        },
      });
    } else {
      const actualFiles = files
        .map((f) => f.file)
        .filter((f): f is File => !!f);

      if (actualFiles.length > 0) {
        await createSectionAndUploadFile({
          SeasonId: seasonId,
          Title: data.Title,
          OrderNumber: data.OrderNumber,
          Files: actualFiles,
        });
      } else {
        await createSection({
          SeasonId: seasonId,
          Title: data.Title,
          OrderNumber: data.OrderNumber,
        });
      }
    }
    reset();
    setFiles([]);
    onOpenChange();
  };

  const handleModalChange = (open: boolean) => {
    if (!open && sectionId === null) {
      reset();
      setFiles([]);
    }
    onOpenChange();
  };

  const isSubmitting = isCreating || isCreatingWithFile || isUpdating;

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={handleModalChange}
      className="w-[546px] min-w-[546px]"
    >
      <ModalContent>
        <ModalHeader
          className="flex items-center justify-between font-semibold
          text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]"
        >
          <span className="text-secondary-950">
            {sectionId ? "ویرایش بخش" : "اضافه کردن بخش"}
          </span>
          <span className="cursor-pointer" onClick={() => onOpenChange()}>
            <AppIcon name="CloseCircle" size={20} className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-[506px] mx-auto mb-[15px]" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[20px] px-[20px]"
        >
          <ModalBody className="p-0">
            <div className="space-y-4 mb-[32px]">
              <Controller
                name="Title"
                control={control}
                render={({ field }) => (
                  <AppInput
                    label="عنوان بخش"
                    required
                    placeholder="عنوان بخش را وارد کنید"
                    error={errors.Title?.message}
                    className="w-full"
                    dir="rtl"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
              <Controller
                name="OrderNumber"
                control={control}
                render={({ field }) => (
                  <AppInput
                    label="ترتیب"
                    required
                    placeholder="ترتیب نمایش"
                    type="number"
                    error={errors.OrderNumber?.message}
                    className="w-full"
                    dir="ltr"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              {!sectionId && (
                <AppFile
                  enableUpload
                  featureName={FeatureNamesEnum.LEARNING}
                  files={files}
                  setFiles={setFiles}
                  isMultiple
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter className="px-0">
            <AppButton
              type="submit"
              color="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
              label={sectionId ? "ویرایش بخش" : "اضافه کردن بخش"}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

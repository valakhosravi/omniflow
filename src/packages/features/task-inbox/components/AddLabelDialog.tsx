"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import useNameValidation from "../validation/addLabelValidation";
import RHFInput from "@/ui/RHFInput";
import CustomButton from "@/ui/Button";
import { useLabels } from "../hooks/useLabels";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import { CreateLabelRequest } from "../types/CreateLabelRequest";
import { Icon } from "@/ui/Icon";

interface AddLabelDialogProps {
  isOpen: boolean;
  onOpenChange: () => void;
  editId?: number;
  onClose: () => void;
}

const PRESET_COLORS = [
  "#F2B2A8",
  "#FCD2E0",
  "#E3D7FF",
  "#99D7E4",
  "#B6CFF5",
  "#E7E7E7",
  "#FB4C30",
  "#F691B2",
  "#B99AFF",
  "#2EA2BB",
  "#4A85E7",
  "#A2DCC1",
  "#FFC8AF",
  "#FFDEB5",
  "#B4EFD3",
  "#FDEDC1",
  "#FBE983",
  "#17A765",
  "#43D692",
  "#CCA6AC",
  "#EBDBDE",
  "#FFAD45",
  "#FF7537",
];

export default function AddLabelDialog({
  isOpen,
  onOpenChange,
  editId,
  onClose,
}: AddLabelDialogProps) {
  const {
    createLabel,
    isCreating,
    labels,
    editLabel,
    isEditing,
    isCreateSuccessful,
    createdLabel,
    isEditSuccessful,
    editedLabel,
  } = useLabels();

  const editLabelData =
    labels?.Data && labels?.Data.find((label) => label.LabelId === editId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useNameValidation();

  useEffect(() => {
    if (isCreateSuccessful && createdLabel) {
      onClose();
    }
  }, [isCreateSuccessful, createdLabel]);

  useEffect(() => {
    if (isEditSuccessful && editedLabel) {
      onClose();
    }
  }, [isEditSuccessful, editedLabel]);

  useEffect(() => {
    if (isOpen) {
      if (editId && editLabelData) {
        reset({
          Name: editLabelData.Name,
          ColorCode: editLabelData.ColorCode,
        });
      } else {
        reset({
          Name: "",
          ColorCode: "",
        });
      }
    }
  }, [isOpen, editId, editLabelData, reset]);

  const onSubmit = (data: CreateLabelRequest) => {
    if (editId !== undefined && editId !== 0) {
      editLabel({ id: editId, body: data });
    } else {
      createLabel({
        ...data,
      });
    }
  };

  const handleModalChange = (open: boolean) => {
    if (!open) {
      reset({
        Name: "",
        ColorCode: "",
      });
    }
    onOpenChange();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <ModalContent className="!w-[483px] max-w-[483px] max-h-[444px]">
        <ModalHeader className="flex justify-between items-center pt-[24px] px-[24px]">
          {editId ? (
            <h1 className="font-semibold text-[16px]/[24px] text-secondary-950">
              ویرایش برچسب
            </h1>
          ) : (
            <h1 className="font-semibold text-[16px]/[24px] text-secondary-950">
              اضافه کردن برچسب
            </h1>
          )}
          <Icon
            name="closeCircle"
            className="text-secondary-300 cursor-pointer"
            onClick={() => onClose()}
          />
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="px-[24px] py-0 space-y-3">
            <RHFInput
              label="نام برچسب"
              placeholder="نام برچسب را وارد کنید"
              required
              register={register("Name")}
              error={errors.Name?.message}
              width={330}
              height={48}
              inputDirection="rtl"
              textAlignment="text-right"
            />

            <div className="space-y-[10px]">
              <div className="font-bold text-[14px]/[20px] text-secondary-950">
                <span>رنگ برچسب </span>
                <span className="text-accent-500">*</span>
              </div>

              <Controller
                name="ColorCode"
                control={control}
                render={({ field }) => (
                  <div
                    className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-x-2 gap-y-3"
                    dir="ltr"
                  >
                    {PRESET_COLORS.map((color) => {
                      const isActive = field.value === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          className={`w-5 h-5 rounded-full transition-all
                            flex items-center justify-center
                            ${
                              isActive
                                ? "scale-110 outline-4"
                                : "hover:scale-105 outline-1"
                            }`}
                          style={{
                            backgroundColor: color,
                            outlineColor: isActive
                              ? `${color}4D`
                              : "transparent", // 4D hex = 30% opacity
                          }}
                          onClick={() => field.onChange(color)}
                          aria-label={`انتخاب رنگ ${color}`}
                        >
                          {isActive && (
                            <Icon name="tick" className="text-secondary-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.ColorCode && (
                <span className="text-red-500 text-sm">
                  {errors.ColorCode.message}
                </span>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="flex items-center justify-between gap-x-[16px] pt-[56px] pb-[24px] px-[24px]">
            <CustomButton
              type="submit"
              className="flex items-center justify-center min-w-[304px] min-h-[48px]
              btn-primary rounded-[12px] text-secondary-0 cursor-pointer font-semibold text-[14px]/[20px]"
              isLoading={isCreating || isEditing}
              isDisabled={isCreating || isEditing}
            >
              {editId ? "ویرایش برچسب" : "اضافه کردن برچسب"}
            </CustomButton>
            <CustomButton
              className="flex items-center justify-center min-w-[115px] min-h-[48px]
               btn-outline rounded-[12px] cursor-pointer font-semibold text-[14px]/[20px]"
              onPress={() => {
                reset();
                onClose();
              }}
            >
              انصراف
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

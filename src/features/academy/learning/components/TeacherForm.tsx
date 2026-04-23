"use client";

import { useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import AppInput from "@/components/common/AppInput";
import AppButton from "@/components/common/AppButton/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import useTeacherFormValidation, {
  TeacherFormValues,
} from "../validations/useTeacherFormValidation";
import {
  useCreateTeacherMutation,
  useGetTeacherByIdQuery,
  useUpdateTeacherMutation,
} from "../learning.services";

interface TeacherFormProps {
  isOpen: boolean;
  onOpenChange: () => void;
  teacherId: number | null;
}

export default function TeacherForm({
  isOpen,
  onOpenChange,
  teacherId,
}: TeacherFormProps) {
  const { data: teacherData } = useGetTeacherByIdQuery(teacherId!, {
    skip: !teacherId,
  });
  const [createTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();
  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useTeacherFormValidation();

  useEffect(() => {
    if (teacherId && teacherData?.Data) {
      const d = teacherData.Data;
      setValue("FullName", d.FullName ?? "");
      setValue("Mobile", d.Mobile ?? "");
    } else {
      reset();
    }
  }, [teacherId, teacherData, setValue, reset]);

  const onSubmit = async (data: TeacherFormValues) => {
    if (teacherId) {
      await updateTeacher({
        id: teacherId,
        body: {
          FullName: data.FullName,
          Mobile: data.Mobile,
        },
      });
    } else {
      await createTeacher({
        FullName: data.FullName,
        Mobile: data.Mobile,
      });
    }
    reset();
    onOpenChange();
  };

  const handleModalChange = (open: boolean) => {
    if (!open && teacherId === null) {
      reset();
    }
    onOpenChange();
  };

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={handleModalChange}
      className="w-[746px] min-w-[746px]"
    >
      <ModalContent>
        <ModalHeader
          className="flex items-center justify-between font-semibold
          text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]"
        >
          <span className="text-secondary-950">
            {teacherId ? "ویرایش مدرس" : "اضافه کردن مدرس"}
          </span>
          <span className="cursor-pointer" onClick={() => onOpenChange()}>
            <AppIcon name="CloseCircle" size={20} className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-[706px] mx-auto mb-[15px]" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[20px] px-[20px]"
        >
          <ModalBody className="p-0">
            <div className="space-y-4 mb-[32px]">
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="FullName"
                  control={control}
                  render={({ field }) => (
                    <AppInput
                      label="نام مدرس"
                      required
                      placeholder="نام مدرس را وارد کنید"
                      error={errors.FullName?.message}
                      className="w-full"
                      dir="rtl"
                      {...field}
                      value={field.value ?? ""}
                    />
                  )}
                />
                <Controller
                  name="Mobile"
                  control={control}
                  render={({ field }) => (
                    <AppInput
                      label="موبایل"
                      required
                      placeholder="شماره موبایل را وارد کنید"
                      error={errors.Mobile?.message}
                      className="w-full"
                      dir="ltr"
                      {...field}
                      value={field.value ?? ""}
                    />
                  )}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="px-0">
            <AppButton
              type="submit"
              color="primary"
              disabled={isCreating || isUpdating}
              loading={isCreating || isUpdating}
              label={teacherId ? "ویرایش مدرس" : "اضافه کردن مدرس"}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

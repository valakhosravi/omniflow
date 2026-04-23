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
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  useCreateSeasonMutation,
  useUpdateSeasonMutation,
  useGetSeasonByIdQuery,
} from "../learning.services";
import { SeasonFormValues } from "../learning.types";
import useSeasonFormValidation from "../hooks/useSeasonFormValidation";

interface SeasonFormProps {
  isOpen: boolean;
  onOpenChange: () => void;
  seasonId: number | null;
  courseId: number;
}

export default function SeasonForm({
  isOpen,
  onOpenChange,
  seasonId,
  courseId,
}: SeasonFormProps) {
  const { data: seasonData } = useGetSeasonByIdQuery(seasonId!, {
    skip: !seasonId,
  });
  const [createSeason, { isLoading: isCreating }] = useCreateSeasonMutation();
  const [updateSeason, { isLoading: isUpdating }] = useUpdateSeasonMutation();

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useSeasonFormValidation();

  useEffect(() => {
    if (seasonId && seasonData?.Data) {
      const d = seasonData.Data;
      setValue("Title", d.Title ?? "");
      setValue("OrderNumber", d.OrderNumber);
    } else {
      reset();
    }
  }, [seasonId, seasonData, setValue, reset]);

  const onSubmit = async (data: SeasonFormValues) => {
    if (seasonId) {
      await updateSeason({
        id: seasonId,
        body: {
          CourseId: courseId,
          Title: data.Title,
          OrderNumber: data.OrderNumber,
        },
      });
    } else {
      await createSeason({
        CourseId: courseId,
        Title: data.Title,
        OrderNumber: data.OrderNumber,
      });
    }
    reset();
    onOpenChange();
  };

  const handleModalChange = (open: boolean) => {
    if (!open && seasonId === null) {
      reset();
    }
    onOpenChange();
  };

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
            {seasonId ? "ویرایش فصل" : "اضافه کردن فصل"}
          </span>
          <span className="cursor-pointer" onClick={() => onOpenChange()}>
            <Icon name="close" className="text-secondary-300" />
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
                    label="عنوان فصل"
                    required
                    placeholder="عنوان فصل را وارد کنید"
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
            </div>
          </ModalBody>
          <ModalFooter className="px-0">
            <CustomButton
              type="submit"
              buttonVariant="primary"
              buttonSize="md"
              isDisabled={isCreating || isUpdating}
              isLoading={isCreating || isUpdating}
              className="font-semibold text-[14px]/[20px]"
            >
              {seasonId ? "ویرایش فصل" : "اضافه کردن فصل"}
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

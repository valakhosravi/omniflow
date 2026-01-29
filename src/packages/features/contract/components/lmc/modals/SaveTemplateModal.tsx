"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import { Checkbox } from "@heroui/react";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import RHFInput from "@/ui/RHFInput";
import RHFSelect from "@/ui/RHFSelect";
import { useForm, Controller } from "react-hook-form";
import { ContractClauseDetails, Category } from "../../../types/contractModel";
import { useContractCategories } from "../../../hook/contractHook";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter } from "next/navigation";

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SaveTemplateData) => void;
  contractClauses: ContractClauseDetails[];
  isLoading?: boolean;
}

export interface SaveTemplateData {
  CategoryId: number;
  Name: string;
  Description: string;
  Template: string;
  IsPersonal: boolean;
}

interface TemplateFormData {
  CategoryId: number;
  name: string;
  description: string;
  isPersonal: boolean;
}

export default function SaveTemplateModal({
  isOpen,
  onClose,
  onSave,
  contractClauses,
  isLoading = false,
}: SaveTemplateModalProps) {
  const { userDetail } = useAuth();
  const hasPersonalService = userDetail?.ServiceIds.includes(6047);
  const { categories, isLoading: isLoadingCategories } =
    useContractCategories();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<TemplateFormData>({
    defaultValues: {
      CategoryId: 0,
      name: "",
      description: "",
      isPersonal: true,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset({
        CategoryId: 0,
        name: "",
        description: "",
        isPersonal: true,
      });
    } else if (hasPersonalService) {
      // When modal opens and user has service 6047, ensure IsPersonal is always true
      reset({
        CategoryId: 0,
        name: "",
        description: "",
        isPersonal: true,
      });
    }
  }, [isOpen, reset, hasPersonalService]);

  const onSubmit = (data: TemplateFormData) => {
    // Convert contract clauses to JSON string
    const templateString = JSON.stringify(contractClauses);

    const saveData: SaveTemplateData = {
      CategoryId: data.CategoryId,
      Name: data.name,
      Description: data.description,
      Template: templateString,
      // If user has service 6047, IsPersonal is always true
      IsPersonal: hasPersonalService ? true : data.isPersonal,
    };

    onSave(saveData);

    // Clear local storage data after successful submission
    localStorage.removeItem("contract_draft_data");
    localStorage.removeItem("contractFormData");

    router.push("/contract");
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const categoryOptions =
    categories?.map((category) => ({
      value: category.CategoryId,
      label: category.Name,
    })) || [];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      hideCloseButton
      isDismissable={!isLoading}
      isKeyboardDismissDisabled={isLoading}
      className="max-w-[600px]"
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between font-semibold text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]">
          <span className="text-secondary-950">ذخیره به عنوان قالب</span>
          <span
            className={`cursor-pointer ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={handleClose}
          >
            <Icon name="close" className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="px-[20px] py-0">
            <div className="space-y-4 py-4">
              <p className="text-[14px] text-primary-950/[.7] mb-4">
                قرارداد فعلی را به عنوان قالب ذخیره کنید تا بتوانید بعداً از آن
                استفاده کنید.
              </p>

              <RHFSelect
                label="دسته‌بندی"
                name="CategoryId"
                control={control}
                error={errors.CategoryId?.message}
                placeholder="دسته‌بندی را انتخاب کنید"
                required
                fullWidth
                readOnly={isLoading}
                rules={{
                  required: "دسته‌بندی الزامی است",
                  validate: (value: number) =>
                    value > 0 || "لطفا دسته‌بندی را انتخاب کنید",
                }}
                options={categoryOptions}
              />

              <RHFInput
                label="نام قالب"
                name="name"
                register={register("name", {
                  required: "نام قالب الزامی است",
                  minLength: {
                    value: 2,
                    message: "نام قالب باید حداقل 2 کاراکتر باشد",
                  },
                })}
                error={errors.name?.message}
                isDisabled={isLoading}
                placeholder="مثال: قرارداد استاندارد"
                inputDirection="rtl"
                textAlignment="text-right"
                fullWidth
              />

              <RHFInput
                label="توضیحات"
                name="description"
                register={register("description", {
                  required: "توضیحات الزامی است",
                  minLength: {
                    value: 5,
                    message: "توضیحات باید حداقل 5 کاراکتر باشد",
                  },
                })}
                error={errors.description?.message}
                isDisabled={isLoading}
                placeholder="توضیحات مختصری درباره قالب..."
                inputDirection="rtl"
                textAlignment="text-right"
                fullWidth
              />

              {/* {!hasPersonalService && (
                <div className="flex items-center gap-2">
                  <Controller
                    name="isPersonal"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        isSelected={value}
                        onValueChange={onChange}
                        isDisabled={isLoading}
                        classNames={{
                          wrapper: "after:bg-primary-950",
                        }}
                      >
                        <span className="text-sm text-secondary-950">
                          ذخیره به عنوان قالب شخصی
                        </span>
                      </Checkbox>
                    )}
                  />
                </div>
              )} */}
              {/* {hasPersonalService && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={true}
                    isDisabled={true}
                    classNames={{
                      wrapper: "after:bg-primary-950",
                    }}
                  >
                    <span className="text-sm text-secondary-950">
                      ذخیره به عنوان قالب شخصی
                    </span>
                  </Checkbox>
                </div>
              )} */}
            </div>
          </ModalBody>

          <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[20px] pb-[20px] px-[20px]">
            <CustomButton
              buttonVariant="outline"
              onPress={handleClose}
              disabled={isLoading}
              type="button"
            >
              انصراف
            </CustomButton>
            <CustomButton
              buttonVariant="primary"
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              گام بعدی
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

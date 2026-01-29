"use client";

import { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import RHFInput from "@/ui/RHFInput";
import RHFSelect from "@/ui/RHFSelect";
import { useForm } from "react-hook-form";
import { useContractCategories } from "../../../hook/contractHook";
import { useUpdateSubCategoryWithFieldsMutation } from "../../../api/contractApi";
import { useRouter } from "next/navigation";

interface SaveTemplateWithFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SaveTemplateWithFieldsFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<SaveTemplateWithFieldsFormData>;
  isUpdateMode?: boolean;
  subCategoryId?: number;
}

export interface SaveTemplateWithFieldsFormData {
  CategoryId: number;
  Name: string;
  Description: string;
}

interface TemplateFormData {
  CategoryId: number;
  name: string;
  description: string;
}

export default function SaveTemplateWithFieldsModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  initialData,
  isUpdateMode = false,
  subCategoryId,
}: SaveTemplateWithFieldsModalProps) {
  const { categories, isLoading: isLoadingCategories } = useContractCategories();
  const [updateSubCategory] = useUpdateSubCategoryWithFieldsMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<TemplateFormData>({
    defaultValues: {
      CategoryId: initialData?.CategoryId || 0,
      name: initialData?.Name || "",
      description: initialData?.Description || "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset({
        CategoryId: 0,
        name: "",
        description: "",
      });
    }
  }, [isOpen, reset]);

  // Set form values when initialData changes (for update mode)
  useEffect(() => {
    if (isOpen && initialData) {
      setValue("CategoryId", initialData.CategoryId || 0);
      setValue("name", initialData.Name || "");
      setValue("description", initialData.Description || "");
    }
  }, [isOpen, initialData, setValue]);

  const onSubmit = async (data: TemplateFormData) => {
    const saveData: SaveTemplateWithFieldsFormData = {
      CategoryId: data.CategoryId,
      Name: data.name,
      Description: data.description,
    };

    if (isUpdateMode && subCategoryId) {
      // Update existing subcategory
      try {
        await updateSubCategory({
          id: subCategoryId,
          body: {
            CategoryId: data.CategoryId,
            Name: data.name,
            Description: data.description,
            Template: "", // Keep existing template
            IsPersonal: true, // Personal templates
            SubCategoryFields: [], // Keep existing fields
          },
        }).unwrap();
      } catch (error) {
        console.error("Error updating subcategory:", error);
        return; // Don't proceed if update fails
      }
    }

    onSave(saveData);

    // Clear local storage data after successful submission
    localStorage.removeItem('contract_draft_data');
    localStorage.removeItem('contractFormData');

    reset();

    // Only navigate to create page if not in update mode
    if (!isUpdateMode) {
      router.push(`/contract/personal-template/create?categoryId=${data.CategoryId}`);
    }
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
          <span className="text-secondary-950">
            {isUpdateMode ? "ویرایش قالب" : "ذخیره به عنوان قالب"}
          </span>
          <span
            className={`cursor-pointer ${isLoading ? "pointer-events-none opacity-50" : ""}`}
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
                {isUpdateMode
                  ? "اطلاعات قالب را ویرایش کنید."
                  : "قرارداد فعلی را به عنوان قالب ذخیره کنید تا بتوانید بعداً از آن استفاده کنید."
                }
              </p>

              <RHFSelect
                label="دسته‌بندی"
                name="CategoryId"
                control={control}
                error={errors.CategoryId?.message}
                placeholder="دسته‌بندی را انتخاب کنید"
                required
                fullWidth
                readOnly={isLoading || isLoadingCategories}
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
              disabled={isLoading || isLoadingCategories}
            >
              {isUpdateMode ? "به‌روزرسانی قالب" : "ذخیره قالب"}
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}


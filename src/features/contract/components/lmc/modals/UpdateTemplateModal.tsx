"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import RHFInput from "@/ui/RHFInput";
import RHFSelect from "@/ui/RHFSelect";
import { useForm } from "react-hook-form";
import {
  ContractClauseDetails,
  SaveTemplateData,
} from "../../../contract.types";
import { useContractCategories } from "../../../hook/contractHook";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomButton from "@/ui/Button";
import { useUpdateSubCategoryPersonalTemplateMutation } from "@/features/contract/contract.services";
import { addToaster } from "@/ui/Toaster";
import { AppIcon } from "@/components/common/AppIcon";

interface UpdateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractClauses: ContractClauseDetails[];
  isLoading?: boolean;
  templateId: string;
}

interface TemplateFormData {
  CategoryId: number;
  name: string;
  description: string;
  isPersonal: boolean;
}

export default function UpdateTemplateModal({
  isOpen,
  onClose,
  contractClauses,
  templateId,
}: UpdateTemplateModalProps) {
  const { userDetail } = useAuth();
  const hasPersonalService = userDetail?.ServiceIds.includes(6047);
  const { categories } = useContractCategories();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<TemplateFormData>({
    defaultValues: {
      CategoryId: 0,
      name: "",
      description: "",
      isPersonal: true,
    },
  });
  const [update, { isLoading }] =
    useUpdateSubCategoryPersonalTemplateMutation();

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

    update({
      body: saveData,
      subCategoryId: Number(templateId),
    })
      .then(() => {
        // Clear local storage data after successful submission
        localStorage.removeItem("contract_draft_data");
        localStorage.removeItem("contractFormData");

        router.push("/issue/contract");
        reset();
      })
      .catch(() => {
        addToaster({
          title: "خطا در ذخیره اطلاعات",
          color: "danger",
        });
      });
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
            <AppIcon name="CloseCircle" className="text-neutral-500" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="px-[20px] py-0">
            <div className="space-y-4 py-4">
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

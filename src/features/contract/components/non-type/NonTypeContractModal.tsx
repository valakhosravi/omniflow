"use client";

import { AppDispatch } from "@/store/store";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Autocomplete,
  AutocompleteItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import RHFInput from "@/ui/RHFInput";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  setcontractTitle,
  setCategoryId,
} from "../../contract.slices";
import { useCallback, useState, useEffect } from "react";
import { Category, SubCategory } from "../../contract.types";

interface NonTypeContractModalProps {
  isOpen: boolean;
  onOpenChange: (open?: boolean) => void;
  isTemplate: boolean;
  categoryId: number | null;
  subCategoryId?: number | null;
  nonTypeContracts: SubCategory[];
  categories: Category[];
}

interface NonTypeContractEntriesFormData {
  title: string;
}

export default function NonTypeContractModal({
  isOpen,
  onOpenChange,
  isTemplate,
  categoryId,
  subCategoryId,
  categories,
}: NonTypeContractModalProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<NonTypeContractEntriesFormData>();
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categoryId,
  );

  const handleCancle = () => {
    reset();
    onOpenChange(false);
  };

  const handleModalChange = (open: boolean) => {
    if (!open) {
      reset({
        title: "",
      });
      setSelectedCategoryId(categoryId);
    }
    onOpenChange();
  };

  // Update selected category when categoryId prop changes
  useEffect(() => {
    setSelectedCategoryId(categoryId);
  }, [categoryId]);

  const onSubmit = useCallback(
    (data: NonTypeContractEntriesFormData) => {
      const finalCategoryId = selectedCategoryId || categoryId;
      dispatch(setcontractTitle(data.title));
      dispatch(setCategoryId(finalCategoryId));
      setLoading(true);
      if (isTemplate) {
        router.push(
          `/issue/contract/personal-template/create?categoryId=${finalCategoryId}`,
        );
      } else {
        const url = subCategoryId
          ? `/issue/contract/non-type/?categoryId=${finalCategoryId}&subCategoryId=${subCategoryId}`
          : `/issue/contract/non-type/?categoryId=${finalCategoryId}`;
        router.push(url);
      }
    },
    [
      isTemplate,
      categoryId,
      selectedCategoryId,
      subCategoryId,
      dispatch,
      router,
    ],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !errors.title) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
        <ModalContent className="!w-[547px] max-w-[547px] h-[406px]">
          <ModalHeader className="flex justify-between items-center px-[16px] pt-[16px] pb-0">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              انتخاب عنوان قرارداد
            </h1>
            <Icon
              name="closeCircle"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onOpenChange(false)}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[16px] bg-background-devider h-[1px]" />
          <ModalBody className="px-4 py-0 space-y-4">
            <p className="font-medium text-sm text-primary-950/[.5]">
              لطفا عنوان قرداد را انتخاب کرده و روی مرحله بعدی کلیک کنید.
            </p>
            <Autocomplete
              className="w-full"
              variant="bordered"
              label="انتخاب نوع قرارداد"
              labelPlacement="outside"
              isRequired
              placeholder="انواع قرارداد"
              selectedKey={selectedCategoryId?.toString() || null}
              onSelectionChange={(key) => {
                if (key) {
                  const categoryIdNum = Number(key);
                  setSelectedCategoryId(categoryIdNum);
                  dispatch(setCategoryId(categoryIdNum));
                }
              }}
              errorMessage={`انتخاب نوع قرارداد ضروری است.`}
              popoverProps={{
                offset: 10,
                classNames: {
                  content: "shadow-none",
                },
              }}
              inputProps={{
                classNames: {
                  input: `font-normal text-[14px]/[20px] text-secondary-400`,
                  inputWrapper: `px-[8px] py-[6px] border-1 border-primary-950/[.7] rounded-[12px] h-[48px] min-h-[48px] shadow-none`,
                  innerWrapper: ``,
                  label: `font-bold text-[14px]/[20px] text-secondary-950`,
                },
              }}
              classNames={{
                base: `text-sm text-secondary-950 bg-white w-[213px]`,
                selectorButton: `text-secondary-400`,
                popoverContent: `border border-default-300`,
              }}
            >
              {categories.map((category) => {
                return (
                  <AutocompleteItem
                    className="data-[selected=true]:opacity-60"
                    key={category.CategoryId}
                  >
                    {category.Name}
                  </AutocompleteItem>
                );
              })}
            </Autocomplete>
            <RHFInput
              key={"title"}
              label="عنوان قرارداد"
              name={"title"}
              required
              register={register("title", {
                required: "عنوان قرارداد الزامی است.",
              })}
              error={errors.title?.message}
              control={control}
              width={515}
              height={48}
              inputDirection="rtl"
              textAlignment="text-right"
              className="w-[515px]"
            />
          </ModalBody>
          <ModalFooter className="px-[16px] flex items-center self-end gap-x-[16px] font-semibold text-[14px]/[23px]">
            <CustomButton
              buttonVariant="outline"
              buttonSize="sm"
              onPress={handleCancle}
            >
              انصراف
            </CustomButton>
            <CustomButton
              buttonVariant="primary"
              buttonSize="sm"
              type="submit"
              isLoading={loading}
            >
              مرحله بعدی
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

import {
  useCreateMeal,
  useEditMeal,
  useGetMealById,
} from "@/hooks/food/useMealAction";
import { useGetSupplierList } from "@/hooks/food/useSupplierAction";
import { CreateMealInput } from "@/models/food/meal/CreateMealInput";
import FieldInput from "@/components/food/FieldInput";
import useCreateMealValidation from "@/validations/CreateMealValidation";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import fetchImageFile, { GetImageUrl } from "../FetchImageFile";
import { Icon } from "@/ui/Icon";
import CustomButton from "@/ui/Button";
import RHFInput from "@/ui/RHFInput";
import { FormSelect, transformToOptions } from "@/ui/RHFSelect";

interface MealFormsProps {
  isCreateOpen: boolean;
  onCreateOpenChange: () => void;
  setCoverImageUrl: (url: string | null) => void;
  coverImageUrl: string | null;
  mealId: number | null;
}

export default function MealForms({
  isCreateOpen,
  coverImageUrl,
  onCreateOpenChange,
  setCoverImageUrl,
  mealId,
}: MealFormsProps) {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const onPress = () => {
    setCoverImageUrl(null);
    setValue("ImageFile", null);
  };

  const { supplierData } = useGetSupplierList(1, 6);
  const { createMeal, isCreating } = useCreateMeal();
  const { editMeal, isEditing } = useEditMeal();
  const { mealData } = useGetMealById(mealId);

  const mealTypeOptions = [
    { name: "غذای اصلی", id: 1 },
    // { name: "پیش غذا", id: 2 },
    { name: "دسر", id: 3 },
    { name: "نوشیدنی", id: 4 },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
    watch,
  } = useCreateMealValidation(
    mealData?.Data
      ? {
          ...mealData.Data,
          ImageFile: null,
        }
      : {
          Name: "",
          SupplierId: null,
          Description: "",
          Price: null,
          ImageFile: null,
          MealType: null,
        },
    !!mealId,
  );

  useEffect(() => {
    async function fetchImageIfNeeded() {
      if (mealId && mealData?.Data) {
        setValue("Name", mealData.Data.Name || "");
        setValue("SupplierId", mealData.Data.SupplierId);
        setValue("MealType", mealData.Data.MealType);
        setValue("Description", mealData.Data.Description || "");
        setValue("Price", mealData.Data.Price);

        const imageUrl = mealData.Data.ImageAddress;
        if (imageUrl) {
          setIsImageLoading(true);
          try {
            const file = await fetchImageFile("food", imageUrl);
            if (file) {
              setValue("ImageFile", file, { shouldValidate: true });
              const objectUrl = URL.createObjectURL(file);
              setCoverImageUrl(objectUrl);
            } else {
              console.warn(
                "Failed to fetch image file, but continuing with edit",
              );
              // When editing, if image fetch fails, construct proper URL for preview
              // The backend should handle the existing image
              const fullImageUrl = GetImageUrl({
                bucketName: "food",
                path: imageUrl,
              });
              setCoverImageUrl(fullImageUrl);
            }
          } catch (error) {
            console.error("Error fetching image:", error);
            // Construct proper URL for preview even if fetch fails
            const fullImageUrl = GetImageUrl({
              bucketName: "food",
              path: imageUrl,
            });
            setCoverImageUrl(fullImageUrl);
          } finally {
            setIsImageLoading(false);
          }
        } else {
          setCoverImageUrl(null);
        }
      } else {
        reset();
        setCoverImageUrl(null);
      }
    }

    fetchImageIfNeeded();
  }, [mealId, mealData, setValue, reset, setCoverImageUrl]);

  const onSubmit = (data: CreateMealInput) => {
    setHasSubmitted(true);

    if (mealId) {
      // When editing, if ImageFile is null but ImageAddress exists,
      // the backend should use the existing image
      const editData = {
        MealId: mealId,
        ...data,
        IsActive: mealData?.Data?.IsActive ?? true,
        CreatedDate: mealData?.Data?.CreatedDate || new Date().toISOString(),
        Supplier: mealData?.Data?.Supplier || {
          SupplierId: 0,
          Name: "",
          Address: "",
          Phone: "",
          CreatedDate: new Date().toISOString(),
        },
      };

      editMeal(editData, {
        onSuccess: () => {
          onCreateOpenChange();
          setIsImageLoading(false);
          setHasSubmitted(false);
        },
        onError: (error) => {
          console.error("Edit meal failed:", error);
          setHasSubmitted(false);
        },
      });
    } else {
      createMeal(
        {
          ...data,
          SupplierId: data.SupplierId,
        },
        {
          onSuccess: () => {
            reset(
              {
                Name: "",
                SupplierId: null,
                Price: null,
                ImageFile: null,
                MealType: null,
              },
              {
                keepErrors: false,
                keepDirty: false,
                keepTouched: false,
              },
            );
            setCoverImageUrl(null);
            onCreateOpenChange();
            setHasSubmitted(false);
          },
          onError: (error) => {
            console.error("Create meal failed:", error);
            setHasSubmitted(false);
          },
        },
      );
    }
  };

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    setHasSubmitted(true);
  };

  const handleModalChange = (open: boolean) => {
    if (!open && mealId === null) {
      reset({
        Name: "",
        SupplierId: null,
        Description: "",
        Price: null,
        ImageFile: null,
        MealType: null,
      });
      setCoverImageUrl(null);
    }

    onCreateOpenChange();
    setIsImageLoading(false);
  };

  return (
    <Modal
      hideCloseButton
      isOpen={isCreateOpen}
      onOpenChange={handleModalChange}
      className="w-[746px] min-w-[746px]"
    >
      <ModalContent>
        <ModalHeader
          className="flex items-center justify-between font-semibold 
        text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]"
        >
          <span className="text-secodary-950">
            {mealId ? "ویرایش آیتم غذایی" : "اضافه کردن آیتم غذایی"}
          </span>
          <span className="cursor-pointer" onClick={() => onCreateOpenChange()}>
            <Icon name="close" className="text-secondary-300" />
          </span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-[706px] mx-auto mb-[15px]" />
        <form
          onSubmit={handleSubmit(onSubmit as any, onError)}
          className="flex flex-col gap-[20px] px-[20px]"
        >
          <ModalBody className="p-0">
            <div className="space-y-4 mb-[32px]">
              <div className="grid md:grid-cols-2 gap-4">
                <RHFInput
                  name="Name"
                  control={control}
                  label="نام غذا"
                  required
                  type="text"
                  register={register("Name")}
                  error={errors.Name?.message}
                  inputDirection="rtl"
                  width={343}
                  height={48}
                  textAlignment="text-right"
                  className="w-[343px]"
                />

                <RHFInput
                  name="Price"
                  control={control}
                  label="قیمت (تومان)"
                  required
                  type="number"
                  register={register("Price")}
                  error={errors.Price?.message}
                  inputDirection="rtl"
                  width={343}
                  height={48}
                  textAlignment="text-right"
                  className="w-[343px]"
                  withCommaSeparator
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormSelect
                  name="SupplierId"
                  control={control}
                  register={register("SupplierId")}
                  error={errors.SupplierId?.message}
                  label="تامین کننده"
                  width={343}
                  height={48}
                  options={transformToOptions(
                    supplierData?.Data?.Items || [],
                    "Name",
                    "SupplierId",
                  )}
                  valueType="number"
                  isRequired={true}
                />
                <FormSelect
                  name="MealType"
                  control={control}
                  register={register("MealType")}
                  error={errors.MealType?.message}
                  label="نوع غذا"
                  width={343}
                  height={48}
                  options={mealTypeOptions.map((option) => ({
                    label: option.name,
                    value: option.id,
                  }))}
                  valueType="number"
                  isRequired={true}
                />
              </div>
              <Controller
                name="ImageFile"
                control={control}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { onChange, ...rest } }) => {
                  return (
                    <FieldInput
                      loading={isImageLoading}
                      isRequired
                      label="بارگذاری تصویر آیتم غذایی"
                      file={watch("ImageFile") || undefined}
                      onChange={async (
                        event: ChangeEvent<HTMLInputElement>,
                      ) => {
                        const file = event.target?.files?.[0];

                        if (file) {
                          try {
                            setIsImageLoading(true);
                            const objectUrl = URL.createObjectURL(file);
                            setCoverImageUrl(objectUrl);
                            setValue("ImageFile", file);
                          } catch (err) {
                            console.error("Upload or preview failed:", err);
                            setCoverImageUrl(null);
                            setValue("ImageFile", null);
                          } finally {
                            setIsImageLoading(false);
                          }
                        }
                        event.target.value = "";
                      }}
                      errors={errors}
                      preview={coverImageUrl || undefined}
                      onRemovePreview={() => {
                        if (
                          coverImageUrl &&
                          coverImageUrl.startsWith("blob:")
                        ) {
                          URL.revokeObjectURL(coverImageUrl);
                        }
                        setCoverImageUrl(null);
                        setValue("ImageFile", null);
                      }}
                      onPress={onPress}
                      hasSubmitted={hasSubmitted}
                      {...rest}
                    />
                  );
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter className="px-0">
            <CustomButton
              type="submit"
              buttonVariant={"primary"}
              buttonSize={"md"}
              isDisabled={isCreating || isEditing}
              isLoading={isCreating || isEditing}
              className="font-semibold text-[14px]/[20px]"
            >
              {mealId ? "ثبت تغییرات" : "اضافه کردن آیتم غذایی"}
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

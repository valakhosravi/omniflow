import {
  useCreateMealSide,
  useEditMealSide,
  useGetMealSideById,
} from "@/hooks/food/useMealSideAction";
import { useGetSupplierList } from "@/hooks/food/useSupplierAction";
import CreateMealSideInput from "@/models/food/sidemeal/CreateSideMealInput";
import FieldInput from "@/components/food/FieldInput";
import useCreateMealSideValidation from "@/validations/CreateMealSideValidation";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { IoIosSave } from "react-icons/io";
import fetchImageFile from "../FetchImageFile";
import SideMealModel from "@/models/food/sidemeal/SideMealModel";

interface MealSideProps {
  isOpen: boolean;
  onOpenChange: () => void;
  mealsideId: number | null;
  onSuccess?: any | null;
}

export default function MealsideForm({
  isOpen,
  onOpenChange,
  mealsideId,
}: MealSideProps) {
  const { mealsideData } = useGetMealSideById(mealsideId);
  const { editData, isEditting } = useEditMealSide();
  const { createData, isCreating } = useCreateMealSide();
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const { supplierData } = useGetSupplierList(1, 6);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useCreateMealSideValidation(
    mealsideData?.Data || {
      Name: "",
      Price: null,
      MealSideType: null,
      SupplierId: null,
      ImageFile: null,
    },
  );

  useEffect(() => {
    async function fetchImageIfNeeded() {
      if (mealsideId && mealsideData?.Data) {
        const data = mealsideData.Data as CreateMealSideInput;
        setValue("Name", data.Name || "");
        setValue("Price", data.Price ?? 0);
        setValue("SupplierId", data.SupplierId);
        setValue("MealSideType", data.MealSideType);

        const imageUrl = (mealsideData.Data as SideMealModel).ImageAddress;
        if (imageUrl) {
          setIsImageLoading(true);
          const file = await fetchImageFile("food", imageUrl);
          if (file) {
            setValue("ImageFile", file);
            const objectUrl = URL.createObjectURL(file);
            setCoverImageUrl(objectUrl);
          } else {
            setCoverImageUrl(null);
          }
          setIsImageLoading(false);
        } else {
          setCoverImageUrl(null);
        }
      } else {
        reset();
        setCoverImageUrl(null);
      }
    }
    fetchImageIfNeeded();
  }, [mealsideId, mealsideData, setValue, reset]);

  const onSubmit = (data: CreateMealSideInput) => {
    if (mealsideId) {
      editData(
        { id: mealsideId, data },
        {
          onSuccess: () => {
            onOpenChange();
          },
          onError: (error) => {
            console.error("Edit mealside failed:", error);
          },
        },
      );
    } else {
      createData(data, {
        onSuccess: () => {
          reset();
          setCoverImageUrl(null);
          onOpenChange();
        },
        onError: (error) => {
          console.error("Create mealside failed:", error);
        },
      });
    }
  };

  const onPress = () => {
    setCoverImageUrl(null);
    setValue("ImageFile", null);
  };

  const mealsideTypeOptions = [
    { name: "نوشیدنی", id: 1 },
    { name: "پیش غذا", id: 2 },
    { name: "دسر", id: 3 },
  ];

  const handleModalChange = (open: boolean) => {
    if (!open && mealsideId === null) {
      reset({
        Name: "",
        Price: null,
        MealSideType: null,
        SupplierId: null,
        ImageFile: null,
      });
      setCoverImageUrl(null);
    }

    onOpenChange();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} size="4xl">
      <ModalContent>
        <ModalHeader className="text-logo-1 text-xl">
          {mealsideId ? "ویرایش کنار غذا" : "ثبت کنار غذا"}
        </ModalHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4"
        >
          <ModalBody>
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="Name"
                control={control}
                render={({ field }) => (
                  <Input
                    label="نام"
                    {...field}
                    isInvalid={!!errors.Name}
                    errorMessage={errors.Name?.message}
                  />
                )}
              />
              <Controller
                name="Price"
                control={control}
                render={({ field }) => (
                  <Input
                    label="قیمت"
                    {...field}
                    value={
                      field.value !== null && field.value !== undefined
                        ? String(field.value)
                        : ""
                    }
                    isInvalid={!!errors.Price}
                    errorMessage={errors.Price?.message}
                    type="number"
                  />
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="SupplierId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    label="تامین کننده"
                    selectedKey={String(field.value ?? "")}
                    onSelectionChange={(val) => field.onChange(Number(val))}
                    defaultItems={
                      supplierData?.Data?.Items?.map((supplier) => ({
                        label: supplier.Name,
                        value: supplier.SupplierId,
                      })) || []
                    }
                    isInvalid={!!errors.SupplierId}
                    errorMessage={errors.SupplierId?.message}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.value}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />

              <Controller
                name="MealSideType"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    label="نوع کنار غذایی"
                    selectedKey={String(field.value ?? "")}
                    onSelectionChange={(val) => field.onChange(Number(val))}
                    defaultItems={mealsideTypeOptions.map((option) => ({
                      label: option.name,
                      value: String(option.id),
                    }))}
                    isInvalid={!!errors.MealSideType}
                    errorMessage={errors.MealSideType?.message}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.value}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
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
                    label="آپلود عکس"
                    onChange={async (event: ChangeEvent<HTMLInputElement>) => {
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
                    onRemovePreview={() => setCoverImageUrl(null)}
                    onPress={onPress}
                    {...rest}
                  />
                );
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => onOpenChange()}
            >
              بستن
            </Button>
            <Button
              type="submit"
              color="primary"
              isDisabled={isCreating || isEditting}
              isLoading={isCreating || isEditting}
              startContent={<IoIosSave className="size-5" />}
            >
              {mealsideId ? "ذخیره تغییرات" : "ثبت"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

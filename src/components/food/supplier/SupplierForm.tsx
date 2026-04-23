import { useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import {
  useGetSupplierById,
  useCreateSupplier,
  useUpdateSupplier,
} from "@/hooks/food/useSupplierAction";
import CreateSupplierInput from "@/models/food/supplier/CreateSupplierInput";
import useCreateSupplierValidation from "@/validations/CreateSupplierValidation";
import { Icon } from "@/ui/Icon";
import RHFInput from "@/ui/RHFInput";
import CustomButton from "@/ui/Button";

interface SupplierFormProps {
  isOpen: boolean;
  onOpenChange: () => void;
  supplierId: number | null;
  onSuccess?: any | null;
}

export default function SupplierForm({
  isOpen,
  onOpenChange,
  supplierId,
}: SupplierFormProps) {
  const { supplierData } = useGetSupplierById(supplierId);
  const { createMutation, createPending } = useCreateSupplier();
  const { updateMutation, updatePending } = useUpdateSupplier();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useCreateSupplierValidation(
    supplierData?.Data || {
      Name: "",
      Phone: "",
      Address: "",
    },
  );

  useEffect(() => {
    if (supplierId && supplierData?.Data) {
      const data = supplierData.Data as CreateSupplierInput;
      setValue("Name", data.Name || "");
      setValue("Phone", data.Phone || "");
      setValue("Address", data.Address || "");
    } else {
      reset();
    }
  }, [supplierId, supplierData, setValue, reset]);

  const onSubmit = (data: CreateSupplierInput) => {
    if (supplierId) {
      updateMutation(
        { id: supplierId, data },
        {
          onSuccess: () => {
            onOpenChange();
          },
        },
      );
    } else {
      createMutation(data, {
        onSuccess: () => {
          reset();
          onOpenChange();
        },
      });
    }
  };

  const handleModalChange = (open: boolean) => {
    if (!open && supplierId === null) {
      reset({
        Name: "",
        Phone: "",
        Address: "",
      });
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
          <span className="text-secodary-950">
            {supplierId ? "ویرایش تامین کننده" : "اضافه کردن تامین کننده"}
          </span>
          <span className="cursor-pointer" onClick={() => onOpenChange()}>
            <Icon name="close" className="text-secondary-300" />
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
                <RHFInput
                  name="Name"
                  control={control}
                  label="نام تامین کننده"
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
                  name="Phone"
                  control={control}
                  label="تلفن"
                  required
                  type="number"
                  register={register("Phone")}
                  error={errors.Phone?.message}
                  inputDirection="rtl"
                  width={343}
                  height={48}
                  textAlignment="text-right"
                  className="w-[343px]"
                />
              </div>
              <RHFInput
                name="Address"
                control={control}
                label="آدرس"
                required
                type="text"
                register={register("Address")}
                error={errors.Address?.message}
                inputDirection="rtl"
                width={700}
                height={48}
                textAlignment="text-right"
                className="w-[700px]"
              />
            </div>
          </ModalBody>
          <ModalFooter className="px-0">
            <CustomButton
              type="submit"
              buttonVariant={"primary"}
              buttonSize={"md"}
              isDisabled={createPending || updatePending}
              isLoading={createPending || updatePending}
              className="font-semibold text-[14px]/[20px]"
            >
              {supplierId
                ? "ویرایش کردن تامین کننده"
                : "اضافه کردن تامین کننده"}
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

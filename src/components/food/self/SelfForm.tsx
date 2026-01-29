import {
  useCreateSelf,
  useEditSelf,
  useGetSelfById,
} from "@/hooks/food/useSelfAction";
import CreateSelfInput from "@/models/food/self/CreateSelfInput";
import useCreateSelfValidation from "@/validations/CreateSelfValidation";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import { useEffect } from "react";
import { Icon } from "@/ui/Icon";
import RHFInput from "@/ui/RHFInput";
import CustomButton from "@/ui/Button";
import RHFSelect from "@/ui/RHFSelect";
import { usegetBuildings } from "@/hooks/food/useGuestReservation";

interface SelfFormProps {
  isOpen: boolean;
  onOpenChange: () => void;
  selfId: number | null;
  onSuccess?: any | null;
}

export default function SelfForm({
  isOpen,
  onOpenChange,
  selfId,
  onSuccess,
}: SelfFormProps) {
  const { selfData, isGetting } = useGetSelfById(selfId);
  const { createData, isCreating } = useCreateSelf();
  const { editData, isEditting } = useEditSelf();
  const { buildings } = usegetBuildings();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useCreateSelfValidation(
    selfData?.Data || {
      Name: "",
      Phone: "",
      Address: "",
      BuildingId: null,
    }
  );

  useEffect(() => {
    if (selfId && selfData?.Data) {
      const data = selfData.Data as CreateSelfInput;
      setValue("Name", data.Name || "");
      setValue("Phone", data.Phone || "");
      setValue("Address", data.Address || "");
      setValue("BuildingId", data.BuildingId || null);
    } else {
      reset();
    }
  }, [selfId, selfData, setValue, reset]);

  const onSubmit = (data: CreateSelfInput) => {
    if (selfId) {
      editData(
        { id: selfId, data },
        {
          onSuccess: () => {
            onOpenChange();
          },
        }
      );
    } else {
      createData(data, {
        onSuccess: () => {
          reset();
          onOpenChange();
        },
      });
    }
  };

  const handleModalChange = (open: boolean) => {
    if (!open && selfId === null) {
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
            {selfId ? "ویرایش سلف" : "اضافه کردن سلف"}
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
                  label="نام سلف"
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
                <RHFSelect
                  label="ساختمان"
                  name="BuildingId"
                  required
                  rules={{
                    required: "ساختمان الزامی است",
                  }}
                  error={errors.BuildingId?.message}
                  control={control}
                  width={334}
                  height={48}
                  options={
                    buildings?.Data?.map((b) => ({
                      label: b.Name,
                      value: b.BuildingId,
                    })) ?? []
                  }
                  className="w-[334px]"
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
                  width={700}
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
              isDisabled={isCreating || isEditting}
              isLoading={isCreating || isEditting}
              className="font-semibold text-[14px]/[20px]"
            >
              {selfId ? "ویرایش کردن سلف" : "اضافه کردن سلف"}
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

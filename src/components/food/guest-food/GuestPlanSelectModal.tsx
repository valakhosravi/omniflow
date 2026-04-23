import { useGetUnreservedPlans } from "@/hooks/food/useGuestReservation";
import { GetUnreservedPlansModel } from "@/models/food/guestReservation/CreateGuestOrderModel";
import { setPlanId } from "@/store/guestReservationStore";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { toLocalDateShortExel } from "@/utils/dateFormatter";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

interface GuestPlanSelectModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

interface FormValues {
  guestFoodPlan: string;
}

export default function GuestPlanSelectModal({
  isOpen,
  onOpenChange,
}: GuestPlanSelectModalProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] =
    useState<GetUnreservedPlansModel | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      guestFoodPlan: "",
    },
  });

  const { unreservedPlans } = useGetUnreservedPlans();
  const onSubmit = () => {
    dispatch(setPlanId(selectedPlan?.PlanId ?? null));
    if (selectedPlan) {
      router.push(`/food/guest-reservation`);
    }
  };

  const handleModalChange = (open: boolean) => {
    if (!open) {
      reset({
        guestFoodPlan: "",
      });
      setSelectedPlan(null);
    }
    onOpenChange();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalChange} hideCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent className="!w-[547px] max-w-[547px]">
          <ModalHeader className="flex justify-between items-center px-[16px] pt-[16px] pb-0">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              انتخاب برنامه غذایی
            </h1>
            <Icon
              name="closeCircle"
              className="text-secondary-300 cursor-pointer"
              onClick={() => onOpenChange()}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[16px] bg-background-devider h-[1px]" />
          <ModalBody className="px-4 py-0 space-y-4">
            <div className="py-4 mb-4">
              <Select
                aria-label="انتخاب برنامه غذایی"
                {...register("guestFoodPlan", {
                  required: " انتخاب برنامه غذایی الزامی است",
                })}
                isInvalid={!!errors.guestFoodPlan}
                selectedKeys={selectedPlan ? [String(selectedPlan.PlanId)] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  const plan = unreservedPlans?.Data?.find(
                    (p) => String(p.PlanId) === String(selectedKey),
                  );
                  setSelectedPlan(plan || null);
                  setValue("guestFoodPlan", String(selectedKey), {
                    shouldValidate: true,
                  });
                  clearErrors("guestFoodPlan");
                }}
                className="w-full"
                classNames={{
                  trigger:
                    "border border-default-300 rounded-[12px] shadow-none bg-white text-right dir-rtl",
                  value: "text-sm text-secondary-950",
                  popoverContent: "border border-default-300",
                }}
              >
                {(unreservedPlans?.Data ?? []).map((plan) => (
                  <SelectItem
                    key={String(plan.PlanId)}
                    textValue={`${plan.FromDate}-${plan.ToDate}`}
                  >
                    {plan.Name} -- {toLocalDateShortExel(plan.FromDate)} -{" "}
                    {toLocalDateShortExel(plan.ToDate)}
                  </SelectItem>
                ))}
              </Select>

              {errors.guestFoodPlan && (
                <span className="text-red-500 text-sm">
                  {errors.guestFoodPlan.message}
                </span>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="px-[16px] flex items-center self-end gap-x-[16px] font-semibold text-[14px]/[23px]">
            <CustomButton buttonVariant="primary" buttonSize="sm" type="submit">
              تایید
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

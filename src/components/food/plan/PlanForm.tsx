import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import { Controller } from "react-hook-form";
import useCreateDatePlanValidation from "@/validations/CreateDatePlanValidation";
import CreateDatePlanInput from "@/models/food/plan/CreateDatePlanInput";
import { useRouter } from "next/navigation";
import { Icon } from "@/ui/Icon";
import RHFInput from "@/ui/RHFInput";
import CustomButton from "@/ui/Button";
import { useEffect, useState } from "react";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { GetActivePlanDatesApi } from "@/services/food/planService";
import { usePlanStore } from "@/store/planStore";
import { useGuardedQuery } from "@/hooks/useGuardedQuery";

interface PlanProps {
  isOpen: boolean;
  onOpenChange: () => void;
  planId: number | null;
  onSuccess?: any | null;
}

export default function PlanForm({ isOpen, onOpenChange, planId }: PlanProps) {
  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    reset,
  } = useCreateDatePlanValidation({
    Name: "",
    Date: [],
  });
  const router = useRouter();
  const { clearStore } = usePlanStore();

  const { data: activePlanDates, isLoading: isGettingActivePlanDates } =
    useGuardedQuery({
      queryKey: ["activePlanDates"],
      queryFn: () => GetActivePlanDatesApi(),
    });

  const onSubmit = async (data: CreateDatePlanInput) => {
    // Convert Persian dates to Gregorian format
    const fromDate = data.Date[0]
      ? data.Date[0].toDate().toISOString().split("T")[0]
      : "";
    const toDate = data.Date[1]
      ? data.Date[1].toDate().toISOString().split("T")[0]
      : "";

    const query = new URLSearchParams({
      name: data.Name,
      from: fromDate,
      to: toDate,
    }).toString();

    clearStore();
    router.push(`/food/plan/create?${query}`);
  };

  const handleModalChange = (open: boolean) => {
    if (!open && planId === null) {
      reset({
        Name: "",
        Date: [],
      });
    }
    onOpenChange();
  };

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [portalContainer, setPortalContainer] = useState<
    HTMLElement | undefined
  >(undefined);

  useEffect(() => {
    const modalRoot = document.getElementById("modal-root");
    if (modalRoot) {
      setPortalContainer(modalRoot);
    }
  }, []);

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={handleModalChange}
      className={`transition-all duration-200`}
      portalContainer={portalContainer}
    >
      <ModalContent>
        <ModalHeader
          className="flex items-center justify-between font-semibold 
        text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]"
        >
          <span className="text-secodary-950">
            {planId ? "ویرایش برنامه غذایی" : "تعریف برنامه غذایی"}
          </span>
          <span className="cursor-pointer" onClick={() => onOpenChange()}>
            <Icon name="close" className="text-secondary-300" />
          </span>
        </ModalHeader>
        {/* <div className="relative h-[1px] bg-secondary-100 w-[312px] mx-auto mb-[15px]" /> */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 px-[20px]"
        >
          <ModalBody
            className={`p-0 ${
              isOpenDatePicker ? "min-h-[450px]" : "min-h-[192px]"
            }`}
          >
            <div className="space-y-4">
              <RHFInput
                name="Name"
                control={control}
                label="نام برنامه غذایی"
                required
                type="text"
                register={register("Name")}
                error={errors.Name?.message}
                inputDirection="rtl"
                width={312}
                height={48}
                textAlignment="text-right"
                className="w-full"
                fullWidth
              />
              <Controller
                name="Date"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="font-bold text-[14px]/[20px] text-foreground mb-[10px]">
                      تاریخ
                      <span className="text-danger"> *</span>
                    </div>
                    <div className="w-full flex justify-center">
                      <Calendar
                        calendar={persian}
                        locale={persian_fa}
                        weekPicker
                        multiple
                        showOtherDays
                        value={field.value ? [...field.value] : []}
                        onChange={(dates) => field.onChange(dates)}
                        plugins={[<DatePanel />]}
                        mapDays={({ date }) => {
                          const today = new Date();
                          const startOfNextWeek = new Date(today);

                          // Calculate days until next Saturday (start of next week in Persian calendar)
                          const daysUntilSaturday = (6 - today.getDay()) % 7; // 0 = Sunday, 6 = Saturday
                          const daysToAdd =
                            daysUntilSaturday === 0 ? 7 : daysUntilSaturday; // If today is Saturday, add 7 days

                          startOfNextWeek.setDate(today.getDate() + daysToAdd);
                          startOfNextWeek.setHours(0, 0, 0, 0); // Reset time to start of day

                          // Disable dates before start of next week
                          if (date.toDate() < startOfNextWeek) {
                            return { disabled: true };
                          }

                          // Disable dates that are within active plan date ranges
                          if (activePlanDates?.Data) {
                            const currentDate = date.toDate();
                            const isInActivePlanRange =
                              activePlanDates.Data.some((activePlan) => {
                                const fromDate = new Date(activePlan.FromDate);
                                const toDate = new Date(activePlan.ToDate);

                                // Set time to start of day for accurate comparison
                                fromDate.setHours(0, 0, 0, 0);
                                toDate.setHours(23, 59, 59, 999);

                                return (
                                  currentDate >= fromDate &&
                                  currentDate <= toDate
                                );
                              });

                            if (isInActivePlanRange) {
                              return { disabled: true };
                            }
                          }

                          return {};
                        }}
                      />
                    </div>
                    {errors.Date?.message && (
                      <div className="text-danger text-[12px]/[18px]">
                        {errors.Date?.message}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </ModalBody>
          <ModalFooter className="px-0">
            <CustomButton
              type="submit"
              buttonVariant={"primary"}
              buttonSize={"md"}
              className="font-semibold text-[14px]/[20px] w-full"
            >
              {planId ? "تایید" : "تایید"}
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

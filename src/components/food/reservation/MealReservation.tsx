import { Icon } from "@/ui/Icon";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@/ui/NextUi";
import { formatPersianDate2 } from "@/utils/formatPersianDate";
import MealFilters from "./MealFilters";
import { useMemo, useState } from "react";
import { useGetPlanById } from "@/hooks/food/usePlanAction";
import { Meal } from "@/models/food/plan/PlanEdit";
import MealList from "./MealList";
import CartSection from "./CartSection";
import Loading from "@/ui/Loading";
import { normalizeDate } from "@/utils/normalizeDate";
import { useBasketStore } from "@/store/basketStore";
import { useReservationStore } from "@/store/reservationStore";

interface MealReservationProps {
  day: Date | null;
  planId: number;
  lastDayNotHoliday?: Date | null;
  holidays: string[];
  toDatePlan: Date | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  OrderId: number;
  hasValidReservation: boolean;
  planDays?: any[];
}

export default function MealReservation({
  day,
  planId,
  lastDayNotHoliday,
  holidays,
  toDatePlan,
  isOpen,
  onOpenChange,
  OrderId,
  hasValidReservation,
  planDays,
}: MealReservationProps) {
  const [selectedMealType, setSelectedMealType] = useState<number>(0);
  const { planData, isGetting } = useGetPlanById(planId);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const selectedDay = useBasketStore((state) => state.selectedDay);
  const setSelectedDay = useBasketStore((state) => state.setSelectedDay);
  const disableEdit = useReservationStore((state) => state.disableEdit);
  const setHasClickedNextDay = useReservationStore(
    (state) => state.setHasClickedNextDay
  );

  const currentDay = useMemo(() => {
    if (selectedDay) {
      const [year, month, dayNum] = selectedDay.split("-").map(Number);
      return new Date(year, month - 1, dayNum);
    }
    return day;
  }, [selectedDay, day]);

  const mealsForDate: Meal[] =
    planData?.Data?.DailyMeals?.filter(
      (meal) =>
        normalizeDate(meal.MealDate) === currentDay?.toLocaleDateString("en-CA")
    ) ?? [];

  const filteredMeals = mealsForDate.filter((meal) => {
    const matchesType =
      selectedMealType === 0 || meal.MealType === selectedMealType;

    const matchesSupplier =
      selectedSupplier === null || meal.SupplierName === selectedSupplier;

    return matchesType && matchesSupplier;
  });

  function handleClose() {
    onOpenChange(false);
    setSelectedDay(null);
    setHasClickedNextDay(false);
    setSelectedSupplier(null);
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
        hideCloseButton
      >
        <ModalContent className="!w-[1176px] max-w-[1176px] max-h-[933px] h-[780px]">
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-between items-center pt-[20px] px-[20px]">
                <h1 className="font-semibold text-[20px]/[28px] text-secondary-950">
                  {hasValidReservation && disableEdit
                    ? "ویرایش غذا"
                    : "رزرو غذا"}
                </h1>
                <Icon
                  name="close"
                  className="text-secondary-300 cursor-pointer size-6"
                  onClick={onClose}
                />
              </ModalHeader>
              <div className="mt-[8px] mb-[16px] mx-[20px] bg-background-devider h-[1px]" />
              <ModalBody className="flex flex-row items-start justify-between mb-[20px]">
                <div className="w-[870px] flex flex-col justify-start h-full">
                  <h2
                    className="font-semibold text-[14px]/[20px] text-primary-950 bg-day-title
                flex items-center justify-center py-3 border border-secondary-200 rounded-[8px]"
                  >
                    {currentDay
                      ? formatPersianDate2(currentDay.toISOString())
                      : "-"}
                  </h2>
                  <MealFilters
                    selected={selectedMealType}
                    onSelect={(id) => setSelectedMealType(id)}
                    selectedSupplier={selectedSupplier}
                    onSelectSupplier={setSelectedSupplier}
                  />
                  {isGetting ? <Loading /> : <MealList meals={filteredMeals} />}
                </div>
                <CartSection
                  currentDay={currentDay}
                  day={day}
                  lastDayNotHoliday={lastDayNotHoliday}
                  holidays={holidays}
                  toDatePlan={toDatePlan}
                  onOpenChange={onOpenChange}
                  OrderId={OrderId}
                  hasValidReservation={hasValidReservation}
                  planDays={planDays}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

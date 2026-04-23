import { reservationModel } from "@/models/food/order/OrderReservation";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/NextUi";
import { formatDate, formatPersianDate } from "@/utils/formatPersianDate";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { useDeleteOrder } from "@/hooks/food/useOrderAction";
import CustomButton from "@/ui/Button";
import MealDetailItems from "./MealDetailItems";
import { addToaster } from "@/ui/Toaster";
import { useBasketStore } from "@/store/basketStore";
import { useReservationStore } from "@/store/reservationStore";

interface MealDetailProps {
  matchedDate: Date | null;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  meals: reservationModel[];
  selfName?: string;
  isHoliday?: boolean;
  OrderId: number;
  onOpenReservationModal: () => void;
  isLastRow: boolean;
  isTodayInPlanRange: boolean;
  isPlanOpen: boolean;
}

export default function MealDetail({
  matchedDate,
  setIsOpen,
  meals,
  selfName,
  isHoliday,
  OrderId,
  onOpenReservationModal,
  isOpen,
  isLastRow,
  isTodayInPlanRange,
  isPlanOpen,
}: MealDetailProps) {
  const totalPrice = meals.reduce(
    (acc, meal) => acc + (meal.Price || 0) * (meal.OrderCount || 1),
    0
  );
  const { deleteOrder, isDeleting } = useDeleteOrder();
  const setSelectedDay = useBasketStore((state) => state.setSelectedDay);
  const setDisableEdit = useReservationStore((state) => state.setDisableEdit);
  const selectedDay = useBasketStore((store) => store.selectedDay);

  const handleDeleteOrder = () => {
    const dailyMealItems = meals.map((meal) => ({
      DailyMealId: meal.DailyMealId,
    }));
    deleteOrder(
      {
        OrderId: OrderId,
        DailyMealIds: dailyMealItems,
      },
      {
        onSuccess: (data) => {
          setIsOpen(false);
          setIsOpen(false);
          addToaster({
            title: data.ResponseMessage,
            color: "success",
          });
        },
      }
    );
  };

  const handleEditOrder = () => {
    if (!matchedDate) return;
    setIsOpen(false);
    setDisableEdit(true);
    onOpenReservationModal();
  };

  const isAfterToday = (matchedDate ?? "") >= new Date();
  const isToday = selectedDay === formatDate(new Date());

  return (
    <Popover
      placement="left-start"
      className={`absolute ${
        isLastRow ? "right-12 -top-[205px]" : "right-12 -top-[60px]"
      } w-[299px] min-w-[299px] 
      max-h-[360px] overflow-y-auto overflow-x-hidden
      rounded-[12px] shadow-[0_10px_36px_0_rgba(0,0,0,0.16),0_0_0_1px_rgba(0,0,0,0.06)]`}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (matchedDate) {
          const dayString = formatDate(matchedDate);
          setSelectedDay(dayString);
        }
      }}
      isOpen={isOpen}
    >
      {isHoliday ? (
        ""
      ) : (
        <PopoverTrigger>
          <button
            className="cursor-pointer bg-secondary-0 border border-primary-950/[25%] text-primary-950
                    w-[137px] h-[32px] rounded-[8px] font-semibold text-[12px]/[18px]"
          >
            جزئیات
          </button>
        </PopoverTrigger>
      )}
      <PopoverContent className="flex flex-col justify-center items-start p-4">
        <div className="font-medium text-[16px]/[24px] text-primary-950 mb-1">
          {matchedDate ? formatPersianDate(matchedDate.toISOString()) : "-"}
        </div>

        {meals.length > 0 && selfName !== null && (
          <span className="font-medium text-[12px]/[18px] text-secondary-400 mb-4">
            سلف: {selfName}
          </span>
        )}

        <div className="space-y-[12px] w-full">
          {isTodayInPlanRange && (isAfterToday || isToday) ? (
            <div className="font-medium text-[12px]/[18px] text-secondary-500">
              زمان رزرو غذا به پایان رسیده است.
            </div>
          ) : meals.length === 0 || selfName === null ? (
            <div className="font-medium text-[12px]/[18px] text-secondary-500">
              هیچ غذایی در این روز رزرو نشده است.
            </div>
          ) : (
            meals
              .slice()
              .sort((a, b) => Number(a.MealType) - Number(b.MealType))
              .map(
                (meal) =>
                  meal.MealId !== 0 && (
                    <MealDetailItems
                      meal={meal}
                      key={meal.DailyMealId}
                      matchedDate={matchedDate}
                    />
                  )
              )
          )}
        </div>

        <div className="w-[299px] h-[1px] bg-secondary-100 !self-center mt-4 mb-3"></div>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[12px]/[18px] text-secondary-400">
              مجموع
            </span>
            <span className="font-semibold text-[12px]/[18px] text-primary-950">
              {formatNumberWithCommas(totalPrice)} تومان
            </span>
          </div>
          <div className="flex items-center justify-center">
            {matchedDate &&
            !isTodayInPlanRange &&
            isPlanOpen &&
            new Date(matchedDate) >
              new Date(new Date().setHours(0, 0, 0, 0)) ? (
              <div className="flex justify-between w-full gap-2 mt-2 font-semibold text-[12px]/[18px]">
                <CustomButton
                  buttonSize="xs"
                  buttonVariant="primary"
                  className="w-[148px]"
                  onPress={handleEditOrder}
                  // isLoading={isCreating}
                >
                  ویرایش
                </CustomButton>
                <CustomButton
                  buttonSize="xs"
                  buttonVariant="outline"
                  className="!text-error-button w-[107px]"
                  onPress={handleDeleteOrder}
                  isLoading={isDeleting}
                >
                  حذف رزرو
                </CustomButton>
              </div>
            ) : (
              <span className="font-medium text-[12px]/[18px] text-secondary-500 pt-4">
                زمان ویرایش یا حذف به پایان رسیده است.
              </span>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

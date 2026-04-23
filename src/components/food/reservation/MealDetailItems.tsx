import { Chip } from "@/ui/NextUi";
import FoodBadge from "./FoodBadge";
import Rate from "./Rate";
import { useGetRateByDailyMealId } from "@/hooks/food/useFeedbackAction";
import { reservationModel } from "@/models/food/order/OrderReservation";

const variants: Record<number, "Green" | "Orange" | "Purple"> = {
  1: "Green",
  3: "Orange",
  4: "Purple",
};

export default function MealDetailItems({
  meal,
  matchedDate,
}: {
  meal: reservationModel;
  matchedDate: Date | null;
}) {
  const { rate } = useGetRateByDailyMealId(meal.DailyMealId);

  return (
    <div key={meal.MealId} className="flex flex-col">
      <div className="flex items-center justify-between pb-2">
        <div
          key={meal.MealDate + "-" + meal.MealType}
          className="flex items-center gap-x-1"
        >
          <FoodBadge
            MealName={meal.MealName}
            varient={variants[Number(meal.MealType)]}
          />
          {meal.OrderCount > 1 && (
            <span className="text-secondary-400 font-normal text-[12px]/[18px]">
              {meal.OrderCount} عدد
            </span>
          )}
        </div>
        {meal.MealType === "1" && (
          <Chip
            className="!font-medium text-[10px]/[16px] !text-primary-950
          bg-chip-purple !py-[0.5px] !px-[7.5px] h-[21px]"
            classNames={{
              content: `px-0`,
            }}
          >
            {meal.SupplierName}
          </Chip>
        )}
      </div>

      {meal.MealType === "1" &&
        matchedDate &&
        new Date(matchedDate) <= new Date() && (
          <Rate
            mealType={meal.MealType}
            mealId={meal.MealId}
            dailyMealId={meal.DailyMealId}
            rate={rate?.Data ?? 0}
          />
        )}
    </div>
  );
}

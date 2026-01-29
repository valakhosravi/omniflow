import { useGetTotalRate } from "@/hooks/food/useFeedbackAction";
import { Meal } from "@/models/food/plan/PlanEdit";
import { Button, Chip, Image, Spinner } from "@/ui/NextUi";
import { Icon } from "@/ui/Icon";
import {
  formatNumberShort,
  formatNumberWithCommas,
} from "@/utils/formatNumber";
import { useFetchImageFile } from "@/hooks/food/useMealImages";
import { useState } from "react";
import useTransactionStore from "@/store/Transaction";
import CustomButton from "@/ui/Button";
import { OrderItem, useBasketStore } from "@/store/basketStore";

export default function MealCard({
  meal,
  setLoadingStates,
}: {
  meal: Meal;
  setLoadingStates: React.Dispatch<
    React.SetStateAction<{ [id: number]: boolean }>
  >;
}) {
  const { totalRate, isTotalRateLoading } = useGetTotalRate(meal.MealId);
  const { downloadImage, isDownloading } = useFetchImageFile(
    "food",
    meal.ImageAddress
  );
  const [hasImageError, setHasImageError] = useState(false);
  const decreaseBalance = useTransactionStore((state) => state.decreaseBalance);
  const handleLoad = (id: number) => {
    setLoadingStates((prev) => ({ ...prev, [id]: false }));
    setHasImageError(false);
  };
  const handleError = (id: number) => {
    setLoadingStates((prev) => ({ ...prev, [id]: false }));
    setHasImageError(true);
  };
  const shouldShowFallback = !downloadImage || hasImageError;
  const addItem = useBasketStore((state) => state.addItem);
  const items = useBasketStore((state) => state.items);
  const increaseQty = useBasketStore((state) => state.increaseQty);
  const decreaseQty = useBasketStore((state) => state.decreaseQty);
  const incrementBalance = useTransactionStore(
    (state) => state.incrementBalance
  );

  const handleAddToCart = () => {
    if (meal.DailyMealId) {
      const mapper: OrderItem = {
        DailyMealId: meal.DailyMealId,
        MealDate: meal.MealDate,
        Count: 1,
        MealId: meal.MealId,
        MealName: meal.MealName,
        MealType: meal.MealType,
        Price: meal.Price,
        SupplierName: meal.SupplierName,
        IsDeleted: false,
        SelfId: null,
      };
      addItem(mapper);
      decreaseBalance(meal.Price);
    }
  };

  const findMealInItems = (dailyMealId: number) => {
    return items.find((item) => item.DailyMealId === dailyMealId);
  };

  const findedMeal = findMealInItems(meal.DailyMealId);

  return (
    <div
      key={meal.MealId}
      className="border border-secondary-200 rounded-[16px] w-[280px] h-[141px]"
    >
      <div className="h-[92px] flex items-center p-3 gap-x-2 w-full">
        {shouldShowFallback ? (
          <div className="rounded-[8px] size-[68px] bg-secondary-200"></div>
        ) : (
          <Image
            alt={meal.MealName}
            width={68}
            height={68}
            className="w-full object-cover rounded-[8px] min-w-[68px]"
            src={downloadImage}
            onLoad={() => handleLoad(meal.MealId)}
            onError={() => handleError(meal.MealId)}
          />
        )}

        <div className="flex flex-col justify-start gap-y-2">
          <div className="font-medium text-[14px]/[20px] text-primary-950">
            {meal.MealName}
          </div>
          <div className="flex items-center gap-x-2">
            <Chip
              className="!font-medium text-[12px]/[18px] !text-primary-950
              bg-chip-purple !py-[1px] !px-[5.5px] h-[20px]"
              classNames={{ content: `px-0` }}
            >
              <span>{meal.SupplierName}</span>
            </Chip>
            {isTotalRateLoading ? (
              <Spinner
                classNames={{
                  wrapper: "w-4 h-4",
                  circle1: "border-2 border-t-primary-950 border-b-primary-950",
                  circle2: "border-2 border-primary-950",
                }}
              />
            ) : (
              <div className="flex items-center gap-x-0.5 font-semibold text-[10px]/[16px]">
                <span className="text-rate-count">
                  ({formatNumberShort(totalRate?.Data?.TotalCount)})
                </span>
                <span className="text-secondary-900">
                  {formatNumberWithCommas(String(totalRate?.Data?.Rate))}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-secondary-200 w-full" />
      <div className="h-[48px] flex items-center justify-between px-3 pb-2 pt-1.5">
        <div className="flex items-center gap-x-1">
          <span className="text-primary-950 font-semibold text-[14px]/[20px]">
            {formatNumberWithCommas(meal.Price)}
          </span>
          <span className="font-medium text-[10px]/[16px] text-secondary-400">
            تومان
          </span>
        </div>
        {findedMeal && findedMeal?.Count > 0 ? (
          <div className="flex items-center">
            <Button
              aria-label="Increase"
              className="p-[4.5px] border-[0.75px] border-primary-950/[.25] !max-w-[24px] !w-[24px] !h-[24px]
           min-w-[20px] rounded-[6.26px] bg-transparent"
              onPress={() => {
                increaseQty(meal.DailyMealId);
                decreaseBalance(meal.Price);
              }}
            >
              <Icon name="add" className="size-[15px] text-primary-950" />
            </Button>

            <span className="w-6 text-center font-semibold text-[12px]/[18px] text-primary-950">
              {findedMeal?.Count}
            </span>
            <Button
              aria-label="Decrease"
              className="p-[4.5px] border-[0.75px] border-primary-950/[.25] !max-w-[24px] !w-[24px] !h-[24px]
           min-w-[20px] rounded-[6.26px] bg-transparent"
              onPress={() => {
                decreaseQty(meal.DailyMealId);
                incrementBalance(meal.Price);
              }}
            >
              <Icon name="remove" className="size-[15px] text-secondary-400" />
            </Button>
          </div>
        ) : (
          <CustomButton
            className="flex items-center gap-x-0.5 !py-[6px] !px-[9px] !rounded-[8px]"
            buttonVariant="primary"
            buttonSize="xs"
            onPress={handleAddToCart}
          >
            <span className="font-semibold text-[12px]/[18px]">افزودن</span>
            <Icon name="add" />
          </CustomButton>
        )}
      </div>
    </div>
  );
}

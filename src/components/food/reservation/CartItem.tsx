import { mealTypeMap } from "@/models/food/meal/MealTypes";
import { OrderItem, useBasketStore } from "@/store/basketStore";
import useTransactionStore from "@/store/Transaction";
import { Icon } from "@/ui/Icon";
import { Button } from "@/ui/NextUi";
import { formatNumberWithCommas } from "@/utils/formatNumber";

export default function CartItem({ item }: { item: OrderItem }) {
  const increaseQty = useBasketStore((state) => state.increaseQty);
  const decreaseQty = useBasketStore((state) => state.decreaseQty);
  const decreaseBalance = useTransactionStore((state) => state.decreaseBalance);
  const incrementBalance = useTransactionStore(
    (state) => state.incrementBalance
  );

  return (
    <div
      key={`${item.MealId}-${item.MealDate}`}
      className="flex flex-col items-center justify-center space-y-1"
    >
      <div className="flex items-center self-start gap-x-2">
        <span className="font-medium text-[12px]/[18px] text-secondary-950">
          {item.MealName}
        </span>
        <span className="font-medium text-[10px]/[16px] text-secondary-400">
          ({mealTypeMap[item.MealType]})
        </span>
      </div>
      <div className="flex items-center justify-between w-full gap-1">
        <div className="flex items-center gap-x-0.5 font-normal text-[12px]/[18px]">
          <span>{formatNumberWithCommas(item.Price)}</span>
          <span>تومان</span>
        </div>
        <div className="flex items-center">
          <Button
            aria-label="Increase"
            className="p-[4.5px] border-[0.75px] border-primary-950/[.25] !max-w-[24px] !w-[24px] !h-[24px]
            min-w-[20px] rounded-[6.26px] bg-transparent"
            onPress={() => {
              increaseQty(item.DailyMealId);
              decreaseBalance(item.Price);
            }}
          >
            <Icon name="add" className="size-[15px] text-primary-950" />
          </Button>
          <span className="w-6 text-center font-semibold text-[12px]/[18px] text-primary-950">
            {item.Count}
          </span>

          <Button
            aria-label="Decrease"
            className="p-[4.5px] border-[0.75px] border-primary-950/[.25] !max-w-[24px] !w-[24px] !h-[24px]
            min-w-[20px] rounded-[6.26px] bg-transparent"
            onPress={() => {
              decreaseQty(item.DailyMealId);
              incrementBalance(item.Price);
            }}
          >
            <Icon name="remove" className="size-[15px] text-secondary-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}

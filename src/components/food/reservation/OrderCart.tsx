import {
  useGetBalanceAndChargeApi,
  useGetBalanceAndChargeForOthersApi,
} from "@/hooks/food/useTransactionAction";
import { Icon } from "@/ui/Icon";
import { formatPersianDate2 } from "@/utils/formatPersianDate";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import CartItem from "./CartItem";
import useTransactionStore from "@/store/Transaction";
import { useEffect, useMemo } from "react";
import { normalizeDate } from "@/utils/normalizeDate";
import { useBasketStore } from "@/store/basketStore";
import { useGetOrder } from "@/hooks/customHook/useGetOrder";

interface OrderCartProps {
  currentDay: Date | null;
}

export default function OrderCart({ currentDay }: OrderCartProps) {
  const { lastTransactionData, isLoading } = useGetBalanceAndChargeApi();
  const selectedUser = useBasketStore((state) => state.selectedUser);
  const { lastTransactionForOtherData } = useGetBalanceAndChargeForOthersApi(
    selectedUser?.UserId ?? 0,
  );
  const clearItems = useBasketStore((state) => state.clearItems);
  const formattedDay = currentDay && currentDay.toLocaleDateString("sv-SE");
  const setBalance = useTransactionStore((state) => state.setBalance);
  const incrementBalance = useTransactionStore(
    (state) => state.incrementBalance,
  );
  // const editMeals = useCartStore((state) => state.editMeals);

  // const mergeCartItems = useCartStore((state) => state.mergeCartItems);
  const planId = useBasketStore((state) => state.planId);
  const items = useBasketStore((state) => state.items);
  useGetOrder(planId, String(formattedDay));

  const totalPrice = useMemo(() => {
    if (!formattedDay) return 0;

    const filtered = items.filter((item) => {
      const itemDay = normalizeDate(item.MealDate);
      return itemDay === formattedDay && item.IsDeleted == false;
    });

    return filtered.reduce((sum, item) => {
      const price = item.Price || 0;
      const count = item.Count || 0;
      return sum + price * count;
    }, 0);
  }, [items, formattedDay]);

  const handleClearCart = () => {
    incrementBalance(totalPrice);
    clearItems();
  };

  useEffect(() => {
    if (selectedUser) {
      if (
        lastTransactionForOtherData?.ResponseCode == 100 &&
        typeof lastTransactionForOtherData?.Data?.Balance === "number"
      ) {
        setBalance(lastTransactionForOtherData?.Data?.Balance);
      }
    } else {
      if (
        lastTransactionData?.ResponseCode == 100 &&
        typeof lastTransactionData?.Data?.Balance === "number"
      ) {
        setBalance(lastTransactionData?.Data?.Balance);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, lastTransactionData, lastTransactionForOtherData]);

  return (
    <div className="w-full space-y-3">
      <h2
        className="font-semibold text-[14px]/[20px] text-primary-950 w-full
        flex items-center justify-center py-3 border border-secondary-200 rounded-[8px]"
      >
        سبد سفارش
      </h2>
      <div className="border border-secondary-200 bg-day-title rounded-[8px] relative w-full text-xs text-primary-950 p-3 text-justify">
        روزانه تا <b>سقف 150 هزار تومان </b> از سفارش شما به عنوان سهم شرکت کسر
        می‌شود.
      </div>
      <div
        className="border border-secondary-200 rounded-[8px] relative w-full
        max-h-[380px] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-3 py-[11.5px]">
          <span className="font-semibold text-[12px]/[18px] text-secondary-400">
            {currentDay && formatPersianDate2(currentDay.toISOString())}
          </span>
          <span className="border border-primary-950/[.25] rounded-[6.19px] p-[4.5px]">
            <Icon
              name="trash"
              className="text-trash size-[15px] cursor-pointer"
              onClick={handleClearCart}
            />
          </span>
        </div>
        <div className="bg-secondary-200 h-[1px]" />
        <div className="p-3 space-y-5">
          {items &&
            items.length > 0 &&
            items
              .filter((p) => p.IsDeleted == false)
              .map((item) => {
                if (normalizeDate(item.MealDate) !== formattedDay) return null;
                return <CartItem item={item} key={item.DailyMealId} />;
              })}
        </div>
        <div className="px-3 py-[15px] w-full flex items-center justify-between">
          <span className="font-semibold text-[12px]/[18px] text-secondary-400">
            مجموع
          </span>
          <div className="flex items-center gap-x-0.5 font-medium text-[10px]/[16px] text-secondary-950">
            <span>{formatNumberWithCommas(totalPrice)}</span>
            <span>تومان</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  getOrderByPlanIdAndDate,
  getOrderByPlanIdAndDateForUser,
} from "@/services/food/orderService";
import { useBasketStore } from "@/store/basketStore";
import { useEffect, useRef } from "react";

export const fetchOrder = async ({
  PlanId,
  OrderDate,
}: {
  PlanId: number;
  OrderDate: string;
}) => {
  const addItem = useBasketStore.getState().addItem;
  const setOriginalData = useBasketStore.getState().setOriginalData;

  console.log("fetchOrder called");

  try {
    const p = await getOrderByPlanIdAndDate(PlanId, OrderDate);
    if (p.ResponseCode === 100 && p.Data) {
      setOriginalData(p.Data);
      p.Data?.forEach((item) => {
        addItem({
          DailyMealId: item.DailyMealId,
          MealDate: item.MealDate,
          Count: item.Count,
          MealId: item.MealId,
          MealName: item.MealName,
          Price: item.Price,
          SupplierName: item.SupplierName,
          MealType: item.MealType,
          IsDeleted: false,
          SelfId: item.SelfId,
        });
      });
    }
  } catch (error) {
    console.error("Failed to fetch order:", error);
  }
};

export const fetchUserOrder = async ({
  PlanId,
  OrderDate,
  userId,
}: {
  PlanId: number;
  OrderDate: string;
  userId: number;
}) => {
  const addItem = useBasketStore.getState().addItem;
  const setOriginalData = useBasketStore.getState().setOriginalData;

  try {
    const p = await getOrderByPlanIdAndDateForUser(PlanId, OrderDate, userId);
    if (p.ResponseCode === 100 && p.Data) {
      setOriginalData(p.Data);
      p.Data?.forEach((item) => {
        addItem({
          DailyMealId: item.DailyMealId,
          MealDate: item.MealDate,
          Count: item.Count,
          MealId: item.MealId,
          MealName: item.MealName,
          Price: item.Price,
          SupplierName: item.SupplierName,
          MealType: item.MealType,
          IsDeleted: false,
          SelfId: item.SelfId,
        });
      });
    }
  } catch (error) {
    console.error("Failed to fetch order:", error);
  }
};

export function useGetOrder(PlanId: number, OrderDate: string) {
  const clearItems = useBasketStore((state) => state.clearItems);
  const didFetch = useRef(false);
  const selectedUser = useBasketStore((state) => state.selectedUser);

  useEffect(() => {
    if (!PlanId || !OrderDate) return;
    if (didFetch.current) return;

    clearItems();

    if (selectedUser) {
      const userId = selectedUser.UserId;
      fetchUserOrder({ OrderDate, PlanId, userId });
    } else {
      fetchOrder({ PlanId, OrderDate });
    }
    didFetch.current = true;
  }, [PlanId, OrderDate, clearItems]);
}

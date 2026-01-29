import { SearchByFullNameModel } from "@/models/food/guestReservation/CreateGuestOrderModel";
import { MealOrder } from "@/models/food/order/MealOrder";
import { create } from "zustand";

export interface OrderItem {
  DailyMealId: number;
  MealDate: string;
  MealId: number;
  MealName: string;
  SupplierName: string;
  Count: number;
  Price: number;
  MealType: number;
  IsDeleted: boolean;
  SelfId: number | null;
}

type BasketModel = {
  planId: number;
  items: OrderItem[];
  originalData: MealOrder[];
  selfId: number;
  selectedDay: string | null;
  selectedUser: SearchByFullNameModel | null;
  setSelectedDay: (day: string | null) => void;
  setSelfId: (id: number | null) => void;
  addItem: (item: OrderItem) => void;
  setPlanId: (id: number) => void;
  clearItems: () => void;
  increaseQty: (DailyMealId: number) => void;
  decreaseQty: (DailyMealId: number) => void;
  setOriginalData: (originalData: MealOrder[]) => void;
  setSelectedUser: (user: SearchByFullNameModel | null) => void;
};

export const useBasketStore = create<BasketModel>()((set, get) => ({
  planId: 0,
  selfId: 0,
  items: [],
  selectedDay: null,
  originalData: [],
  selectedUser: null,
  setOriginalData: (originalData: MealOrder[]) =>
    set({ originalData: originalData ?? [] }),
  addItem: (item: OrderItem) =>
    set((state) => {
      if (state.items.length > 0) {
        const existingItem = state.items.find(
          (i) => i.DailyMealId === item.DailyMealId
        );

        if (existingItem) {
          return {
            ...state,
            items: state.items.map((i) =>
              i.DailyMealId === item.DailyMealId
                ? { ...i, Count: i.Count + 1, IsDeleted: false }
                : i
            ),
          };
        }
      }

      return {
        ...state,
        items: [...state.items, item],
      };
    }),
  clearItems: () => set({ items: [] }),
  setPlanId: (id: number) => set({ planId: id }),
  increaseQty: (DailyMealId: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.DailyMealId === DailyMealId
          ? { ...item, Count: item.Count + 1 }
          : item
      ),
    })),
  decreaseQty: (DailyMealId: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.DailyMealId === DailyMealId
          ? {
              ...item,
              Count: item.Count - 1,
              IsDeleted: item.Count - 1 === 0 ? true : false,
            }
          : item
      ),
    }));
  },
  setSelfId: (id: number | null) => set({ selfId: id ?? 0 }),
  setSelectedDay: (day: string | null) => set({ selectedDay: day }),
  setSelectedUser: (user: SearchByFullNameModel | null) =>
    set({ selectedUser: user }),
}));

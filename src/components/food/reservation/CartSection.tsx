import { Button } from "@/ui/NextUi";
import OrderCart from "./OrderCart";
import { useEffect, useState } from "react";
import {
  useCreateOrder,
  useCreateOrderForOther,
  useDeleteOrder,
} from "@/hooks/food/useOrderAction";
import { useBasketStore } from "@/store/basketStore";
import CreateOrder from "@/models/food/order/CreateOrder";
import { useReservationStore } from "@/store/reservationStore";
import { formatDate } from "@/utils/formatPersianDate";
import { fetchOrder, fetchUserOrder } from "@/hooks/customHook/useGetOrder";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { planModel } from "@/models/food/order/OrderReservation";

interface CartSectionProps {
  day: Date | null;
  lastDayNotHoliday?: Date | null;
  holidays: string[];
  toDatePlan: Date | null;
  currentDay: Date | null;
  onOpenChange: (open: boolean) => void;
  OrderId: number;
  hasValidReservation: boolean;
  planDays?: planModel[];
}

export default function CartSection({
  day,
  lastDayNotHoliday,
  holidays,
  toDatePlan,
  currentDay,
  onOpenChange,
  OrderId,
  hasValidReservation,
  planDays,
}: CartSectionProps) {
  const { createOrder, isCreating } = useCreateOrder();
  const { deleteOrder, isDeleting } = useDeleteOrder();
  const [loadingButton, setLoadingButton] = useState<
    "nextDay" | "saveExit" | null
  >(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const disableEdit = useReservationStore((state) => state.disableEdit);
  const setDisableEdit = useReservationStore((state) => state.setDisableEdit);
  const items = useBasketStore((state) => state.items);
  const planId = useBasketStore((state) => state.planId);
  const selfId = useBasketStore((state) => state.selfId);
  const clearItems = useBasketStore((state) => state.clearItems);
  const setHasAttemptedNext = useReservationStore(
    (state) => state.setHasAttemptedNext
  );
  const selectedDay = useBasketStore((state) => state.selectedDay);
  const setSelectedDay = useBasketStore((state) => state.setSelectedDay);
  const basketOriginalData = useBasketStore((state) => state.originalData);
  const setHasClickedNextDay = useReservationStore(
    (state) => state.setHasClickedNextDay
  );
  const setOriginalData = useBasketStore((state) => state.setOriginalData);
  const setSelfId = useBasketStore((state) => state.setSelfId);

  const selectedUser = useBasketStore((state) => state.selectedUser);
  const { createOrderForOther, isCreating: isCreatingForOthers } =
    useCreateOrderForOther();

  const to = toDatePlan
    ? new Date(
        toDatePlan.getFullYear(),
        toDatePlan.getMonth(),
        toDatePlan.getDate()
      )
    : null;

  const calculateNextDay = (currentSelectedDay: string) => {
    const base = currentSelectedDay
      ? new Date(currentSelectedDay)
      : day
      ? new Date(day)
      : new Date();

    if (!to) {
      return currentSelectedDay;
    }

    const normalizedHolidays = holidays.map((h) => formatDate(new Date(h)));

    let next = new Date(base);
    next.setDate(next.getDate() + 1);
    next = new Date(next.getFullYear(), next.getMonth(), next.getDate());

    while (next <= to && normalizedHolidays.includes(formatDate(next))) {
      next.setDate(next.getDate() + 1);
    }

    if (next > to) {
      return currentSelectedDay;
    }

    const formattedNext = `${next.getFullYear()}-${String(
      next.getMonth() + 1
    ).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;

    return formattedNext;
  };

  const createPayload: CreateOrder = {
    PlanId: planId,
    OrderDetailItems: items
      .filter((p) => p.IsDeleted == false)
      .map((item) => ({
        DailyMealId: item.DailyMealId,
        Count: item.Count,
        SelfId: selfId,
      })),
  };
  const hasCartItems = createPayload.OrderDetailItems.length > 0;

  const fetchCorrectOrder = (orderDate: string) => {
    if (selectedUser) {
      console.log("1", selectedUser);
      fetchUserOrder({
        OrderDate: orderDate,
        PlanId: planId,
        userId: selectedUser.UserId,
      });
    } else {
      console.log("2", selectedUser);
      fetchOrder({
        PlanId: planId,
        OrderDate: orderDate,
      });
    }
  };

  const handleNextDay = () => {
    if (!selfId && items.length > 0) {
      setHasAttemptedNext(true);
      return;
    }
    const nextDay = calculateNextDay(selectedDay ?? "");

    setLoadingButton("nextDay");
    if (basketOriginalData.length > 0) {
      deleteAndReCreate(() => {
        setLoadingButton(null);
        setSelectedDay(nextDay);
        fetchCorrectOrder(nextDay);
        setHasClickedNextDay(true);
        setOriginalData([]);
        setDisableEdit(false);
      });
    } else {
      if (selectedUser) {
        if (createPayload.OrderDetailItems.length > 0) {
          createOrderForOther(
            { userId: selectedUser.UserId, body: createPayload },
            {
              onSuccess: () => {
                setSelectedDay(nextDay);
                setHasClickedNextDay(true);
                clearItems();
                fetchCorrectOrder(nextDay);
                setDisableEdit(false);
                setLoadingButton(null);
              },
            }
          );
        } else {
          setSelectedDay(nextDay);
          setHasClickedNextDay(true);
          clearItems();
          fetchCorrectOrder(nextDay);
          setDisableEdit(false);
          setLoadingButton(null);
        }
      } else {
        if (createPayload.OrderDetailItems.length > 0) {
          createOrder(createPayload, {
            onSuccess: () => {
              setSelectedDay(nextDay);
              setHasClickedNextDay(true);
              clearItems();
              fetchCorrectOrder(nextDay);
              setDisableEdit(false);
              setLoadingButton(null);
            },
          });
        } else {
          setSelectedDay(nextDay);
          setHasClickedNextDay(true);
          clearItems();
          fetchCorrectOrder(nextDay);
          setDisableEdit(false);
          setLoadingButton(null);
        }
      }
    }
  };

  const handleEdit = () => {
    deleteAndReCreate(() => {
      onOpenChange(false);
    });
  };

  const deleteAndReCreate = (callback: any = null) => {
    if (!selfId && items.length > 0) {
      setHasAttemptedNext(true);
      return;
    }
    const dailyMealItems = items.map((item) => ({
      DailyMealId: item.DailyMealId,
    }));

    deleteOrder(
      {
        OrderId: OrderId,
        DailyMealIds: dailyMealItems,
      },
      {
        onSuccess: () => {
          clearItems();
          if (selectedUser) {
            createOrderForOther(
              { userId: selectedUser.UserId, body: createPayload },
              {
                onSuccess: () => {
                  if (callback) {
                    callback();
                  }
                },
              }
            );
          } else {
            createOrder(createPayload, {
              onSuccess: () => {
                if (callback) {
                  callback();
                }
              },
            });
          }
        },
      }
    );
  };

  const handleSaveAndExit = () => {
    if (!selfId && items.length > 0) {
      setHasAttemptedNext(true);
      return;
    }

    setLoadingButton("saveExit");
    if (basketOriginalData.length > 0) {
      deleteAndReCreate(() => {
        onOpenChange(false);
        setLoadingButton(null);
      });
    } else {
      if (createPayload.OrderDetailItems.length > 0) {
        if (selectedUser) {
          createOrderForOther(
            { userId: selectedUser.UserId, body: createPayload },
            {
              onSuccess: async () => {
                onOpenChange(false);
                setLoadingButton(null);
                fetchCorrectOrder(selectedDay || "");
                if (basketOriginalData.length > 0) {
                  setDisableEdit(false);
                }

                try {
                  await queryClient.invalidateQueries({
                    queryKey: ["reservationForOthers"],
                  });
                  const updatedReservationData = await queryClient.fetchQuery({
                    queryKey: ["reservationForOthers", selectedUser.UserId],
                    queryFn: () =>
                      import("@/services/food/orderService").then((m) =>
                        m.GetReservationsForUser(selectedUser.UserId)
                      ),
                  });
                  const updatedPlan = updatedReservationData?.Data?.find(
                    (plan: any) => plan.PlanId === planId
                  );
                  const newOrderId = updatedPlan?.OrderId || OrderId;

                  if (newOrderId && newOrderId > 0) {
                    router.push(`/food/reservation/checkout/${newOrderId}`);
                  }
                } catch (error) {
                  console.error("Failed to refetch reservation data:", error);
                  // Fallback to using the original OrderId
                  if (OrderId && OrderId > 0) {
                    router.push(`/food/reservation/checkout/${OrderId}`);
                  }
                }
              },
            }
          );
        } else {
          createOrder(createPayload, {
            onSuccess: async () => {
              onOpenChange(false);
              setLoadingButton(null);
              fetchCorrectOrder(selectedDay || "");
              if (basketOriginalData.length > 0) {
                setDisableEdit(false);
              }

              try {
                await queryClient.invalidateQueries({
                  queryKey: ["reservation"],
                });
                const updatedReservationData = await queryClient.fetchQuery({
                  queryKey: ["reservation"],
                  queryFn: () =>
                    import("@/services/food/orderService").then((m) =>
                      m.getReservationApi()
                    ),
                });
                const updatedPlan = updatedReservationData?.Data?.find(
                  (plan: any) => plan.PlanId === planId
                );
                const newOrderId = updatedPlan?.OrderId || OrderId;

                if (newOrderId && newOrderId > 0) {
                  router.push(`/food/reservation/checkout/${newOrderId}`);
                }
              } catch (error) {
                console.error("Failed to refetch reservation data:", error);
                // Fallback to using the original OrderId
                if (OrderId && OrderId > 0) {
                  router.push(`/food/reservation/checkout/${OrderId}`);
                }
              }
            },
          });
        }
      } else {
        onOpenChange(false);
        setLoadingButton(null);
        if (basketOriginalData.length > 0) {
          setDisableEdit(false);
        }
        router.push(`/food/reservation/checkout/${OrderId}`);
      }
    }
  };

  useEffect(() => {
    if (items && items.length > 0) {
      const selfIds = items.map((item) => item.SelfId);

      const allEqual =
        selfIds.every((id) => id === selfIds[0]) && selfIds[0] !== null;

      if (allEqual) {
        setSelfId(selfIds[0]);
      }
    }
  }, [items]);

  const realItems = items.filter((item) => item.IsDeleted === false);
  const disableNextdayBtn = realItems.length === 0;

  // Check if there are food reservations for one or more days
  const hasReservationsForOneOrMoreDays = planDays
    ? planDays.filter(
        (day) =>
          day.ReservationsDetails &&
          day.ReservationsDetails.some(
            (reservation) => Number(reservation.DailyMealId) !== 0
          )
      ).length >= 1
    : false;

  const isSameDay =
    lastDayNotHoliday?.toISOString().slice(0, 10) ===
    currentDay?.toISOString().slice(0, 10);

  return (
    <div className="w-[246] h-full flex flex-col items-center justify-between">
      <OrderCart currentDay={currentDay} />

      {hasValidReservation && disableEdit ? (
        <div className="flex items-center justify-between w-full">
          <Button
            className="bg-primary-950 text-secondary-0 py-[8px] w-[246px] rounded-[8px]"
            onPress={handleEdit}
            isLoading={isDeleting || isCreating}
            isDisabled={disableNextdayBtn}
          >
            ویرایش
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-end w-full">
          {!isSameDay ? (
            <Button
              className="bg-primary-950 text-secondary-0 py-[8px] w-[149px] rounded-[8px]"
              onPress={handleNextDay}
              // isDisabled={disableNextdayBtn}
              isLoading={loadingButton === "nextDay"}
            >
              روز بعدی
            </Button>
          ) : (
            <Button
              className={`text-primary-950 border border-primary-950/[.25]
              py-[8px] px-[9px] rounded-[8px] "text-gray-400 bg-transparent border-gray-300"
           `}
              onPress={handleSaveAndExit}
              isLoading={loadingButton === "saveExit"}
              isDisabled={!hasReservationsForOneOrMoreDays && !hasCartItems}
            >
              ثبت و تایید
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

import { useAuth } from "@/packages/auth/hooks/useAuth";
import OrderDelete from "@/models/food/order/OrderDelete";
import {
  CreateOrderApi,
  DeleteOrderApi,
  EditOrderApi,
  GetOrderByIdApi,
  getOrderListApi,
  getReservationApi,
  CloseOrderApi,
  DeleteUserOrderCascadeApi,
  GetReservationsForUser,
  CreatOrderForUser,
  CloseOrderByUserIdApi,
} from "@/services/food/orderService";
import { addToaster } from "@/ui/Toaster";
import { useQueryClient } from "@tanstack/react-query";
import useGuardedMutation from "../useGuardedMutation";
import { useRouter } from "next/navigation";
import { useGuardedQuery } from "../useGuardedQuery";
import CreateOrder from "@/models/food/order/CreateOrder";
import CloseOrder from "@/models/food/order/CloseOrder";
import { useBasketStore } from "@/store/basketStore";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useCreateOrder() {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1530);

  const queryClient = useQueryClient();
  const { mutate: createOrder, isPending: isCreating } = useGuardedMutation({
    mutationFn: CreateOrderApi,
    enabled: hasRequiredService,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({ queryKey: ["orderList"] });
        queryClient.invalidateQueries({ queryKey: ["reservation"] });
        queryClient.invalidateQueries({ queryKey: ["GetBalanceAndCharge"] });

        addToaster({
          title: data.ResponseMessage,
          color: "success",
        });
      } else {
        addToaster({
          title: data.ResponseMessage,
          color: "danger",
        });
      }
    },
    onError: (error: any) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });
  return { createOrder, isCreating };
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1531);
  const selectedUser = useBasketStore((state) => state.selectedUser);

  const { mutate: deleteOrder, isPending: isDeleting } = useGuardedMutation({
    mutationFn: ({
      OrderId,
      DailyMealIds,
    }: {
      OrderId: number;
      DailyMealIds: OrderDelete[];
    }) => DeleteOrderApi(OrderId, DailyMealIds),
    enabled: hasRequiredService,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({ queryKey: ["orderList"] });
        queryClient.invalidateQueries({ queryKey: ["reservation"] });
        queryClient.invalidateQueries({ queryKey: ["GetBalanceAndCharge"] });
        if (selectedUser) {
          queryClient.invalidateQueries({ queryKey: ["reservationForOthers"] });
        }
        // addToaster({
        //   title: data.ResponseMessage,
        //   color: "success",
        // });
      }
    },
    onError: (error: any) => {
      addToaster({
        title: error.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });

  return { deleteOrder, isDeleting };
}

export function useOrderList(pageNumber: number, pageSize: number) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1532);

  const { data: orderData, isLoading: isGetting } = useGuardedQuery({
    queryFn: () => getOrderListApi(pageNumber, pageSize),
    queryKey: ["orderList", pageNumber, pageSize],
    enabled: hasRequiredService,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });
  return { orderData, isGetting };
}

export function useGetOrderById(id: number | null) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1533);

  const { data: orderDataById, isLoading: isGettingById } = useGuardedQuery({
    queryKey: ["order-get-by-id", id],
    queryFn: () =>
      id === null ? Promise.resolve(null) : GetOrderByIdApi({ id }),
    enabled: id !== null && hasRequiredService,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { orderDataById, isGettingById };
}

export function useEditOrder() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1534);
  const selectedUser = useBasketStore((state) => state.selectedUser);

  const { mutate: editData, isPending: isEditting } = useGuardedMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      EditOrderApi(id, data),
    retry: 1,
    enabled: hasRequiredService,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({
          queryKey: ["orderList"],
        });
        if (selectedUser) {
          queryClient.invalidateQueries({ queryKey: ["reservationForOthers"] });
        }
        addToaster({
          title: data.ResponseMessage,
          color: "success",
        });
      }
    },
    onError: (error: any) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });

  return { editData, isEditting };
}

export function useGetReservation() {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1549);

  const {
    data: reservationData,
    isLoading: isGetting,
    isFetching: isFetching,
  } = useGuardedQuery({
    queryFn: () => getReservationApi(),
    queryKey: ["reservation"],
    enabled: hasRequiredService,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0,
  });
  return { reservationData, isGetting, isFetching };
}

export function useGetReservationForOthers(userId: number) {
  const { data: reservationForOthers, isLoading: isGettingForOthers } =
    useGuardedQuery({
      queryFn: () => GetReservationsForUser(userId),
      queryKey: ["reservationForOthers", userId],
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: "always",
      staleTime: 0,
      gcTime: 0,
      enabled: userId > 0,
    });
  return { reservationForOthers, isGettingForOthers };
}

// export function useGetOrderByPlanIdAndDate(PlanId: number, OrderDate: string) {
//   const {
//     data: orderData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGuardedQuery({
//     queryKey: ["order", PlanId, OrderDate],
//     queryFn: async () => {
//       const p = await getOrderByPlanIdAndDate(PlanId, OrderDate);
//       return p;
//     },
//     staleTime: 1000 * 60,
//     refetchOnWindowFocus: false,
//   });

//   return { orderData, isLoading, isError, refetch };
// }

// export function useGetOrderByPlanIdAndDateForUser(
//   PlanId: number,
//   OrderDate: string,
//   userId: number
// ) {
//   const {
//     data: orderDataForUser,
//     isLoading,
//     isError,
//     refetch,
//   } = useGuardedQuery({
//     queryKey: ["orderForOther", PlanId, OrderDate, userId],
//     queryFn: () => getOrderByPlanIdAndDateForUser(PlanId, OrderDate, userId),
//     staleTime: 1000 * 60,
//     refetchOnWindowFocus: false,
//     enabled: !!userId && !!PlanId && !!OrderDate,
//   });

//   return { orderDataForUser, isLoading, isError, refetch };
// }

export function useCloseOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1530); // Assuming same service as create order

  const { mutate: closeOrder, isPending: isClosing } = useGuardedMutation({
    mutationFn: CloseOrderApi,
    enabled: hasRequiredService,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({ queryKey: ["orderList"] });
        queryClient.invalidateQueries({ queryKey: ["reservation"] });
        queryClient.invalidateQueries({ queryKey: ["GetBalanceAndCharge"] });

        addToaster({
          title: data.ResponseMessage,
          color: "success",
        });

        // Navigate to payment success page
        router.push("/food/payment-success");
      } else {
        addToaster({
          title: data.ResponseMessage,
          color: "danger",
        });
      }
    },
    onError: (error: any) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });

  return { closeOrder, isClosing };
}

export function useCloseOrderForOthers() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: closeOrderForOthers, isPending: isClosingForOthers } =
    useGuardedMutation({
      mutationFn: ({ userId, body }: { userId: number; body: CloseOrder }) =>
        CloseOrderByUserIdApi(userId, body),
      onSuccess: (data) => {
        if (data.ResponseCode === 100) {
          queryClient.invalidateQueries({ queryKey: ["orderList"] });
          queryClient.invalidateQueries({ queryKey: ["reservation"] });
          queryClient.invalidateQueries({ queryKey: ["GetBalanceAndCharge"] });

          addToaster({
            title: data.ResponseMessage,
            color: "success",
          });

          router.push("/food/payment-success");
        } else {
          addToaster({
            title: data.ResponseMessage,
            color: "danger",
          });
        }
      },
      onError: (error: any) => {
        addToaster({
          title: error?.message || "خطایی رخ داده است",
          color: "danger",
        });
      },
    });

  return { closeOrderForOthers, isClosingForOthers };
}

export function useDeleteUserOrderCascade() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1531);

  const { mutate: deleteUserOrderCascade, isPending: isDeleting } =
    useGuardedMutation({
      mutationFn: (id: number) => DeleteUserOrderCascadeApi(id),
      enabled: hasRequiredService,
      onSuccess: (data) => {
        if (data.ResponseCode === 100) {
          queryClient.refetchQueries({
            queryKey: ["plan-order-summary"],
            exact: false,
          });
          addToaster({
            title: data.ResponseMessage || "سفارش با موفقیت حذف شد",
            color: "success",
          });
        }
      },
      onError: (error: any) => {
        addToaster({
          title: error.message || "خطایی رخ داده است",
          color: "danger",
        });
      },
    });

  return { deleteUserOrderCascade, isDeleting };
}

export function useCreateOrderForOther() {
  const queryClient = useQueryClient();
  const { mutate: createOrderForOther, isPending: isCreating } =
    useGuardedMutation({
      mutationFn: ({ userId, body }: { userId: number; body: CreateOrder }) =>
        CreatOrderForUser(userId, body),
      onSuccess: (data) => {
        if (data.ResponseCode === 100) {
          queryClient.invalidateQueries({ queryKey: ["orderList"] });
          queryClient.invalidateQueries({ queryKey: ["reservationForOthers"] });
          queryClient.invalidateQueries({
            queryKey: ["GetBalanceAndChargeForOthers"],
          });

          addToaster({
            title: data.ResponseMessage,
            color: "success",
          });
        } else {
          addToaster({
            title: data.ResponseMessage,
            color: "danger",
          });
        }
      },
      onError: (error: any) => {
        addToaster({
          title: error?.message || "خطایی رخ داده است",
          color: "danger",
        });
      },
    });
  return { createOrderForOther, isCreating };
}

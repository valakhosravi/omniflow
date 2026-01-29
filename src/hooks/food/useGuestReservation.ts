import GeneralResponse from "@/models/general-response/general_response";
import useGuardedMutation from "../useGuardedMutation";
import { CreateGuestOrderModel } from "@/models/food/guestReservation/CreateGuestOrderModel";
import {
  createGuestOrder,
  deleteGuestOrder,
  EditGuestOrder,
  getBuildings,
  GetGuestOrderPlanId,
  getGuestOrders,
  GetGuestOrdersByPlanId,
  GetUnreservedPlans,
  SearchByFullName,
} from "@/services/food/GuestReservationService";
import { useGuardedQuery } from "../useGuardedQuery";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateGuestOrder() {
  const queryClient = useQueryClient();
  const { mutate: createOrder, isPending: isCreating } = useGuardedMutation<
    GeneralResponse<null>,
    Error,
    CreateGuestOrderModel[]
  >({
    mutationFn: async (payload) => {
      return await createGuestOrder(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestOrdrs"] });
      queryClient.invalidateQueries({ queryKey: ["guestOrderPlans"] });
    },
  });

  return { createOrder, isCreating };
}

export function useGetGuestOrders(pageNumber: number, pageSize: number) {
  const {
    data: guestOrders,
    isLoading: isGetting,
    refetch,
  } = useGuardedQuery({
    queryFn: () => getGuestOrders(pageNumber, pageSize),
    queryKey: ["guestOrdrs", pageNumber, pageSize],
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { guestOrders, isGetting, refetch };
}

export function useDeleteGuestOrder(id: number) {
  const queryClient = useQueryClient();
  const { mutate: deleteOrder, isPending: isDeleting } = useGuardedMutation({
    mutationFn: (id: number) => deleteGuestOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestOrdrs"] });
    },
    enabled: id !== 0,
  });
  return { deleteOrder, isDeleting };
}

export function usegetBuildings() {
  const { data: buildings, isLoading: isGetting } = useGuardedQuery({
    queryFn: () => getBuildings(),
    queryKey: ["buildings"],
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { buildings, isGetting };
}

export function useGetUnreservedPlans() {
  const { data: unreservedPlans, isLoading: isGetting } = useGuardedQuery({
    queryFn: () => GetUnreservedPlans(),
    queryKey: ["unreservedPlans"],
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { unreservedPlans, isGetting };
}

export function useGetGuestOrderPlans(pageNumber: number, pageSize: number) {
  const {
    data: plans,
    isLoading: isGetting,
    refetch,
  } = useGuardedQuery({
    queryFn: () => GetGuestOrderPlanId(pageNumber, pageSize),
    queryKey: ["guestOrderPlans", pageNumber, pageSize],
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { plans, isGetting, refetch };
}

export function useGetGuestOrderByPlanId(id: number) {
  const { data: OrdersByPlanId, isLoading } = useGuardedQuery({
    queryFn: () => GetGuestOrdersByPlanId(id),
    queryKey: ["guestOrderByPlanId", id],
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: Boolean(id),
  });
  return { OrdersByPlanId, isLoading };
}

export function useEditGuestOrder() {
  const queryClient = useQueryClient();

  const { mutate: editOrder, isPending: isEditing } = useGuardedMutation<
    GeneralResponse<null>,
    Error,
    { id: number; payload: CreateGuestOrderModel[] }
  >({
    mutationFn: async ({ id, payload }) => {
      return await EditGuestOrder(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestOrderByPlanId"] });
      queryClient.invalidateQueries({ queryKey: ["guestOrders"] });
    },
  });

  return { editOrder, isEditing };
}

export function useSearchByFullName(fullName: string) {
  const { data: searchByFullName, isLoading: isGetting } = useGuardedQuery({
    queryFn: () => SearchByFullName(fullName),
    queryKey: ["searchByFullName", fullName],
    enabled: fullName.trim().length > 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { searchByFullName, isGetting };
}

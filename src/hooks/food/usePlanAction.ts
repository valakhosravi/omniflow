import { useAuth } from "@/packages/auth/hooks/useAuth";
import PlanModel from "@/models/food/plan/PlanModel";
import {
  CreatePlanApi,
  DeletePlanApi,
  EditPlanApi,
  GetNextPlan,
  GetPlanByIdApi,
  getPlanListApi,
  GetPlanOrderSummaryApi,
  planChangeStatusApi,
} from "@/services/food/planService";
import { addToaster } from "@/ui/Toaster";
import { useQueryClient } from "@tanstack/react-query";
import useGuardedMutation from "../useGuardedMutation";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function usePlanList(pageNumber: number, pageSize: number) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1516);

  const { data: planData, isLoading: isGetting } = useGuardedQuery({
    queryFn: () => getPlanListApi(pageNumber, pageSize),
    queryKey: ["planList", pageNumber, pageSize],
    enabled: hasRequiredService,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });
  return { planData, isGetting };
}

export function useDeletePlan() {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1517);

  const { mutate: deletePlan, isPending: isDeleting } = useGuardedMutation({
    mutationFn: (id: number) => DeletePlanApi(id),
    enabled: hasRequiredService,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        addToaster({
          title: data.ResponseMessage,
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

  return { deletePlan, isDeleting };
}

export function useCreatePlan() {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1527);

  const queryClient = useQueryClient();
  const { mutate: createPlan, isPending: isCreating } = useGuardedMutation({
    mutationFn: CreatePlanApi,
    enabled: hasRequiredService,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({ queryKey: ["planList"] });
        queryClient.invalidateQueries({ queryKey: ["reservation"] });
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
  return { createPlan, isCreating };
}

export function useChangeStatusPlan(currentPage: number, pageSize: number) {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1548);

  const { mutate: changeStatus, isPending: isChanging } = useGuardedMutation({
    mutationFn: (plan: PlanModel) => planChangeStatusApi(plan.PlanId),
    enabled: hasRequiredService,
    onSuccess: (data, variables) => {
      if (data.ResponseCode === 100) {
        addToaster({
          title: data.ResponseMessage,
          color: "success",
        });

        queryClient.setQueryData(
          ["planList", currentPage, pageSize],
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              Data: {
                ...oldData.Data,
                Items: oldData.Data.Items.map((item: PlanModel) =>
                  item.PlanId === variables.PlanId
                    ? { ...item, IsActive: !item.IsActive }
                    : item
                ),
              },
            };
          }
        );
        queryClient.invalidateQueries({ queryKey: ["reservation"] });
        queryClient.invalidateQueries({ queryKey: ["activePlanDates"] });
      }
    },
    onError: (err: Error) => {
      addToaster({
        title: err.message,
        color: "danger",
      });
    },
  });

  return { changeStatus, isChanging };
}

export function useGetPlanById(id: number | null) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1547);

  const { data: planData, isLoading: isGetting } = useGuardedQuery({
    queryKey: ["plan-get-by-id", id],
    queryFn: () => {
      if (id === null) return Promise.resolve(null);
      return GetPlanByIdApi(id);
    },
    enabled: id !== null && id !== undefined && hasRequiredService,
    retry: false,
  });
  return { planData, isGetting };
}

export function useEditPlan() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1528);

  const { mutate: editData, isPending: isEditting } = useGuardedMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      EditPlanApi(id, data),
    enabled: hasRequiredService,
    retry: false,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({ queryKey: ["planList"] });
        queryClient.invalidateQueries({ queryKey: ["reservation"] });
        queryClient.invalidateQueries({ queryKey: ["plan-get-by-id"] });
        addToaster({
          title: data.ResponseMessage,
          color: "success",
        });
      } else {
        addToaster({
          title: data.ResponseMessage,
          color: "warning",
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

export function useGetNextPlan() {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1529);

  const { data: nextPlan, isLoading: isGetting } = useGuardedQuery({
    queryKey: ["nextplan"],
    queryFn: () => GetNextPlan(),
    enabled: hasRequiredService,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { nextPlan, isGetting };
}

export function useGetPlanOrderSummary(planId: number, fullname?: string) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1539);

  const { data: planOrderSummary, isLoading: isGetting } = useGuardedQuery({
    queryKey: ["plan-order-summary", planId, fullname],
    queryFn: () => GetPlanOrderSummaryApi(planId, fullname),
    enabled: hasRequiredService,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { planOrderSummary, isGetting };
}

import { useAuth } from "@/packages/auth/hooks/useAuth";
import {
  AdminFeedbackDeleteApi,
  createFeedbackApi,
  getFeedbackGetByMealIdApi,
  getHasWriteFeedbackApi,
  getRateByDailyMealIdApi,
  getTotalRateApi,
  UserFeedbackDeleteApi,
} from "@/services/food/FeedbackService";
import { addToaster } from "@/ui/Toaster";
import { useQueryClient } from "@tanstack/react-query";
import useGuardedMutation from "../useGuardedMutation";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useGetFeedbackByMealId(id: number, enabled: boolean = true) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1537);
  const { data: rate, isLoading: isRating } = useGuardedQuery({
    queryKey: ["feedback-get-by-id", id],
    queryFn: () => {
      if (id === null) return Promise.resolve(null);
      return getFeedbackGetByMealIdApi(id);
    },
    enabled:
      enabled &&
      id !== null &&
      id !== undefined &&
      id > 0 &&
      hasRequiredService,
    retry: 1,
    staleTime: 0,
  });
  return { rate, isRating };
}

export function useGetRateByDailyMealId(id: number) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1556);
  const { data: rate, isLoading: isRating } = useGuardedQuery({
    queryKey: ["rate-get-by-id", id],
    queryFn: () => {
      if (id === null) return Promise.resolve(null);
      return getRateByDailyMealIdApi(id);
    },
    enabled: hasRequiredService,
    retry: 1,
    staleTime: 0,
  });
  return { rate, isRating };
}

export function useGetHasWriteFeedback(id: number) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1545);
  const { data: hasWriteFeedback, isLoading: isHasWriteFeedbackLoading } =
    useGuardedQuery({
      queryKey: ["has-write-feedback", id],
      queryFn: () => {
        if (id === null) return Promise.resolve(null);
        return getHasWriteFeedbackApi(id);
      },
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: DEFAULT_STALE_TIME,
      gcTime: 5 * 60 * 1000,
      enabled: hasRequiredService,
    });
  return { hasWriteFeedback, isHasWriteFeedbackLoading };
}

export function useGetTotalRate(id: number) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1546);
  const { data: totalRate, isLoading: isTotalRateLoading } = useGuardedQuery({
    queryKey: ["total-rate", id],
    queryFn: () => {
      if (id === null) return Promise.resolve(null);
      return getTotalRateApi(id);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
    enabled: hasRequiredService,
  });
  return { totalRate, isTotalRateLoading };
}

export function useCreateFeedback() {
  const { userDetail } = useAuth();
  const queryClient = useQueryClient();
  const hasRequiredService = userDetail?.ServiceIds.includes(1535);

  const { mutate: createFeedback, isPending: isCreating } = useGuardedMutation({
    mutationFn: createFeedbackApi,
    enabled: hasRequiredService,
    onSuccess: (data, variables) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({
          queryKey: ["rate-get-by-id", variables.DailyMealId],
        });
        // queryClient.refetchQueries({
        //   queryKey: ["rate-get-by-id", variables.DailyMealId],
        // });
        queryClient.invalidateQueries({
          queryKey: ["total-rate", variables.MealId],
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
  return { createFeedback, isCreating };
}

export function useUserDeleteComment() {
  const { mutate: deleteFeedback, isPending: isDeleting } = useGuardedMutation({
    mutationFn: (id: number) => UserFeedbackDeleteApi(id),
    onError: (error: any) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });

  return { deleteFeedback, isDeleting };
}

export function useAdminDeleteComment() {
  const { mutate: adminDeleteFeedback, isPending: isAdminDeleting } =
    useGuardedMutation({
      mutationFn: (id: number) => AdminFeedbackDeleteApi(id),
      onError: (error: any) => {
        addToaster({
          title: error?.message || "خطایی رخ داده است",
          color: "danger",
        });
      },
    });

  return { adminDeleteFeedback, isAdminDeleting };
}

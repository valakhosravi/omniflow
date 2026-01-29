import { useAuth } from "@/packages/auth/hooks/useAuth";
import {
  CreateHolidayApi,
  DeleteHolidayApi,
  holidayGetallApi,
  holidayGetFromAndToApi,
} from "@/services/food/holidayService";
import { addToaster } from "@/ui/Toaster";
import { useQueryClient } from "@tanstack/react-query";
import useGuardedMutation from "../useGuardedMutation";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useHolidayList() {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1551);
  const { data: holidayData, isLoading: isGetting } = useGuardedQuery({
    queryFn: () => holidayGetallApi(),
    queryKey: ["holidayList"],
    enabled: hasRequiredService,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });
  return { holidayData, isGetting };
}

export function useCreateHoliday() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1552);

  const { mutate: createHoliday, isPending: isCreating } = useGuardedMutation({
    mutationFn: CreateHolidayApi,
    enabled: hasRequiredService,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({ queryKey: ["holidayList"] });
        queryClient.invalidateQueries({ queryKey: ["holidayByFromTo"] });
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
  return { createHoliday, isCreating };
}

export function useDeleteHoliday() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1557);
  const { mutate: deleteHoliday, isPending: isDeleting } = useGuardedMutation({
    mutationFn: (date: string) => DeleteHolidayApi(date),
    enabled: hasRequiredService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidayByFromTo"] });
    },
    onError: (error: any) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });
  return { deleteHoliday, isDeleting };
}

export function useHolidayGetFromAndTo({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1555);

  const { data: holidayFromTo, isLoading: isGetting } = useGuardedQuery({
    queryFn: () => holidayGetFromAndToApi(from, to),
    queryKey: ["holidayByFromTo", from, to],
    enabled: hasRequiredService,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });
  return { holidayFromTo, isGetting };
}

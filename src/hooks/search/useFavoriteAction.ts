import { useAuth } from "@/packages/auth/hooks/useAuth";
import favEditRequest from "@/models/search/favEditRequest";
import favRequestUpdate from "@/models/search/favRequestUpdate";
import {
  CreateSearchUrlApi,
  DeleteFavoriteApi,
  EditFavoriteApi,
  getFavoriteListApi,
  updateFavoriteApi,
} from "@/services/search/favorite";
import { addToaster } from "@/ui/Toaster";
import { useQueryClient } from "@tanstack/react-query";
import useGuardedMutation from "../useGuardedMutation";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useFavoriteList() {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1001);

  const { data: favoriteData, isLoading: isGetting } = useGuardedQuery({
    queryFn: () => getFavoriteListApi(),
    queryKey: ["favoriteList"],
    enabled: !!userDetail && hasRequiredService,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: "always"
  });
  return { favoriteData, isGetting };
}

export function useUpdateFavoriteOrder() {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1004);

  const { mutate: updateOrder, isPending: isUpdating } = useGuardedMutation({
    mutationFn: ({ data }: { data: favRequestUpdate }) =>
      updateFavoriteApi(data),
    enabled: hasRequiredService,
    retry: false,
  });
  return { updateOrder, isUpdating };
}

export function useCreateFavorite() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1002);

  const { mutate: createFavorite, isPending: isCreating } = useGuardedMutation({
    mutationFn: CreateSearchUrlApi,
    enabled: hasRequiredService,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({ queryKey: ["favoriteList"] });
      }
    },
    onError: (error: any) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });
  return { createFavorite, isCreating };
}

export function useDeleteFavorite() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1003);

  const { mutate: deleteFavorite, isPending: isDeleting } = useGuardedMutation({
    mutationFn: (id: number) => DeleteFavoriteApi(id),
    enabled: hasRequiredService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteList"] });
    },
    onError: (error: any) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });
  return { deleteFavorite, isDeleting };
}

export function useEditFavorite() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1006);

  const { mutate: editFavorite, isPending: isEditting } = useGuardedMutation({
    mutationFn: ({ id, data }: { id: number; data: favEditRequest }) =>
      EditFavoriteApi(id, data),
    enabled: hasRequiredService,
    retry: false,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["favoriteList"] });
      addToaster({
        title: data.ResponseMessage,
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });
  return { editFavorite, isEditting };
}

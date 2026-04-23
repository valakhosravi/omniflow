import { useAuth } from "@/packages/auth/hooks/useAuth";
import {
  CreateSelfApi,
  DeleteSelfApi,
  EditSelfApi,
  GetSelfByIdApi,
  getSelfListApi,
} from "@/services/food/selfService";
import { addToaster } from "@/ui/Toaster";
import { useQueryClient } from "@tanstack/react-query";
import useGuardedMutation from "../useGuardedMutation";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useSelfList(pageNumber: number, pageSize: number) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1511);

  const { data: selfData, isLoading: isGetting } = useGuardedQuery({
    queryFn: () => getSelfListApi(pageNumber, pageSize),
    queryKey: ["selfList", pageNumber, pageSize],
    enabled: hasRequiredService,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });
  return { selfData, isGetting };
}

export function useDeleteSelf() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1514);

  const { mutate: deleteSelf, isPending: isDeleting } = useGuardedMutation({
    mutationFn: (id: number) => DeleteSelfApi(id),
    enabled: hasRequiredService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["selfList"] });
    },
    onError: (error: any) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });
  return { deleteSelf, isDeleting };
}

export function useCreateSelf() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1512);

  const { mutate: createData, isPending: isCreating } = useGuardedMutation({
    mutationFn: CreateSelfApi,
    enabled: hasRequiredService,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({ queryKey: ["selfList"] });
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
  return { createData, isCreating };
}

export function useGetSelfById(id: number | null) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1515);

  const { data: selfData, isLoading: isGetting } = useGuardedQuery({
    queryKey: ["self-get-by-id", id],
    queryFn: () => {
      if (id === null) return Promise.resolve(null);
      return GetSelfByIdApi(id);
    },
    enabled: id !== null && hasRequiredService,
    retry: false,
  });
  return { selfData, isGetting };
}

export function useEditSelf() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1513);

  const { mutate: editData, isPending: isEditting } = useGuardedMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      EditSelfApi(id, data),
    enabled: hasRequiredService,
    retry: false,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["selfList"] });
      addToaster({
        title: data.ResponseMessage,
        color: "success",
      });
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

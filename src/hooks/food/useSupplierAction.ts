import { useAuth } from "@/packages/auth/hooks/useAuth";
import {
  SupplierCreateApi,
  SupplierDeleteApi,
  SupplierEditApi,
  SupplierGetByIdApi,
  SupplierListApi,
} from "@/services/food/supplierService";
import { addToaster } from "@/ui/Toaster";
import { useQueryClient } from "@tanstack/react-query";
import useGuardedMutation from "../useGuardedMutation";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useGetSupplierList(pageNumber: number, pageSize: number) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1520);

  const { data: supplierData, isLoading: isSupplierLoading } = useGuardedQuery({
    queryFn: () => SupplierListApi(pageNumber, pageSize),
    queryKey: ["supplierList", pageNumber, pageSize],
    enabled: !!userDetail && hasRequiredService,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });

  return { supplierData, isSupplierLoading };
}

export function useGetSupplierById(id: number | null) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1524);

  const { data: supplierData, isLoading: isSupplierLoading } = useGuardedQuery({
    queryKey: ["supplier-get-by-id", id],
    queryFn: () => {
      if (id === null) return Promise.resolve(null);
      return SupplierGetByIdApi(id);
    },
    enabled: id !== null && hasRequiredService,
    retry: false,
  });
  return { supplierData, isSupplierLoading };
}

export function useDeleteSupplier() {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1523);

  const { mutate: deleteMutation, isPending: deletePending } =
    useGuardedMutation({
      mutationFn: (id: number) => SupplierDeleteApi(id),
      enabled: hasRequiredService,
      onSuccess: (data) => {
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

  return { deletePending, deleteMutation };
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1522);

  const { mutate: updateMutation, isPending: updatePending } =
    useGuardedMutation({
      mutationFn: ({ id, data }: { id: number; data: any }) =>
        SupplierEditApi(id, data),
      enabled: hasRequiredService,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["supplierList"] });
        addToaster({
          title: data?.ResponseMessage,
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
  return { updateMutation, updatePending };
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1521);

  const { mutate: createMutation, isPending: createPending } =
    useGuardedMutation({
      mutationFn: SupplierCreateApi,
      enabled: hasRequiredService,
      onSuccess: (data) => {
        if (data.ResponseCode === 100) {
          queryClient.invalidateQueries({ queryKey: ["supplierList"] });
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
  return { createMutation, createPending };
}

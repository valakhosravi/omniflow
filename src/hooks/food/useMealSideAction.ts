import SideMealModel from "@/models/food/sidemeal/SideMealModel";
import {
  CreateMealSideApi,
  DeleteMealSideApi,
  EditMealSideApi,
  GetMealSideByIdApi,
  getMealSideListApi,
  mealsideChangeStatusApi,
  mealsideGetBySupplierId,
} from "@/services/food/mealsideService";
import { addToaster } from "@/ui/Toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useMealSideList(pageNumber: number, pageSize: number) {
  const { data: mealSideData, isLoading: isGetting } = useGuardedQuery({
    queryFn: () => getMealSideListApi(pageNumber, pageSize),
    queryKey: ["mealsideList", pageNumber, pageSize],
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });
  return { mealSideData, isGetting };
}

export function useGetMealSideById(id: number | null) {
  const { data: mealsideData, isLoading: isGetting } = useGuardedQuery({
    queryKey: ["mealside-get-by-id", id],
    queryFn: () => {
      if (id === null) return Promise.resolve(null);
      return GetMealSideByIdApi(id);
    },
    enabled: id !== null,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { mealsideData, isGetting };
}

export function useCreateMealSide() {
  const queryClient = useQueryClient();

  const { mutate: createData, isPending: isCreating } = useMutation({
    mutationFn: CreateMealSideApi,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({ queryKey: ["mealsideList"] });
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

export function useEditMealSide() {
  const { mutate: editData, isPending: isEditting } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      EditMealSideApi(id, data),
    retry: false,
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
  return { editData, isEditting };
}

export function useDeleteMealSide() {
  const { mutate: deleteSideMeal, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => DeleteMealSideApi(id),
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

  return { deleteSideMeal, isDeleting };
}

export function useChangeStatusMealSide(currentPage: number, pageSize: number) {
  const queryClient = useQueryClient();
  const { mutate: changeStatus, isPending: isChanging } = useMutation({
    mutationFn: (mealside: SideMealModel) =>
      mealsideChangeStatusApi(mealside.MealSideId),
    onSuccess: (data, variables) => {
      if (data.ResponseCode === 100) {
        addToaster({
          title: data.ResponseMessage,
          color: "success",
        });

        queryClient.setQueryData(
          ["mealsideList", currentPage, pageSize],
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              Data: {
                ...oldData.Data,
                Items: oldData.Data.Items.map((item: SideMealModel) =>
                  item.MealSideId === variables.MealSideId
                    ? { ...item, IsActive: !item.IsActive }
                    : item
                ),
              },
            };
          }
        );
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

export function useGetMealsideBySupplierById(id: number | null) {
  const queryClient = useQueryClient();
  const {
    data: mealsideBySupplier,
    isLoading: isGettingMealside,
    isError,
  } = useGuardedQuery({
    queryKey: ["mealside-get-by-supplier-id", id],
    queryFn: async () => {
      const response = await mealsideGetBySupplierId(id!);
      queryClient.setQueryData(
        ["mealside-get-by-supplier-id", id],
        response?.Data
      );
      return response?.Data;
    },
    enabled: id !== null,
    retry: false,
  });
  return { mealsideBySupplier, isGettingMealside, isError };
}

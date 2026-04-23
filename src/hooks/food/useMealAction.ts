import { useQueryClient } from "@tanstack/react-query";
import { MealResponse } from "@/models/food/meal/MealResponse";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import {
  createMealApi,
  deleteMealApi,
  editMealApi,
  getMealListApi,
  mealChangeStatusApi,
  mealGetByIdApi,
  mealGetBySupplierId,
  SortField,
  SortType,
} from "@/services/food/mealService";
import { addToaster } from "@/ui/Toaster";
import useGuardedMutation from "../useGuardedMutation";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useGetMealList(
  pageNumber: number,
  pageSize: number,
  searchField?: string,
  searchValue?: string,
  sortField?: SortField,
  sortType?: SortType
) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1500);

  const { data: mealList, isLoading: isMenuListLoading } = useGuardedQuery({
    queryKey: [
      "mealList",
      pageNumber,
      pageSize,
      searchField,
      searchValue,
      sortField,
      sortType,
    ],
    queryFn: () =>
      getMealListApi(
        pageNumber,
        pageSize,
        searchField,
        searchValue,
        sortField,
        sortType
      ),
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
    enabled: hasRequiredService,
  });

  return { mealList, isMenuListLoading };
}

export function useCreateMeal() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1501);

  const { isPending: isCreating, mutateAsync: createMeal } = useGuardedMutation(
    {
      mutationFn: createMealApi,
      enabled: hasRequiredService,
      onSuccess: (data) => {
        if (data.ResponseCode === 100) {
          queryClient.invalidateQueries({
            queryKey: ["mealList"],
            refetchType: "active",
          });
          queryClient.invalidateQueries({
            queryKey: ["meal-get-by-supplier-id"],
            exact: false,
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
          title: error.message,
          color: "danger",
        });
      },
    }
  );
  return { isCreating, createMeal };
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1503);

  const { mutate: mealDelete, isPending: isDeletingMeal } = useGuardedMutation({
    mutationFn: (id: number) => deleteMealApi(id),
    enabled: hasRequiredService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meal-get-by-supplier-id"],
        exact: false,
      });
    },
    onError: (error: any) => {
      addToaster({
        title: error.message,
        color: "danger",
      });
    },
  });
  return { mealDelete, isDeletingMeal };
}

export function useGetMealById(id: number | null) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1504);

  const {
    data: mealData,
    isLoading: isMealLoading,
    error,
  } = useGuardedQuery({
    queryKey: ["meal-get-by-id", id],
    queryFn: () => {
      if (id === null) return Promise.resolve(null);
      return mealGetByIdApi(id);
    },
    enabled: id !== null && hasRequiredService,
    // retry: 1,
    staleTime: DEFAULT_STALE_TIME,
  });
  return { mealData, isMealLoading, error };
}

export function useEditMeal() {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1502);

  const { mutate: editMeal, isPending: isEditing } = useGuardedMutation({
    mutationFn: (meal: MealResponse) => editMealApi(meal.MealId, meal),
    enabled: hasRequiredService,
    onSuccess: (data, variables: MealResponse) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({
          queryKey: ["meal-get-by-id", variables.MealId],
          refetchType: "active",
        });

        queryClient.invalidateQueries({
          queryKey: ["mealList"],
          refetchType: "active",
        });
        queryClient.invalidateQueries({
          queryKey: ["meal-get-by-supplier-id"],
          exact: false,
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
    onError: (err: any) => {
      addToaster({
        title: err.message,
        color: "danger",
      });
    },
  });
  return { editMeal, isEditing };
}

export function useChangeStatusMeal(
  pageNumber: number,
  pageSize: number,
  searchField?: string,
  searchValue?: string,
  sortField?: SortField,
  sortType?: SortType
) {
  const queryClient = useQueryClient();
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1519);

  const { mutate: changeStatus, isPending: isChanging } = useGuardedMutation({
    mutationFn: (meal: MealResponse) => mealChangeStatusApi(meal.MealId),
    enabled: hasRequiredService,
    onSuccess: (data, variables) => {
      if (data.ResponseCode === 100) {
        addToaster({
          title: data.ResponseMessage,
          color: "success",
        });

        queryClient.setQueryData(
          [
            "mealList",
            pageNumber,
            pageSize,
            searchField,
            searchValue,
            sortField,
            sortType,
          ],
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              Data: {
                ...oldData.Data,
                Items: oldData.Data.Items.map((item: MealResponse) =>
                  item.MealId === variables.MealId
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

export function useGetMealBySupplierById(id: number | null) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1525);

  const queryClient = useQueryClient();
  const {
    data: mealBySupplier,
    isLoading: isGettingMeal,
    isError,
  } = useGuardedQuery({
    queryKey: ["meal-get-by-supplier-id", id],
    queryFn: async () => {
      const response = await mealGetBySupplierId(id!);
      queryClient.setQueryData(["meal-get-by-supplier-id", id], response?.Data);
      return response?.Data;
    },
    enabled: id !== null && hasRequiredService,
    retry: false,
  });

  return { mealBySupplier, isGettingMeal, isError };
}

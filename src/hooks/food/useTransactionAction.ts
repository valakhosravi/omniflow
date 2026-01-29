import { useAuth } from "@/packages/auth/hooks/useAuth";
import {
  getBalanceAndChargeApi,
  getBalanceAndChargeForOthersApi,
  getLastTransactionApi,
} from "@/services/food/transactionService";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useGetLastTransaction() {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(5001);

  const { data: lastTransactionData, isLoading: isLoading } = useGuardedQuery({
    queryFn: () => getLastTransactionApi(),
    enabled: hasRequiredService,
    queryKey: ["lastTransaction"],
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });

  return { lastTransactionData, isLoading };
}

export function useGetBalanceAndChargeApi() {
  const { data: lastTransactionData, isLoading: isLoading } = useGuardedQuery({
    queryFn: () => getBalanceAndChargeApi(),
    queryKey: ["GetBalanceAndCharge"],
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: "always",
    staleTime: 0,
    gcTime: 0,
  });

  return { lastTransactionData, isLoading };
}

export function useGetBalanceAndChargeForOthersApi(userId: number) {
  const { data: lastTransactionForOtherData, isLoading: isLoading } =
    useGuardedQuery({
      queryFn: () => getBalanceAndChargeForOthersApi(userId),
      queryKey: ["GetBalanceAndChargeForOthers", userId],
      enabled: userId !== 0,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: "always",
      staleTime: 0,
      gcTime: 0,
    });

  return { lastTransactionForOtherData, isLoading };
}

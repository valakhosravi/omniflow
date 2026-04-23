import { addToaster } from "@/ui/Toaster";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useGuardedQuery<
  TData,
  TError = unknown,
  TQueryKey extends readonly unknown[] = readonly unknown[]
>(
  args: UseQueryOptions<TData, TError, TData, TQueryKey> & {
    queryFn: () => Promise<TData>;
  }
) {
  const { queryFn, ...queryOptions } = args;

  // Wrap the original queryFn with error handling
  const wrappedQueryFn = async () => {
    try {
      return await queryFn();
    } catch (error) {
      const message = getErrorMessage(error);
      if (message) {
        addToaster({ title: message, color: "danger" });
      }
      throw error; // re-throw so React Query knows the query failed
    }
  };

  return useQuery<TData, TError, TData, TQueryKey>({
    ...queryOptions,
    queryFn: wrappedQueryFn,
  });
}

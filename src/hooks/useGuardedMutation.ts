import { addToaster } from "@/ui/Toaster";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

export default function useGuardedMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>({
  mutationFn,
  enabled = true,
  ...options
}: UseMutationOptions<TData, TError, TVariables, TContext> & {
  enabled?: boolean;
  mutationFn: (variables: TVariables) => Promise<TData>;
}): UseMutationResult<TData, TError, TVariables, TContext> {
  const mutation = useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (data: TVariables) => {
      if (!enabled) {
        return Promise.reject(new Error("Permission denied"));
      }
      return mutationFn(data);
    },
    ...options,
  });

  return {
    ...mutation,
    mutate: (data: TVariables, opts?: any) => {
      if (!enabled) {
        addToaster({
          title: "شما دسترسی لازم را ندارید",
          color: "warning",
        });
        return;
      }
      mutation.mutate(data, opts);
    },
  };
}

import { TaskFilter } from "@/constants/task-filter";
import { GetTask } from "@/models/camunda-process/GetNextTask";
import {
  claimTaskByTaskId,
  clearRequestApi,
  completeTask,
  getNextTask,
  getRequestsByInstanceIDsService,
  GetRequestsService,
  getTasksByFilter,
  startProcess,
} from "@/services/process/processService";
import { addToaster } from "@/ui/Toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGuardedQuery } from "../useGuardedQuery";

export function useStartProcess(definitionId: string) {
  const { mutate: startProcessMutation, isPending: isStartingProcess } =
    useMutation({
      mutationFn: (body: any) =>
        startProcess({ defenitionId: definitionId, body }),
      retry: false,
    });
  return { startProcessMutation, isStartingProcess };
}

export function useGetNextTask(id: string | null) {
  return useGuardedQuery<GetTask[]>({
    queryKey: ["getNextTask", id],
    queryFn: () => getNextTask(id as string),
    enabled: !!id, // فقط زمانی اجرا شود که id وجود دارد
    retry: false,
  });
}

export function useCompleteTask() {
  const { mutate: complete, isPending: isCompliting } = useMutation({
    mutationFn: ({ taskId, body }: { taskId: string; body: any }) =>
      completeTask(taskId, body),
    retry: false,
  });
  return { complete, isCompliting };
}

export function useClaimTask() {
  const mutation = useMutation({
    mutationFn: ({ taskId, body }: { taskId: string; body: any }) =>
      claimTaskByTaskId(taskId, body),
    retry: false,
    onError: (error: any) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });
  return mutation;
}

export function useGetUserRequests(pageNumber: number, pageSize: number) {
  const { data: userRequests, isLoading: isGetting } = useGuardedQuery({
    queryKey: ["GetRequests", pageNumber, pageSize],
    queryFn: () => GetRequestsService(pageNumber, pageSize),
    retry: false,
    staleTime: 0, // همیشه داده را "کهنه" در نظر می‌گیرد
    refetchOnMount: true, // با هر بار ورود به صفحه درخواست می‌زند
    refetchOnWindowFocus: false, // از رفرش بی‌مورد جلوگیری می‌کند
  });
  return { userRequests, isGetting };
}

export function useTasksByCandidateGroup(candidateGroup: string | null) {
  return useGuardedQuery({
    queryKey: ["candidateGroup", candidateGroup],
    queryFn: () =>
      getTasksByFilter(TaskFilter.CandidateGroup, candidateGroup as string),
    enabled: !!candidateGroup, // فقط زمانی اجرا شود که id وجود دارد
    retry: false,
  });
}

export function useTasksByAssignee(assignee: string | null) {
  return useGuardedQuery({
    queryKey: ["assignee", assignee],
    queryFn: () => getTasksByFilter(TaskFilter.Assignee, assignee as string),
    enabled: !!assignee, // فقط زمانی اجرا شود که id وجود دارد
    retry: false,
  });
}

export function useGetRequestsByInstanceIds() {
  const mutation = useMutation({
    mutationFn: ({ ids }: { ids: string[] }) =>
      getRequestsByInstanceIDsService(ids, 1, 10),
    retry: false,
    onError: (error: any) => {
      addToaster({
        title: error?.message || "خطایی رخ داده است",
        color: "danger",
      });
    },
  });
  return mutation;
}

export function useClearRequest() {
  const queryClient = useQueryClient();

  const { isPending: isClearing, mutateAsync: clearRequest } = useMutation({
    mutationFn: clearRequestApi,
    onSuccess: (data) => {
      if (data.ResponseCode === 100) {
        queryClient.invalidateQueries({
          queryKey: ["GetRequests"],
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
    onError: (error) => {
      addToaster({
        title: error.message,
        color: "danger",
      });
    },
  });
  return { isClearing, clearRequest };
}

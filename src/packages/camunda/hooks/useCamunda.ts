import {
  useStartProcessMutation,
  useCompleteTaskMutation,
  useClaimTaskMutation,
  useGetTasksByCandidateGroupsQuery,
  useLazyGetTasksByCandidateGroupsQuery,
} from "../api/camundaApi";
import { createCamundaPayload } from "@/utils/process/createCamundaPayload";
import { addToaster } from "@/ui/Toaster";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const useCamunda = () => {
  const router = useRouter();
  const [startProcess, { isLoading: isStartingProcess }] =
    useStartProcessMutation();
  const [completeTask, { isLoading: isCompletingTask }] =
    useCompleteTaskMutation();
  const [claimTask, { isLoading: isClaimingTask }] = useClaimTaskMutation();
  const [getTasksByCandidateGroups, { isLoading: isLoadingTasksByGroups }] =
    useLazyGetTasksByCandidateGroupsQuery();

  const startProcessWithPayload = async (
    definitionId: string,
    data: Record<string, any>
  ) => {
    try {
      const payload = createCamundaPayload(data);
      const result = await startProcess({
        definitionId,
        body: payload,
      }).unwrap();
      // addToaster({
      //   color: "success",
      //   title: "فرآیند با موفقیت شروع شد",
      // });
      return result;
    } catch (error: any) {
      const message = getErrorMessage(error);
      if (message) {
        addToaster({
          color: "danger",
          title: message,
        });
      }
      throw error;
    }
  };

  const completeTaskWithPayload = async (
    taskId: string,
    data: Record<string, any>
  ) => {
    try {
      const payload = createCamundaPayload(data);
      const result = await completeTask({ taskId, body: payload }).unwrap();
      addToaster({
        color: "success",
        title: "وظیفه با موفقیت تکمیل شد",
      });
      return result;
    } catch (error: any) {
      const message = getErrorMessage(error);
      if (message) {
        addToaster({
          color: "danger",
          title: message,
        });
      }
      throw error;
    }
  };

  const claimTaskWithPayload = async (
    taskId: string,
    data: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      // const payload = createCamundaPayload(data);
      const result = await claimTask({
        taskId,
        body: { ...data, ...options },
      }).unwrap();
      addToaster({
        color: "success",
        title: "وظیفه با موفقیت دریافت شد",
      });
      return result;
    } catch (error: any) {
      const message = getErrorMessage(error);
      if (message) {
        addToaster({
          color: "danger",
          title: message,
        });
      }
      throw error;
    }
  };

  const getTasksByCandidateGroupsWithErrorHandling = async (
    candidateGroups: string[]
  ) => {
    try {
      const result = await getTasksByCandidateGroups({
        candidateGroups,
      }).unwrap();
      return result;
    } catch (error: any) {
      const message = getErrorMessage(error);
      if (message) {
        addToaster({
          color: "danger",
          title: message,
        });
      }
      throw error;
    }
  };

  return {
    // Mutations
    startProcessWithPayload,
    completeTaskWithPayload,
    claimTask,
    claimTaskWithPayload,

    // Queries
    getTasksByCandidateGroups: getTasksByCandidateGroupsWithErrorHandling,

    // Loading states
    isStartingProcess,
    isCompletingTask,
    isClaimingTask,
    isLoadingTasksByGroups,
  };
};

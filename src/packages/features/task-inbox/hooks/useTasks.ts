import { TaskFilter } from "@/constants/task-filter";
import {
  useGetTasksByCandidateGroupsQuery,
  useGetTasksByFilterQuery,
} from "@/packages/camunda";
import { useGetRequestsByInstanceIdsMutation } from "../api/RequestApi";
import { useMemo, useEffect } from "react";
import { UserRequestsTaskModel } from "@/models/camunda-process/GetRequestsByInstanceIds";

export default function useTasksByFilter({
  candidateGroup,
  assignee,
  pageNumber,
  pageSize,
  hasSnooze = false,
}: {
  candidateGroup?: string[];
  assignee?: number;
  type?: TaskFilter;
  pageNumber: number;
  pageSize: number;
  hasSnooze?: boolean;
}) {
  // Use different queries based on the filter type
  const candidateGroupQuery = useGetTasksByCandidateGroupsQuery(
    { candidateGroups: candidateGroup ? candidateGroup : [] },
    {
      skip: !candidateGroup,
      refetchOnMountOrArgChange: true,
    }
  );

  const assigneeQuery = useGetTasksByFilterQuery(
    { type: TaskFilter.Assignee, value: assignee?.toString() || "" },
    {
      skip: !assignee,
      refetchOnMountOrArgChange: true,
    }
  );

  // Determine which query result to use
  const { data, isLoading, error } = candidateGroup
    ? candidateGroupQuery
    : assigneeQuery;

  // Extract unique processInstanceIds from tasks
  const processInstanceIds = useMemo(() => {
    if (!data) return [];
    const res = [
      ...new Set(data.map((task: any) => task.processInstanceId as string)),
    ];
    return res as string[];
  }, [data]);

  // Use the mutation to get requests by instance IDs
  const [
    getRequestsByInstanceIds,
    { data: requestsData, isLoading: requestsLoading, error: requestsError },
  ] = useGetRequestsByInstanceIdsMutation();

  // Automatically fetch requests when processInstanceIds change
  useEffect(() => {
    if (processInstanceIds.length > 0) {
      getRequestsByInstanceIds({
        ids: processInstanceIds,
        pageNumber,
        pageSize,
        hasSnooze,
      });
    }
  }, [processInstanceIds, getRequestsByInstanceIds, pageNumber, pageSize]);

  // Merge tasks and requests data
  const mergedTasks = useMemo((): UserRequestsTaskModel[] => {
    if (!data || !requestsData?.Data?.Items) return [];

    const items = requestsData.Data.Items;

    return items.map((item) => {
      const matched = data.find(
        (task: any) => task.processInstanceId === item.InstanceId
      );
      return {
        requestId: item.RequestId,
        processId: item.ProcessId,
        userId: item.UserId,
        personnelId: item.PersonnelId,
        instanceId: item.InstanceId,
        isTerminated: item.IsTerminated,
        terminatedDate: item.TerminatedDate,
        createdDate: item.CreatedDate,
        fullName: item.FullName,
        name: item.Name,
        formName: matched?.taskDefinitionKey ?? "",
        formTitle: matched?.name ?? "",
        taskId: matched?.id ?? "",
        ColorCode: item.ColorCode,
        LabelId: item.LabelId,
        SnoozeId: item.SnoozeId,
        SnoozeDate: item.SnoozeDate,
        processName: item.ProcessName,
        version: item.Version,
      };
    });
  }, [data, requestsData]);

  return {
    tasks: data ?? [],
    isLoading,
    error,
    processInstanceIds,

    requestsData,
    requestsLoading,
    requestsError,
    mergedTasks,
  };
}

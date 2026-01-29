import { useGetCompletedTasksQuery } from "../api/RequestApi";

interface UseCompletedTasksParams {
  pageNumber: number;
  pageSize: number;
  SortColumn?: "RequestId" | "InstanceId" | "IsTerminated" | "PersonnelId" | "TerminatedDate" | "CreatedDate" | "ProcessTypeName" | "StatusName" | "FullName" | "Title" | "TrackingCode" | "LabelId" | "LabelColor" | "LabelName" | "StatusDate" | "IsRead" | "CanBeCanceled";
  SortDirection?: "ASC" | "DESC";
}

export function useCompletedTasks({
  pageNumber = 1,
  pageSize = 5,
  SortColumn,
  SortDirection,
}: UseCompletedTasksParams) {
  const { data, error, isLoading, refetch } = useGetCompletedTasksQuery({
    pageNumber,
    pageSize,
    SortColumn,
    SortDirection,
  }, {
    refetchOnMountOrArgChange: true,
  });

  return {
    completedTasks: data?.Data || [],
    isLoading,
    error,
    refetch,
  };
}

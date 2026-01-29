import { useTaskStore } from "@/store/tasksStore";
import {
  useGetRequestsQuery,
  useSearchRequestsMutation,
  useAddRequestToLabelMutation,
  useGetProcessTypesQuery,
} from "../api/RequestApi";

interface UseRequestsParams {
  pageNumber: number;
  pageSize: number;
  SortColumn?:
    | "RequestId"
    | "InstanceId"
    | "IsTerminated"
    | "PersonnelId"
    | "TerminatedDate"
    | "CreatedDate"
    | "ProcessTypeName"
    | "StatusName"
    | "FullName"
    | "Title"
    | "TrackingCode"
    | "LabelId"
    | "LabelColor"
    | "LabelName"
    | "StatusDate"
    | "IsRead"
    | "CanBeCanceled";
  SortDirection?: "ASC" | "DESC";
  // Add any other filter properties that might come from appliedFilters
  [key: string]: any; // This allows additional properties from appliedFilters
}

interface AddRequestToLabelParams {
  LabelId: number;
  RequestId: number;
}

export const useRequests = ({
  pageNumber = 1,
  pageSize = 5,
  SortColumn,
  SortDirection,
}: UseRequestsParams) => {
  const { appliedFilters } = useTaskStore();
  const { data, error, isLoading, refetch, isFetching, isError } =
    useGetRequestsQuery({
      pageNumber,
      pageSize,
      SortColumn,
      SortDirection,
      ...appliedFilters,
    }, {
      refetchOnMountOrArgChange: true,
    });

  const [searchRequests, { isLoading: isSearching }] =
    useSearchRequestsMutation();

  const [addRequestToLabel, { isLoading: isAddingToLabel }] =
    useAddRequestToLabelMutation();

  // const { data: processTypes, isLoading: isGetting } =
  //   useGetProcessTypesQuery();

  return {
    requests: data,
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
    searchRequests,
    isSearching,
    addRequestToLabel,
    isAddingToLabel,
    // processTypes,
    // isGetting,
  };
};

export const useProcessTypes = () => {
  const { data, error, isLoading } = useGetProcessTypesQuery();

  return {
    processTypes: data,
    error,
    isLoading,
  };
};

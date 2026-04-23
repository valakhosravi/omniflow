import { useGetTasksByCandidateGroupsQuery } from "@/packages/camunda/api/camundaApi";
import { useCamunda } from "@/packages/camunda/hooks/useCamunda";

/**
 * Custom hook for getting tasks by candidate groups
 * Provides both RTK Query and custom hook methods
 */
export function useGetTasksByCandidateGroups(candidateGroups: string[], options?: {
  skip?: boolean;
  refetchOnFocus?: boolean;
}) {
  // Method 1: Using RTK Query directly
  const rtkQueryResult = useGetTasksByCandidateGroupsQuery(
    { candidateGroups },
    {
      skip: options?.skip || candidateGroups.length === 0,
      refetchOnFocus: options?.refetchOnFocus ?? false,
    }
  );

  // Method 2: Using custom hook with error handling
  const { getTasksByCandidateGroups, isLoadingTasksByGroups } = useCamunda();

  const getTasksWithErrorHandling = async () => {
    try {
      return await getTasksByCandidateGroups(candidateGroups);
    } catch (error) {
      console.error("Error getting tasks by candidate groups:", error);
      throw error;
    }
  };

  return {
    // RTK Query results
    ...rtkQueryResult,
    
    // Custom hook method
    getTasksWithErrorHandling,
    isLoadingTasksByGroups,
    
    // Combined loading state
    isLoading: rtkQueryResult.isLoading || isLoadingTasksByGroups,
  };
}

export default useGetTasksByCandidateGroups;

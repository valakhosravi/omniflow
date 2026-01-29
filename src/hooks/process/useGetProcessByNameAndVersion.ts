import { useGetLastProcessByNameQuery } from "@/packages/features/task-inbox/api/RequestApi";

/**
 * Hook to get the last process information by name
 * @param processName - The name of the process
 * @param options - Additional query options (skip, refetch, etc.)
 */
export function useGetProcessByNameAndVersion(
  processName: string,
  version?: string, // Version parameter is kept for backward compatibility but not used
  options?: { skip?: boolean }
) {
  return useGetLastProcessByNameQuery(processName, {
    refetchOnMountOrArgChange: true,
    skip: options?.skip,
  });
}

export default useGetProcessByNameAndVersion;

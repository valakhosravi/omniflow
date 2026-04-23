import { useGetLastProcessByNameQuery } from "@/services/commonApi/commonApi";

/**
 * Hook to get the last process information by name
 * @param processName - The name of the process
 * @param options - Additional query options (skip, refetch, etc.)
 */
export function useGetLastProcessByName(
  processName: string,
  // version?: string,
  options?: { skip?: boolean },
) {
  return useGetLastProcessByNameQuery(processName, {
    refetchOnMountOrArgChange: true,
    skip: options?.skip,
  });
}

export default useGetLastProcessByName;

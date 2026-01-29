import { useAuth } from "@/packages/auth/hooks/useAuth";
import { searchApi, searchUrlApi } from "@/services/search/search";
import { useMutation, useQuery } from "@tanstack/react-query";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useSearch() {
  const { mutate: search, isPending: isSearching } = useMutation({
    mutationFn: searchApi,
  });
  return { search, isSearching };
}

export function useSearchUrl(url: string) {
  const { userDetail } = useAuth();
  const { data: searchUrl, isLoading: isSearching } = useQuery({
    queryKey: ["searchUrl", url],
    queryFn: async () => {
      try {
        return await searchUrlApi(url);
      } catch (error) {
        // Silently handle errors - don't show error messages for bookmark API
        return null;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
    enabled: !!userDetail && !!url,
  });
  return { searchUrl, isSearching };
}

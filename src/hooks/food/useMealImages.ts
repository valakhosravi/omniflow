import fetchImageFileService from "@/services/food/fileManagerService";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export function useFetchImageFile(bucketName: string, path: string) {
  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(2502);

  const { data: downloadImage, isLoading: isDownloading } = useGuardedQuery({
    queryKey: ["downloadImage", bucketName, path],
    queryFn: () => fetchImageFileService(bucketName, path),
    enabled: hasRequiredService,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: 5 * 60 * 1000,
  });
  return { downloadImage, isDownloading };
}

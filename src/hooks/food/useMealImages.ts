import { useState, useRef, useCallback, useEffect } from "react";
import { Meal } from "@/models/food/plan/PlanEdit";
import fetchImageFile from "@/components/food/FetchImageFile";
import fetchImageFileService from "@/services/food/fileManagerService";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useGuardedQuery } from "../useGuardedQuery";

const DEFAULT_STALE_TIME = 2 * 60 * 1000;

export default function useMealImages() {
  const mealImagesRef = useRef<Map<number, string>>(new Map());
  const pendingFetchesRef = useRef<Map<number, Promise<Blob | null>>>(
    new Map()
  );
  const [, forceRerender] = useState<number>(0); // dummy state to force update when images added

  const fetchImage = useCallback(async (meal: Meal) => {
    if (pendingFetchesRef.current.has(meal.MealId)) {
      return pendingFetchesRef.current.get(meal.MealId);
    }

    if (mealImagesRef.current.has(meal.MealId)) {
      return null; // already cached
    }

    const fetchPromise = new Promise<Blob | null>(async (resolve) => {
      try {
        const file = await fetchImageFile("food", meal.ImageAddress);
        if (file) {
          const url = URL.createObjectURL(file);
          mealImagesRef.current.set(meal.MealId, url);
          forceRerender((v) => v + 1); // trigger rerender to update UI
        }
        resolve(file);
      } catch (error) {
        console.error(`Error fetching image for ${meal.MealName}:`, error);
        resolve(null);
      }
    });

    pendingFetchesRef.current.set(meal.MealId, fetchPromise);

    await fetchPromise;
    pendingFetchesRef.current.delete(meal.MealId);

    return fetchPromise;
  }, []);

  // Cleanup created URLs on unmount
  useEffect(() => {
    return () => {
      mealImagesRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return {
    mealImages: mealImagesRef.current,
    fetchImage,
  };
}

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

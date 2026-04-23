import { useFavoriteStore } from "@/store/BookmarkStore";
import {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useSearchURLQuery,
} from "@/features/homePage/homePage.services";

export function useBookmark(urlValue: string) {
  const { data: searchUrl, isLoading: isSearching } = useSearchURLQuery(
    urlValue,
    { skip: !urlValue },
  );
  const [createFavorite, { isLoading: isCreating }] =
    useCreateFavoriteMutation();
  const [deleteFavorite, { isLoading: isDeleting }] =
    useDeleteFavoriteMutation();

  const favorites = useFavoriteStore((state) => state.favorites);
  const favoriteCount = useFavoriteStore((state) => state.count);

  const menuId = searchUrl?.Data?.MenuId;
  const isBookmarked = favorites.some((fav) => fav.MenuId === menuId);

  const handleToggleBookmark = () => {
    if (!menuId) return;

    const favorite = favorites.find((fav) => fav.MenuId === menuId);
    if (favorite) {
      deleteFavorite(favorite.FavoriteId);
    } else {
      if (searchUrl.Data?.Ordering)
        createFavorite({
          MenuId: menuId,
          Ordering: searchUrl?.Data?.Ordering,
          ColorCode: "#fff",
        });
    }
  };

  return {
    searchUrl,
    isSearching,
    isBookmarked,
    isCreating,
    isDeleting,
    favoriteCount,
    handleToggleBookmark,
  };
}

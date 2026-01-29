import { useFavoriteStore } from "@/store/BookmarkStore";
import {
  useCreateFavorite,
  useDeleteFavorite,
} from "../search/useFavoriteAction";
import { useSearchUrl } from "../search/useSearchAction";

export function useBookmark(urlValue: string) {
  const { searchUrl, isSearching } = useSearchUrl(urlValue);
  const { createFavorite, isCreating } = useCreateFavorite();
  const { deleteFavorite, isDeleting } = useDeleteFavorite();

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

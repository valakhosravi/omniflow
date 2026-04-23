"use client";

import ReservationPanel from "@/components/food/reservation/ReservationPanel";
import {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useSearchURLQuery,
} from "@/features/homePage/homePage.services";
import { useFavoriteStore } from "@/store/BookmarkStore";
import { Icon } from "@/ui/Icon";
import { useState } from "react";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "رزرو غذا", Href: "/food/reservation" },
];

export default function Reservation() {
  const [urlValue] = useState(() => window.location.href);

  const { data: searchUrl } = useSearchURLQuery(urlValue, { skip: !urlValue });
  const [createFavorite] = useCreateFavoriteMutation();
  const favoriteCount = useFavoriteStore((state) => state.count);
  const favorites = useFavoriteStore((state) => state.favorites);
  const isBookmarked = favorites.some(
    (fav) => fav.MenuId === searchUrl?.Data?.MenuId,
  );
  const [deleteFavorite] = useDeleteFavoriteMutation();

  const handleToggleBookmark = () => {
    const menuId = searchUrl?.Data?.MenuId;
    const favorite = favorites.find((fav) => fav.MenuId === menuId);

    if (!menuId) return;

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

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-x-3 py-[18.5px]">
          {favoriteCount < 9 && (
            <Icon
              name="star"
              className={`cursor-pointer 
                transition-colors ease-in-out duration-300 ${
                  isBookmarked
                    ? "fill-rate stroke-rate"
                    : "stroke-secondary-300 hover:stroke-rate fill-white hover:fill-rate"
                }`}
              onClick={handleToggleBookmark}
            />
          )}
          <h1 className="font-semibold text-xl/[28px] text-secondary-950">
            رزرو غذا
          </h1>
        </div>
      </div>
      <ReservationPanel />
    </>
  );
}

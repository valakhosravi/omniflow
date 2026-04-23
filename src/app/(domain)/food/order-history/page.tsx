"use client";

import { useState, useEffect } from "react";
import { useGetOrderHistoryQuery } from "@/packages/features/food/api/orderHistoryApi";
import { createFeedbackApi } from "@/services/food/FeedbackService";
import { useFavoriteStore } from "@/store/BookmarkStore";
import TableTop from "@/components/TableTop";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";

import BookmarkIcon from "@/ui/BookmarkIcon";
import { formatPersianDate } from "@/utils/formatPersianDate";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { isPastOrYesterday } from "@/utils/isPastOrYesterday";

import Loading from "@/ui/Loading";
import {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useSearchURLQuery,
} from "@/features/homePage/homePage.services";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "تاریخچه سفارشات", Href: "/food/order-history" },
];

export default function OrderHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ratingLoadingId, setRatingLoadingId] = useState<number | null>(null);
  const [urlValue, setUrlValue] = useState("");

  useEffect(() => {
    setUrlValue(window.location.href);
  }, []);

  const { data: searchUrl } = useSearchURLQuery(urlValue, { skip: !urlValue });
  const [createFavorite] = useCreateFavoriteMutation();
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

  const {
    data: orderHistoryData,
    isLoading,
    error,
    refetch,
  } = useGetOrderHistoryQuery({
    pageNumber: currentPage,
    pageSize: pageSize,
  });

  const orderHistoryItems = orderHistoryData?.Data?.Orders || [];

  // Calculate pagination info
  const totalCount = orderHistoryData?.Data?.TotalCount || 0; // Note: API doesn't return total count, using current items count
  const totalPages = Math.ceil(totalCount / pageSize);

  const headers = [
    {
      key: "index",
      title: "ردیف",
    },
    {
      key: "MealName",
      title: "نام غذا",
    },
    {
      key: "SupplierName",
      title: "تأمین کننده",
    },
    {
      key: "SelfName",
      title: "سالن",
    },
    {
      key: "OrderCount",
      title: "تعداد سفارش",
    },
    {
      key: "Price",
      title: "قیمت",
      render: (value: number) => `${formatNumberWithCommas(value)} تومان`,
    },
    {
      key: "MealDate",
      title: "تاریخ غذا",
      render: (value: string) => formatPersianDate(value),
    },
    {
      key: "Rating",
      title: "امتیاز",
      render: (value: number, row: any) => {
        const canRate = isPastOrYesterday(row.MealDate);
        const isLoading = ratingLoadingId === row.DailyMealId;

        const handleStarClick = async (rating: number) => {
          if (isLoading || !canRate) return;

          setRatingLoadingId(row.DailyMealId);
          try {
            await createFeedbackApi({
              MealId: row.MealId,
              DailyMealId: row.DailyMealId,
              Message: "", // Empty message for rating only
              Rating: rating,
            });
            // Success - refresh the table
            refetch();
          } catch (error) {
            console.error("Failed to submit rating:", error);
            // You can add a toast notification here
          } finally {
            setRatingLoadingId(null);
          }
        };

        const stars = [];
        for (let i = 5; i > 0; i -= 1) {
          stars.push(
            <span
              key={i}
              className={`text-lg transition-transform ${
                canRate && !isLoading
                  ? "cursor-pointer hover:scale-110"
                  : "cursor-not-allowed opacity-50"
              } ${i <= value ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => handleStarClick(i)}
              title={
                isLoading
                  ? "در حال ارسال..."
                  : canRate
                    ? `امتیاز ${i}`
                    : "امکان امتیازدهی فقط برای غذاهای دیروز و قبل‌تر"
              }
            >
              ★
            </span>,
          );
        }

        return (
          <div className="flex items-center gap-1 justify-center h-[28px]">
            {isLoading ? (
              //   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <Loading size="sm" />
            ) : (
              stars
            )}
          </div>
        );
      },
    },
    {
      key: "IsOpen",
      title: "وضعیت",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value ? "باز" : "ثبت شده"}
        </span>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (error) {
    return (
      <>
        <AppBreadcrumb items={breadcrumbs} />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">خطا در بارگذاری اطلاعات</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />

      <div className="flex justify-between items-center mt-[18.5px] mb-10">
        <div className="flex items-center gap-3">
          <BookmarkIcon
            isBookmarked={isBookmarked}
            onClick={handleToggleBookmark}
          />
          <h1 className="font-semibold text-[20px] text-secondary-950">
            تاریخچه سفارشات
          </h1>
        </div>
      </div>

      <TableTop
        headers={headers}
        rows={orderHistoryItems}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}

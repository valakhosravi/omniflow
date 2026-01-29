"use client";

import { DailyMealDetails } from "@/models/food/order/OrderById";
import moment from "moment-jalaali";
import { calculateOrderSummary } from "@/utils/calculateMealDiscounts";

moment.loadPersian({ dialect: "persian-modern" });

interface WeeklyReservationsProps {
  reservations: DailyMealDetails[];
  mealDiscounts?: Map<string, any>;
}

export default function WeeklyReservations({
  reservations,
  mealDiscounts,
}: WeeklyReservationsProps) {
  // Use provided mealDiscounts or calculate them
  const { mealDiscounts: calculatedDiscounts } =
    calculateOrderSummary(reservations);
  const discounts = mealDiscounts || calculatedDiscounts;

  // Group reservations by date for UI display
  const groupedReservations = reservations.reduce((acc, reservation) => {
    const date = reservation.MealDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reservation);
    return acc;
  }, {} as Record<string, DailyMealDetails[]>);

  // Sort dates chronologically
  const sortedDates = Object.keys(groupedReservations).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="bg-secondary-0 rounded-xl shadow-sm border border-secondary-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-md font-semibold text-secondary-700">
          جزئیات سفارش
        </h2>
      </div>

      {/* Grouped Reservations by Date */}
      <div className="space-y-8">
        {sortedDates.map((date) => {
          const dayReservations = groupedReservations[date];
          // Calculate total count for this day
          const totalCountForDay = dayReservations.reduce(
            (sum, reservation) => sum + reservation.Count,
            0
          );

          return (
            <div key={date} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-secondary-200">
                <span className="text-lg font-semibold text-secondary-800">
                  {moment(date).format("dddd")}
                </span>
                <span className="text-secondary-600 text-sm">
                  {new Date(date).toLocaleDateString("fa-IR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
                {dayReservations.length > 0 && (
                  <span className="text-secondary-500 text-sm">
                    - {dayReservations[0].SelfName}
                  </span>
                )}
                <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded-full">
                  {totalCountForDay} وعده
                </span>
              </div>

              {/* Meals for this date */}
              <div className="space-y-4">
                {dayReservations.map((reservation, index) => {
                  const mealKey =
                    reservation.MealDate +
                    reservation.MealName +
                    reservation.SupplierName;
                  const discountInfo = discounts.get(mealKey);

                  if (!discountInfo) {
                    return null; // Skip if no discount info found
                  }

                  // Calculate pricing breakdown
                  const discountedItems = discountInfo.discountedCount;
                  const regularItems =
                    discountInfo.totalCount - discountedItems;
                  const discountedTotal =
                    discountInfo.finalPrice * discountedItems;
                  const regularTotal =
                    discountInfo.originalPrice * regularItems;
                  const totalPrice = discountedTotal + regularTotal;
                  const originalTotal =
                    discountInfo.originalPrice * discountInfo.totalCount;
                  const totalDiscount = originalTotal - totalPrice;

                  return (
                    <div
                      key={`${date}-${index}`}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      {/* Meal Details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-secondary-950">
                            {reservation.MealName}
                            <span className="text-secondary-600 text-sm">
                              {" "}
                              ({reservation.SupplierName})
                            </span>
                          </h3>
                          <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded-full">
                            {reservation.Count} عدد
                          </span>
                        </div>
                      </div>

                      {/* Pricing Breakdown */}
                      <div className="space-y-2">
                        {/* Show breakdown if there are both discounted and regular items */}
                        {discountedItems > 0 && regularItems > 0 && (
                          <div className="text-xs text-secondary-600 space-y-1">
                            <div className="flex justify-between">
                              <span>با تخفیف ({discountedItems} عدد):</span>
                              <span>
                                {discountedTotal.toLocaleString()} تومان
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>بدون تخفیف ({regularItems} عدد):</span>
                              <span>{regularTotal.toLocaleString()} تومان</span>
                            </div>
                          </div>
                        )}

                        {/* Main Pricing */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            {totalDiscount > 0 && (
                              <span className="text-secondary-500 line-through">
                                {originalTotal.toLocaleString()} تومان
                              </span>
                            )}
                            {totalDiscount > 0 && (
                              <span className="text-green-600">
                                {totalDiscount.toLocaleString()} تومان سهم شرکت
                              </span>
                            )}
                            {!discountInfo.isFree && (
                              <span
                                className={`font-medium ${
                                  discountInfo.isFree &&
                                  discountedItems === discountInfo.totalCount
                                    ? "text-green-600"
                                    : "text-secondary-950"
                                }`}
                              >
                                {`${totalPrice.toLocaleString()} تومان`}
                              </span>
                            )}
                          </div>

                          {/* Tag */}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              discountInfo.isFree &&
                              discountedItems === discountInfo.totalCount
                                ? "bg-green-100 text-green-700"
                                : totalDiscount > 0
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {discountInfo.isFree &&
                            discountedItems === discountInfo.totalCount
                              ? "رایگان"
                              : totalDiscount > 0
                              ? "تخفیف دار"
                              : "عادی"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

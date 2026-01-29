import { DailyMealDetails } from "@/models/food/order/OrderById";

export interface MealDiscountInfo {
  originalPrice: number;
  discount: number;
  finalPrice: number;
  isMostExpensive: boolean;
  isFree: boolean;
  discountedCount: number; // How many items get the discount
  totalCount: number; // Total count of this meal
}

export interface OrderSummaryData {
  subtotal: number;
  employeeDiscount: number;
  total: number;
  totalMeals: number;
}

/**
 * Get the most expensive meal for each day
 */
export const getMostExpensiveMealPerDay = (reservations: DailyMealDetails[]): Set<string> => {
  const groupedByDate = reservations.reduce((acc, reservation) => {
    const date = reservation.MealDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reservation);
    return acc;
  }, {} as Record<string, DailyMealDetails[]>);

  const mostExpensivePerDay = Object.values(groupedByDate).map(
    (dayReservations) => {
      return dayReservations.reduce((max, current) =>
        current.Price > max.Price ? current : max
      );
    }
  );

  return new Set(
    mostExpensivePerDay.map(
      (meal) => meal.MealDate + meal.MealName + meal.SupplierName
    )
  );
};

/**
 * Calculate discount for a single meal
 */
export const calculateMealDiscount = (
  reservation: DailyMealDetails,
  mostExpensiveMeals: Set<string>
): MealDiscountInfo => {
  const mealKey = reservation.MealDate + reservation.MealName + reservation.SupplierName;
  const isMostExpensive = mostExpensiveMeals.has(mealKey);
  
  let discount = 0;
  let discountedCount = 0;
  
  if (isMostExpensive) {
    const maxDiscount = 150000;
    discount = reservation.Price > maxDiscount ? maxDiscount : reservation.Price;
    discountedCount = 1; // Only 1 item gets the discount
  }
  
  const finalPrice = Math.max(0, reservation.Price - discount);
  const isFree = finalPrice === 0;

  return {
    originalPrice: reservation.Price,
    discount,
    finalPrice,
    isMostExpensive,
    isFree,
    discountedCount,
    totalCount: reservation.Count,
  };
};

/**
 * Calculate order summary with discounts
 */
export const calculateOrderSummary = (reservations: DailyMealDetails[]): {
  summary: OrderSummaryData;
  mealDiscounts: Map<string, MealDiscountInfo>;
} => {
  const mostExpensiveMeals = getMostExpensiveMealPerDay(reservations);
  const mealDiscounts = new Map<string, MealDiscountInfo>();

  // Calculate discount info for each meal
  reservations.forEach((reservation) => {
    const mealKey = reservation.MealDate + reservation.MealName + reservation.SupplierName;
    const discountInfo = calculateMealDiscount(reservation, mostExpensiveMeals);
    mealDiscounts.set(mealKey, discountInfo);
  });

  // Calculate totals
  const subtotal = reservations.reduce((sum, meal) => sum + (meal.Price * meal.Count), 0);
  const totalDiscount = Array.from(mealDiscounts.values()).reduce(
    (sum, info) => sum + (info.discount * info.discountedCount),
    0
  );
  const total = Array.from(mealDiscounts.values()).reduce(
    (sum, info) => {
      const discountedTotal = info.finalPrice * info.discountedCount;
      const regularTotal = info.originalPrice * (info.totalCount - info.discountedCount);
      return sum + discountedTotal + regularTotal;
    },
    0
  );

  const summary: OrderSummaryData = {
    subtotal,
    employeeDiscount: totalDiscount,
    total,
    totalMeals: reservations.reduce((sum, meal) => sum + meal.Count, 0),
  };

  return { summary, mealDiscounts };
};

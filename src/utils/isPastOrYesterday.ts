import dayjs from "dayjs";

/**
 * Checks if the given meal date is from yesterday or past
 * @param mealDate - The meal date string (ISO format)
 * @returns true if the meal date is from yesterday or past, false otherwise
 */
export function isPastOrYesterday(mealDate: string): boolean {
  const mealDateObj = dayjs(mealDate);
  const yesterday = dayjs().subtract(1, 'day');
  
  // Check if meal date is yesterday or before
  return mealDateObj.isBefore(yesterday, 'day') || mealDateObj.isSame(yesterday, 'day');
}

import {
  useLazyGetMealOrderByPlanIdQuery,
  useLazyGetOrderByPlanIdQuery,
} from "../api/reportApi";

export const useReports = () => {
  const [
    getOrderByPlanId,
    { data: orderData, error: orderError, isFetching: orderFetching },
  ] = useLazyGetOrderByPlanIdQuery();
  const [
    getMealOrderByPlanId,
    { data: mealOrderData, error: mealOrderError, isFetching: mealOrderFetching },
  ] = useLazyGetMealOrderByPlanIdQuery();

  return {
    getOrderByPlanId,
    orderData,
    orderError,
    orderFetching,
    getMealOrderByPlanId,
    mealOrderData,
    mealOrderError,
    mealOrderFetching,
  };
};

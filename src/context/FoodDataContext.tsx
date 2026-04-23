"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { mealGetBySupplierId } from "@/services/food/mealService";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import PaginatedResponse from "@/models/food/paginated-response/paginated-response";
import SupplierModel from "@/models/food/supplier/supplier";

interface FoodDataContextType {
  supplierList: { id: number; name: string }[];
  mealData: Record<number, any>;
  mealsideData: Record<number, any>;
  loadFoodData: (
    supplierData?: GeneralResponse<PaginatedResponse<SupplierModel[]>>,
  ) => Promise<void>;
  isLoaded: boolean;
  isLoading: boolean;
}

interface Meal {
  MealId: number;
  MealType: number;
}

const defaultFoodData: FoodDataContextType = {
  supplierList: [],
  mealData: {},
  mealsideData: {},
  loadFoodData: async () => {},
  isLoaded: false,
  isLoading: false,
};

const FoodDataContext = createContext<FoodDataContextType>(defaultFoodData);

export function FoodDataProvider({ children }: { children: React.ReactNode }) {
  const [supplierList, setSupplierList] = useState<
    { id: number; name: string }[]
  >([]);
  const [mealData, setMealData] = useState({});
  const [mealsideData, setMealsideData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadingRef = useRef(false);

  const loadFoodData = useCallback(
    async (
      supplierData?: GeneralResponse<PaginatedResponse<SupplierModel[]>>,
    ) => {
      // Prevent multiple simultaneous calls
      if (loadingRef.current || isLoaded) return;

      // Check if supplier data is available
      if (!supplierData?.Data?.Items || supplierData.Data.Items.length === 0) {
        return;
      }

      loadingRef.current = true;
      setIsLoading(true);

      try {
        // Set supplier list
        const suppliers = supplierData.Data.Items.map((supplier) => ({
          id: supplier.SupplierId,
          name: supplier.Name,
        }));
        setSupplierList(suppliers);

        // Fetch meals for all suppliers
        const mealPromises = supplierData.Data.Items.map(async (supplier) => {
          try {
            const res = await mealGetBySupplierId(supplier.SupplierId);
            return {
              supplierId: supplier.SupplierId,
              meals: res?.Data || [],
            };
          } catch (error) {
            console.error(
              `Error fetching meals for supplier ${supplier.SupplierId}:`,
              error,
            );
            return {
              supplierId: supplier.SupplierId,
              meals: [],
            };
          }
        });

        const mealsResults = await Promise.all(mealPromises);

        // Process meal data
        const mealDataObj: Record<number, any> = {};
        const mealsideDataObj: Record<number, any> = {};

        mealsResults.forEach(({ supplierId, meals }) => {
          if (!meals || meals.length === 0) {
            mealDataObj[supplierId] = {};
            mealsideDataObj[supplierId] = {};
            return;
          }

          mealDataObj[supplierId] = {};
          mealsideDataObj[supplierId] = {};

          meals.forEach((meal: Meal) => {
            if (meal.MealType === 1) {
              mealDataObj[supplierId][meal.MealId] = meal;
            } else {
              mealsideDataObj[supplierId][meal.MealId] = meal;
            }
          });
        });

        setMealData(mealDataObj);
        setMealsideData(mealsideDataObj);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading food data:", error);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    },
    [isLoaded],
  );

  // useEffect(() => {
  //   if (supplierData?.Data?.Items && !isLoading && !isLoaded) {
  //     loadFoodData();
  //   }
  // }, [supplierData, loadFoodData, isLoading, isLoaded]);

  const contextValue = useMemo(
    () => ({
      supplierList,
      mealData,
      mealsideData,
      loadFoodData,
      isLoading,
      isLoaded,
    }),
    [supplierList, mealData, mealsideData, loadFoodData, isLoading, isLoaded],
  );

  return (
    <FoodDataContext.Provider value={contextValue}>
      {children}
    </FoodDataContext.Provider>
  );
}

export function useFoodData() {
  return useContext(FoodDataContext);
}

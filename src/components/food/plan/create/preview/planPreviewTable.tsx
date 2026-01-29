import { usePlanContext } from "@/context/EditPlanDataContext";
import { useFoodData } from "@/context/FoodDataContext";
import { useCreatePlan, useEditPlan } from "@/hooks/food/usePlanAction";
import { useGetSupplierList } from "@/hooks/food/useSupplierAction";
import { usePlanStore } from "@/store/planStore";
import CustomButton from "@/ui/Button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  TableColumnProps,
} from "@/ui/NextUi";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect } from "react";

interface DayData {
  rows: {
    id: number;
    mealDate: string;
    selections: {
      food: number[];
      appetizer: number[];
      dessert: number[];
      drink: number[];
    };
  }[];
}

type MealItem = {
  id: number;
  name?: string;
  Supplier?: {
    name?: string;
  };
  SupplierId?: number;
};

export default function PlanPreviewTable() {
  const { weekTabs, weeklyData, meta } = usePlanStore();

  const { mealData, mealsideData, supplierList, loadFoodData, isLoaded } =
    useFoodData();
  const { editIdData, setEditIdData } = usePlanContext();
  const { supplierData, isSupplierLoading } = useGetSupplierList(1, 6);

  useEffect(() => {
    if (!isLoaded && supplierData && !isSupplierLoading) {
      loadFoodData(supplierData);
    }
  }, [supplierData, isSupplierLoading, isLoaded, loadFoodData]);

  const router = useRouter();

  const transformWeeklyData = (weeklyData: DayData[]) => {
    return weeklyData.map((week) => ({
      rows: week.rows.map((row) => {
        const findMealInData = (mealId: number | null | undefined) => {
          if (mealId === null || mealId === undefined)
            return { id: null, Name: "نامشخص" };

          for (const supplierId in mealData) {
            if (mealData[supplierId] && mealData[supplierId][mealId]) {
              return {
                id: mealId,
                name: mealData[supplierId][mealId].Name || "نامشخص",
                SupplierId: Number(supplierId),
                Supplier: mealData[supplierId][mealId].Supplier,
              };
            }
          }

          return { id: mealId, Name: "نامشخص" };
        };

        const findMealSideInData = (sideId: number | null | undefined) => {
          if (sideId === null || sideId === undefined)
            return { id: null, Name: "نامشخص" };

          for (const supplierId in mealsideData) {
            if (mealsideData[supplierId] && mealsideData[supplierId][sideId]) {
              return {
                id: sideId,
                name: mealsideData[supplierId][sideId].Name || "نامشخص",
                SupplierId: Number(supplierId),
                Supplier: mealsideData[supplierId][sideId].Supplier,
              };
            }
          }

          return { id: sideId, Name: "نامشخص" };
        };

        const foods = Array.isArray(row.selections.food)
          ? row.selections.food.map((id) => findMealInData(id))
          : row.selections.food !== null
          ? [findMealInData(row.selections.food)]
          : [{ id: null, Name: "نامشخص" }];

        const appetizers = Array.isArray(row.selections.appetizer)
          ? row.selections.appetizer.map((id) => findMealSideInData(id))
          : row.selections.appetizer !== null
          ? [findMealSideInData(row.selections.appetizer)]
          : [{ id: null, Name: "نامشخص" }];

        const desserts = Array.isArray(row.selections.dessert)
          ? row.selections.dessert.map((id) => findMealSideInData(id))
          : row.selections.dessert !== null
          ? [findMealSideInData(row.selections.dessert)]
          : [{ id: null, Name: "نامشخص" }];

        const drinks = Array.isArray(row.selections.drink)
          ? row.selections.drink.map((id) => findMealSideInData(id))
          : row.selections.drink !== null
          ? [findMealSideInData(row.selections.drink)]
          : [{ id: null, Name: "نامشخص" }];

        return {
          ...row,
          selections: {
            food: foods,
            appetizer: appetizers,
            dessert: desserts,
            drink: drinks,
          },
          MealDate: row.mealDate,
        };
      }),
    }));
  };

  const transformedData = transformWeeklyData(weeklyData);

  const { createPlan, isCreating } = useCreatePlan();
  const { editData, isEditting } = useEditPlan();

  const handleSubmit = async () => {
    const payload = preparePlanPayload();
    if (editIdData) {
      await editData({ id: editIdData, data: payload });
      setEditIdData(null);
    } else {
      await createPlan(payload);
      setEditIdData(null);
    }
    router.push("/food/plan");
  };

  const handleReview = () => {
    router.push(
      `/food/plan/create?name=${meta.name}&from=${meta.fromDate}&to=${meta.toDate}`
    );
  };

  const preparePlanPayload = () => {
    const dailyMeals = weeklyData.flatMap((day) =>
      day.rows.flatMap((row) => {
        const getMealId = (
          mealSelection: number | number[] | null | undefined
        ) => {
          if (Array.isArray(mealSelection)) {
            return mealSelection.filter(
              (id) => id !== null && id !== undefined
            );
          }
          return mealSelection !== null && mealSelection !== undefined
            ? [mealSelection]
            : [];
        };

        const foodIds = getMealId(row.selections.food);
        const appetizerIds = getMealId(row.selections.appetizer);
        const dessertIds = getMealId(row.selections.dessert);
        const drinkIds = getMealId(row.selections.drink);

        const allMealIds = [
          ...foodIds,
          ...appetizerIds,
          ...dessertIds,
          ...drinkIds,
        ];

        return allMealIds.map((mealId) => ({
          MealId: mealId as number,
          MealDate: row.mealDate,
        }));
      })
    );

    return {
      Name: meta.name,
      FromDate: meta.fromDate,
      ToDate: meta.toDate,
      DailyMeals: dailyMeals,
    };
  };

  const isDayHoliday = (weekIndex: number) => {
    const dayRows = transformedData[weekIndex]?.rows || [];
    return dayRows.every((row) => {
      const sel = row.selections;
      return (
        (!sel.food ||
          sel.food.length === 0 ||
          sel.food.every((item) => item?.id === null)) &&
        (!sel.appetizer ||
          sel.appetizer.length === 0 ||
          sel.appetizer.every((item) => item?.id === null)) &&
        (!sel.dessert ||
          sel.dessert.length === 0 ||
          sel.dessert.every((item) => item?.id === null)) &&
        (!sel.drink ||
          sel.drink.length === 0 ||
          sel.drink.every((item) => item?.id === null))
      );
    });
  };

  const displayMealItems = (
    items: MealItem[],
    weekIndex: number,
    isHoliday: boolean
  ) => {
    // If it's a holiday (nothing selected for entire day), show "تعطیل"
    if (isHoliday) {
      return (
        <Chip
          variant="bordered"
          classNames={{
            base: `border-1 rounded-[24px] text-secondary-200 px-[10px] py-[3px]`,
            content: `font-semibold text-[12px]/[18px] text-secondary-500 text-center p-0 w-[150px]`,
          }}
        >
          تعطیل
        </Chip>
      );
    }

    // If not a holiday but this specific meal type has no items, show empty
    if (
      !items ||
      items.length === 0 ||
      items.every((item) => item?.id === null)
    ) {
      return (
        <Chip
          variant="bordered"
          classNames={{
            base: `border-1 rounded-[24px] text-secondary-200 px-[10px] py-[3px]`,
            content: `font-semibold text-[12px]/[18px] text-secondary-500 text-center p-0 w-[150px]`,
          }}
        >
          انتخاب نشده
        </Chip>
      );
    }

    // Show the meal items
    return items
      .filter((item) => item?.id !== null) // Filter out null items
      .map((item, index) => {
        const supplierName =
          item.Supplier?.name ||
          (item.SupplierId && supplierList[item.SupplierId]?.name) ||
          "";

        return (
          <Chip
            key={item.id ?? index}
            variant="bordered"
            classNames={{
              base: `border-1 rounded-[24px] text-secondary-200 px-[10px] py-[3px] max-w-full`,
              content: `font-semibold text-[12px]/[18px] text-secondary-500 p-0 text-center`,
            }}
          >
            {item.name || "نامشخص"}
            {supplierName && ` (${supplierName})`}
          </Chip>
        );
      });
  };

  const mealTypeMapReversed = {
    food: "غذای اصلی",
    // appetizer: "پیش‌غذا",
    dessert: "دسر",
    drink: "نوشیدنی",
  } as const;

  const mealTypeMap = Object.entries(mealTypeMapReversed) as [
    keyof typeof mealTypeMapReversed,
    string
  ][];

  return (
    <>
      <Table
        aria-label="جدول وعده‌های غذایی"
        shadow="none"
        classNames={{
          tr: "transition-all !border-none",
          td: "py-3 !rounded-none !before:rounded-none border-r-2 border-border-200 first:border-r-0",
          th: "bg-day-title !rounded-none w-[175.75px] h-[44px]",
          thead: "h-auto",
          wrapper: "p-0",
          table:
            "border-separate border-spacing-0 border border-secondary-100 rounded-[12px]",
        }}
      >
        <TableHeader className="font-semibold text-[14px]/[20px]">
          {
            [
              <TableColumn className="w-20" key="default">
                روز
              </TableColumn>,
              ...mealTypeMap.map(([typeId, typeLabel]) => (
                <TableColumn key={typeId}>{typeLabel}</TableColumn>
              )),
            ] as ReactElement<TableColumnProps<unknown>, any>[]
          }
        </TableHeader>

        <TableBody>
          {weekTabs.map((tab, weekIndex) => {
            const isHoliday = isDayHoliday(weekIndex);
            return (
              <TableRow key={tab.key}>
                {(columnKey) => {
                  if (columnKey === "default") {
                    const [dayName, ...dateParts] = tab.title.split(" ");
                    return (
                      <TableCell
                        className="flex flex-col items-center space-y-1 font-semibold
                    text-[14px]/[20px] px-[24px]"
                      >
                        <span className="text-primary-950">{dayName}</span>
                        <span className="text-secondary-300">{dateParts}</span>
                      </TableCell>
                    );
                  }

                  const typeIndex = mealTypeMap.findIndex(
                    ([id]) => id === columnKey
                  );
                  const typeId = mealTypeMap[typeIndex]?.[0];

                  const mealItems = transformedData[weekIndex]?.rows
                    .map((row) => row.selections?.[typeId])
                    .flat() as MealItem[];

                  return (
                    <TableCell>
                      <div
                        className={`grid justify-center items-center gap-x-1.5 
                      gap-y-[5.5px] ${
                        !mealItems || mealItems.length === 0
                          ? ""
                          : "grid-cols-[repeat(2,160px)]"
                      }`}
                      >
                        {displayMealItems(mealItems, weekIndex, isHoliday)}
                      </div>
                    </TableCell>
                  );
                }}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="w-full flex gap-x-2 justify-end mt-10">
        <CustomButton
          buttonVariant="outline"
          buttonSize="md"
          className="font-semibold text-[14px]/[20px]"
          onPress={handleReview}
        >
          بازبینی
        </CustomButton>
        <CustomButton
          type="submit"
          onPress={handleSubmit}
          isLoading={isCreating || isEditting}
          buttonVariant="primary"
          buttonSize="md"
          className="font-semibold text-[14px]/[20px]"
        >
          ثبت نهایی
        </CustomButton>
      </div>
    </>
  );
}

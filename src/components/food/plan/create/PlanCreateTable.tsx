import { useGetSupplierList } from "@/hooks/food/useSupplierAction";
import { MealGetBySupplierIdModel } from "@/models/food/meal/MealGetBySupplierIdModel";
import { mealGetBySupplierId } from "@/services/food/mealService";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/ui/NextUi";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import HolidaySwitch from "./HolidaySwitch";
import { useHolidayGetFromAndTo } from "@/hooks/food/useHolidayAction";

interface PlanCreateTableProps {
  data: { rows: RowType[] };
  onChange: (newData: any) => void;
  date: string;
}

interface GroupedItem {
  label: string;
  value: number;
  supplierId: number;
  supplierName: string;
}

interface RowType {
  id: number;
  selections: {
    food?: number[];
    appetizer?: number[];
    dessert?: number[];
    drink?: number[];
  };
}

export default function PlanCreateTable({
  data,
  onChange,
  date,
}: PlanCreateTableProps) {
  const { supplierData } = useGetSupplierList(1, 6);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const suppliers = supplierData?.Data?.Items || [];

  const rows = data.rows || [];

  const [allOptions, setAllOptions] = useState<{
    meals: GroupedItem[];
    appetizers: GroupedItem[];
    desserts: GroupedItem[];
    drinks: GroupedItem[];
  }>({
    meals: [],
    appetizers: [],
    desserts: [],
    drinks: [],
  });

  const queryClient = useQueryClient();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current || !suppliers.length) return;

    const mealTypes = {
      MainCourse: 1,
      Appetizer: 2,
      Dessert: 3,
      Beverage: 4,
    };

    const fetchAllSupplierOptions = async () => {
      const mealsAll: GroupedItem[] = [];
      const appetizersAll: GroupedItem[] = [];
      const dessertsAll: GroupedItem[] = [];
      const drinksAll: GroupedItem[] = [];

      for (const supplier of suppliers) {
        const supplierId = supplier.SupplierId;
        const supplierName = supplier.Name;

        // Check if data is already cached
        const cachedMeals = queryClient.getQueryData([
          "meal-get-by-supplier-id",
          supplierId,
        ]) as MealGetBySupplierIdModel[] | undefined;

        let meals = cachedMeals;

        if (!meals) {
          const mealResponse = await mealGetBySupplierId(supplierId);
          meals = mealResponse?.Data || [];
          queryClient.setQueryData(
            ["meal-get-by-supplier-id", supplierId],
            meals,
          );
        }

        meals.forEach((meal) => {
          const item = {
            label: meal.Name,
            value: meal.MealId,
            supplierId,
            supplierName,
          };

          if (meal.MealType === mealTypes.MainCourse) {
            mealsAll.push(item);
          } else if (meal.MealType === mealTypes.Appetizer) {
            appetizersAll.push(item);
          } else if (meal.MealType === mealTypes.Dessert) {
            dessertsAll.push(item);
          } else if (meal.MealType === mealTypes.Beverage) {
            drinksAll.push(item);
          }
        });
      }

      setAllOptions({
        meals: mealsAll,
        appetizers: appetizersAll,
        desserts: dessertsAll,
        drinks: drinksAll,
      });
    };

    fetchAllSupplierOptions();
    hasFetchedRef.current = true;
  }, [suppliers, queryClient]);

  const clearAllData = () => {
    const clearedRows = rows.map((row) => ({
      ...row,
      selections: {
        food: [],
        appetizer: [],
        dessert: [],
        drink: [],
      },
    }));

    onChange({ rows: clearedRows });
  };

  const handleRemove = (
    rowId: number,
    field: "food" | "appetizer" | "dessert" | "drink",
    valueToRemove: number,
  ) => {
    const updatedRows = rows.map((row) => {
      if (row.id !== rowId) return row;
      const currentValues = row.selections[field] as number[];
      return {
        ...row,
        selections: {
          ...row.selections,
          [field]: currentValues.filter((val) => val !== valueToRemove),
        },
      };
    });

    onChange({ rows: updatedRows });
  };

  const handleSelectionChange = (
    rowId: number,
    field: "food" | "appetizer" | "dessert" | "drink",
    value: string,
  ) => {
    const newValue = Number(value);
    const updatedRows = rows.map((row) => {
      if (row.id !== rowId) return row;

      const existing = (row.selections[field] as number[]) || [];
      if (!existing.includes(newValue)) {
        return {
          ...row,
          selections: {
            ...row.selections,
            [field]: [...existing, newValue],
          },
        };
      }
      return row;
    });

    onChange({ rows: updatedRows });
  };

  const getGroupedItems = (
    field: "food" | "appetizer" | "dessert" | "drink",
  ) => {
    let items: GroupedItem[] = [];

    switch (field) {
      case "food":
        items = allOptions.meals;
        break;
      case "appetizer":
        items = allOptions.appetizers;
        break;
      case "dessert":
        items = allOptions.desserts;
        break;
      case "drink":
        items = allOptions.drinks;
        break;
    }

    // Group items by supplier
    const groupedBySupplier: Record<
      number,
      { items: GroupedItem[]; name: string }
    > = {};

    items.forEach((item) => {
      if (!groupedBySupplier[item.supplierId]) {
        groupedBySupplier[item.supplierId] = {
          items: [],
          name: item.supplierName,
        };
      }
      groupedBySupplier[item.supplierId].items.push(item);
    });

    return groupedBySupplier;
  };

  const getItemLabel = (
    field: "food" | "appetizer" | "dessert" | "drink",
    value: number,
  ) => {
    let items: GroupedItem[] = [];

    switch (field) {
      case "food":
        items = allOptions.meals;
        break;
      case "appetizer":
        items = allOptions.appetizers;
        break;
      case "dessert":
        items = allOptions.desserts;
        break;
      case "drink":
        items = allOptions.drinks;
        break;
    }

    const item = items.find((item) => item.value === value);
    return item ? `${item.label} (${item.supplierName})` : "";
  };

  const renderChips = (
    rowId: number,
    field: "food" | "appetizer" | "dessert" | "drink",
  ) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return null;

    const selected = (row.selections[field] || []) as number[];

    return (
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {selected.map((val) => {
          const label = getItemLabel(field, val);
          if (!label) return null;

          return (
            <Chip
              key={val}
              variant="bordered"
              classNames={{
                base: `border-1 rounded-[24px] text-secondary-200 px-[10px] py-[3px] max-w-[93px] gap-x-1`,
                content: `font-semibold text-[12px]/[18px] text-secondary-500 p-0`,
                closeButton: `text-secondary-400`,
              }}
              onClose={() => handleRemove(rowId, field, val)}
              // classNames={{
              //   content: `font-medium text-[14px]/[18px]`,
              // }}
            >
              {label}
            </Chip>
          );
        })}
      </div>
    );
  };

  const renderAutocomplete = (
    rowId: number,
    field: "food" | "appetizer" | "dessert" | "drink",
  ) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return null;

    const selected = (row.selections[field] || []) as number[];
    const groupedItems = getGroupedItems(field);

    return (
      <Autocomplete
        aria-label={field}
        selectedKey={null}
        onSelectionChange={(val) =>
          handleSelectionChange(rowId, field, val as string)
        }
        placeholder="انتخاب"
        variant="bordered"
        popoverProps={{
          offset: 10,
          classNames: {
            content: "shadow-none",
          },
        }}
        inputProps={{
          classNames: {
            input: `font-normal text-[12px]/[18px] text-secondary-400`,
            inputWrapper: `px-[8px] py-[6px] border-1 border-secondary-950/[.2] rounded-[8px]`,
            innerWrapper: ``,
          },
        }}
        classNames={{
          base: `text-sm text-secondary-950 bg-white w-[220px]`,
          selectorButton: `text-secondary-400`,
          popoverContent: `border border-default-300`,
        }}
        listboxProps={{}}
      >
        {Object.entries(groupedItems).map(([supplierId, supplier]) => (
          <AutocompleteSection
            key={supplierId}
            title={supplier.name}
            showDivider
          >
            {supplier.items.map((item) => (
              <AutocompleteItem
                key={item.value}
                isReadOnly={selected.includes(item.value)}
              >
                {item.label}
              </AutocompleteItem>
            ))}
          </AutocompleteSection>
        ))}
      </Autocomplete>
    );
  };

  const firstRowId = rows.length > 0 ? rows[0].id : 0;

  const { holidayFromTo } = useHolidayGetFromAndTo({
    from: date,
    to: date,
  });

  const exists = holidayFromTo?.Data?.some((h: any) => h.HolidayDate === date);

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <HolidaySwitch
        date={date}
        holiday={!!exists}
        onDataClear={clearAllData}
      />
      {!exists && (
        <Table
          aria-label="Create plan"
          color="primary"
          classNames={{
            tr: "transition-all hover:bg-header-table even:bg-header-table !border-none",
            td: "py-3 !rounded-none !before:rounded-none",
            th: "bg-day-title !rounded-none w-[175.75px] h-[44px]",
            thead: "h-auto",
            wrapper: "p-0",
            table:
              "border-separate border-spacing-0 border border-secondary-100 rounded-[12px]",
          }}
          shadow="none"
          isStriped
        >
          <TableHeader className="font-semibold text-[14px]/[20px]">
            <TableColumn className="w-[10%] !text-secondary-600">
              انواع غذاها
            </TableColumn>
            <TableColumn className="w-[10%] !text-secondary-600">
              انتخاب غذا ها
            </TableColumn>
            <TableColumn className="w-[70%] !text-secondary-600">
              غذا ها
            </TableColumn>
          </TableHeader>

          <TableBody className="font-medium text-[14px]/[20px]">
            <TableRow>
              <TableCell className="text-secondary-600 font-semibold text-[14px]/[20px]">
                غذا
              </TableCell>
              <TableCell>{renderAutocomplete(firstRowId, "food")}</TableCell>
              <TableCell>{renderChips(firstRowId, "food")}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-secondary-600 font-semibold text-[14px]/[20px]">
                دسر
              </TableCell>
              <TableCell>{renderAutocomplete(firstRowId, "dessert")}</TableCell>
              <TableCell>{renderChips(firstRowId, "dessert")}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-secondary-600 font-semibold text-[14px]/[20px]">
                نوشیدنی
              </TableCell>
              <TableCell>{renderAutocomplete(firstRowId, "drink")}</TableCell>
              <TableCell>{renderChips(firstRowId, "drink")}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}

import {
  useCreateGuestOrder,
  useEditGuestOrder,
} from "@/hooks/food/useGuestReservation";
import { useSelfList } from "@/hooks/food/useSelfAction";
import { Meal } from "@/models/food/plan/PlanEdit";
import SelfModel from "@/models/food/self/SelfModel";
import {
  addRow,
  clearAll,
  MealRow,
  removeRow,
  updateRow,
} from "@/store/guestReservationStore";
import { RootState } from "@/store/store";
import CustomButton from "@/ui/Button";
import { addToaster } from "@/ui/Toaster";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Button,
  NumberInput,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
interface GuestReservationTableProps {
  meals: Meal[] | undefined;
  weekDay: {
    key: string;
    title: string;
    date: string;
  };
}

export default function GuestReservationTable({
  meals,
  weekDay,
}: GuestReservationTableProps) {
  const searchParams = useSearchParams();
  const EditPlanId = searchParams.get("planId");

  const router = useRouter();
  const dispatch = useDispatch();
  const { selfData } = useSelfList(1, 10);
  const { planId, reservationData } = useSelector(
    (state: RootState) => state.GuestReservationData,
  );

  const { createOrder, isCreating } = useCreateGuestOrder();
  const { editOrder } = useEditGuestOrder();

  const handleChange = (
    index: number,
    field: keyof MealRow,
    value: string | number,
  ) => {
    const updatedRow = { ...dayRows[index], [field]: value };
    dispatch(updateRow({ date: weekDay.date, index, row: updatedRow }));
  };

  const dayRows = reservationData[weekDay.date] || [
    { food: "", count: 1, self: "", desc: "" },
  ];

  const handleAddRow = () => {
    dispatch(
      addRow({
        date: weekDay.date,
        row: { food: "", count: 1, self: "", desc: "" },
      }),
    );
  };

  const handleRemoveRow = (index: number) => {
    dispatch(removeRow({ date: weekDay.date, index }));
  };

  const groupedMealsByType = useMemo(() => {
    if (!meals) return { meals: {}, appetizers: {}, desserts: {}, drinks: {} };

    const types: Record<number, string> = {
      1: "meals",
      2: "appetizers",
      3: "desserts",
      4: "drinks",
    };

    const result = {
      meals: {},
      appetizers: {},
      desserts: {},
      drinks: {},
    } as any;

    meals.forEach((m) => {
      const section = types[m.MealType];
      if (!section) return;

      if (!result[section][m.SupplierId]) {
        result[section][m.SupplierId] = {
          supplierName: m.SupplierName,
          items: [],
        };
      }

      result[section][m.SupplierId].items.push({
        label: m.MealName,
        value: m.DailyMealId,
        supplierId: m.SupplierId,
        supplierName: m.SupplierName,
      });
    });

    return result;
  }, [meals]);

  const mealItems = groupedMealsByType.meals;

  const handleReserve = () => {
    if (!planId) return;

    const allRows: MealRow[] = Object.values(reservationData).flat();

    for (const [, rows] of Object.entries(reservationData)) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (Number(row.food) !== 0 || row.food !== "0") {
          if (!row.self || row.count < 1) {
            const dayTitle = weekDay.title;
            addToaster({
              title: `لطفاً فیلدهای سلف و تعداد در روز ${dayTitle} تکمیل شود.`,
              color: "danger",
            });
            return;
          }
        }
      }
    }

    const payload = allRows
      .filter((row) => Number(row.food) !== 0)
      .map((row) => ({
        PlanId: planId,
        Description: row.desc,
        SelfId: Number(row.self) || 0,
        DailyMealId: Number(row.food),
        Count: row.count,
      }));

    if (payload.length === 0) {
      addToaster({
        title: "هیچ غذایی انتخاب نشده است.",
        color: "warning",
      });
      return;
    }

    if (EditPlanId) {
      editOrder(
        { id: Number(EditPlanId), payload },
        {
          onSuccess: () => {
            addToaster({
              title: "رزرو با موفقیت انجام شد.",
              color: "success",
            });
            router.push("/food/guest-food");
            dispatch(clearAll());
          },
          onError: (error) => {
            addToaster({
              title: error.message,
              color: "danger",
            });
          },
        },
      );
    } else {
      createOrder(payload, {
        onSuccess: () => {
          addToaster({
            title: "رزرو با موفقیت انجام شد.",
            color: "success",
          });
          router.push("/food/guest-food");
          dispatch(clearAll());
        },
        onError: (error) => {
          addToaster({
            title: error.message,
            color: "danger",
          });
        },
      });
    }
  };

  const entries = Object.entries(mealItems);

  return (
    <div className="flex flex-col gap-y-4">
      <Table
        aria-label="guest reservation table"
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
          <TableColumn className="w-[5%] !text-secondary-600">
            شماره
          </TableColumn>
          <TableColumn className="w-[20%] !text-secondary-600">غذا</TableColumn>
          <TableColumn className="w-[10%] !text-secondary-600">
            تعداد
          </TableColumn>
          <TableColumn className="w-[20%] !text-secondary-600">سلف</TableColumn>
          <TableColumn className="!text-secondary-600">توضیحات</TableColumn>
          <TableColumn className="w-[10%] !text-secondary-600">
            عملیات
          </TableColumn>
        </TableHeader>
        <TableBody>
          <>
            {dayRows.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <Autocomplete
                      aria-label={"food"}
                      selectedKey={row.food || null}
                      onSelectionChange={(val) =>
                        handleChange(index, "food", val as string)
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
                          input: `font-normal text-[12px]/[18px] text-secondary-950`,
                          inputWrapper: `px-[8px] py-[6px] border-1 border-secondary-950/[.2] rounded-[8px]`,
                          innerWrapper: ``,
                        },
                      }}
                      classNames={{
                        base: `text-sm text-secondary-950 bg-white w-[220px]`,
                        selectorButton: `text-secondary-400`,
                        popoverContent: `border border-default-300`,
                      }}
                    >
                      {Object.entries(mealItems).map(
                        ([supplierId, supplier]: any) => (
                          <AutocompleteSection
                            key={supplierId}
                            title={supplier.supplierName}
                            showDivider={index !== entries.length - 1}
                          >
                            {supplier.items.map((item: any) => (
                              <AutocompleteItem
                                key={item.value}
                                textValue={item.label}
                              >
                                {item.label}
                              </AutocompleteItem>
                            ))}
                          </AutocompleteSection>
                        ),
                      )}
                    </Autocomplete>
                  </TableCell>

                  <TableCell>
                    <NumberInput
                      value={row.count}
                      size="sm"
                      variant="bordered"
                      min={1}
                      minValue={1}
                      defaultValue={1}
                      onChange={(val) => {
                        const newValue =
                          typeof val === "number"
                            ? val
                            : Number(val.currentTarget.value);
                        handleChange(index, "count", newValue);
                      }}
                      classNames={{
                        inputWrapper: `min-h-[10px] h-[40px] border-1 border-secondary-950/[.2] rounded-[8px]`,
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Autocomplete
                      aria-label="selfs"
                      selectedKey={row.self || null}
                      onSelectionChange={(val) =>
                        handleChange(index, "self", val as string)
                      }
                      placeholder="انتخاب سلف"
                      popoverProps={{
                        offset: 10,
                        classNames: { content: "shadow-none" },
                      }}
                      inputProps={{
                        classNames: {
                          input: "font-normal text-[12px] text-secondary-950",
                          inputWrapper:
                            "px-2 py-[6px] border-1 border-secondary-950/20 rounded-[8px] bg-transparent",
                        },
                      }}
                      classNames={{
                        base: "text-sm text-secondary-950 bg-white w-[220px]",
                        selectorButton: "text-secondary-400",
                        popoverContent: "border border-default-300",
                      }}
                    >
                      {(selfData?.Data?.Items ?? []).map((self: SelfModel) => (
                        <AutocompleteItem
                          key={self.SelfId}
                          textValue={self.Name}
                        >
                          {self.Name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </TableCell>

                  <TableCell>
                    <Textarea
                      value={row.desc}
                      isClearable
                      className="max-w-xs"
                      placeholder="توضیحات"
                      variant="bordered"
                      minRows={1}
                      classNames={{
                        inputWrapper: `border-1 border-secondary-300 rounded-[8px]`,
                      }}
                      onChange={(e) =>
                        handleChange(index, "desc", e.currentTarget.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="bordered"
                      isIconOnly
                      color="danger"
                      className="border-1 rounded-[8px]"
                      onPress={() => handleRemoveRow(index)}
                    >
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow>
              <TableCell colSpan={6} className="text-center bg-accent-S-C">
                <button
                  className="text-accent-100 py-1 cursor-pointer"
                  onClick={handleAddRow}
                >
                  + افزودن ردیف
                </button>
              </TableCell>
            </TableRow>
          </>
        </TableBody>
      </Table>
      <CustomButton
        buttonSize="sm"
        className="self-end"
        onPress={handleReserve}
        isLoading={isCreating}
      >
        {EditPlanId ? "ویرایش رزرو" : "ثبت نهایی رزرو"}
      </CustomButton>
    </div>
  );
}

import { mealTypeMap } from "@/models/food/meal/MealTypes";
import OrderById from "@/models/food/order/OrderById";
import addDays from "@/utils/addDay";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableColumnProps,
  TableHeader,
  TableRow,
} from "@/ui/NextUi";
import dayjs from "dayjs";
import jalali from "dayjs-jalali";
import "dayjs/locale/fa";
import { ReactElement } from "react";

dayjs.locale("fa");
dayjs.extend(jalali);

export default function PreviewTable({
  orderDataById,
}: {
  orderDataById?: OrderById;
}) {
  if (!orderDataById) return null;
  const { StartDate, EndDate, DailyMealDetails } = orderDataById;
  const dateMealMap: Record<string, Record<number, string>> = {};
  const dateList: string[] = [];

  let current = StartDate;
  while (new Date(current) <= new Date(EndDate)) {
    const formattedDate = current;

    dateMealMap[formattedDate] = {};
    dateList.push(formattedDate);
    current = addDays(current, 1);
  }

  for (const item of DailyMealDetails || []) {
    const dateKey = dayjs(item.MealDate).toString();

    if (!dateMealMap[dateKey]) {
      dateMealMap[dateKey] = {};
    }
    const supplier = item.SupplierName ? `(${item.SupplierName})` : "";
    dateMealMap[dateKey][item.MealType] = `${item.MealName} ${supplier}`;
  }

  const sortedDates = dateList
    .map((date) => dayjs(date))
    .sort((a, b) => a.toDate().getTime() - b.toDate().getTime());

  const mealTypeMapEntires = Object.entries(mealTypeMap);
  return (
    <Table
      aria-label="جدول برنامه غذایی"
      shadow="none"
      classNames={{
        wrapper: "pb-0",
        base: "border border-default-200 rounded-xl mt-4",
        th: "text-right",
      }}
    >
      <TableHeader>
        {
          [
            <TableColumn key="date">تاریخ</TableColumn>,
            ...mealTypeMapEntires.map(([type, label]) => (
              <TableColumn key={type}>{label}</TableColumn>
            )),
          ] as ReactElement<TableColumnProps<unknown>, any>[]
        }
      </TableHeader>

      <TableBody>
        {sortedDates.map((dateKey) => {
          const formatted = `${dateKey.format("dddd")} ${dateKey.format(
            "D"
          )} ${dateKey.format("MMMM")}`;
          const meals = dateMealMap[dateKey.toString()] || [];

          return (
            <TableRow key={dateKey.toISOString()}>
              {(columnKey) => {
                if (columnKey === "date") {
                  return <TableCell>{formatted}</TableCell>;
                }

                const mealType = Number(columnKey);
                return (
                  <TableCell key={columnKey}>
                    {meals?.[mealType] || "-"}
                  </TableCell>
                );
              }}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

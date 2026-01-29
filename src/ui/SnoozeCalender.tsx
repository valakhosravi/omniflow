import {
  CalendarDate,
  createCalendar,
  parseDate,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { Calendar, DateValue } from "@heroui/react";

interface CalendarModel {
  width?: number;
  cellWidth?: number;
  cellHeight?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SnoozeCalendar({
  width = 312,
  cellWidth = 36,
  cellHeight = 36,
  value,
  onChange,
}: CalendarModel) {
  const dateValue: DateValue | null = value ? parseDate(value) : null;

  return (
    <I18nProvider locale="fa-IR">
      <Calendar
        value={dateValue as any}
        onChange={(val) => {
          if (val) {
            try {
              const dateStr = (val as CalendarDate).toString();
              onChange?.(dateStr);
            } catch (error) {
              console.error("Error formatting date:", error);
            }
          } else {
            onChange?.("");
          }
        }}
        classNames={{
          base: `!bg-white w-[${width}px] !shadow-none`,
          content: `!border-none !bg-white w-[${width}px]`,
          title: `text-black`,
          prevButton: `text-black`,
          nextButton: `text-black`,
          gridHeader: `!shadow-none`,
          gridHeaderRow: `px-0 gap-x-5 w-[312px]`,
          gridHeaderCell: `text-black w-5`,
          gridBody: `space-y-[4px]`,
          gridBodyRow: `!border-none gap-x-1`,
          cell: `w-[${cellWidth}px] h-[${cellHeight}px]`,
          cellButton: [
            "data-[today=true]:bg-primary-950",
            "data-[today=true]:!text-white",
            "data-[selected=true]:bg-primary-950 data-[selected=true]:rounded-[8px]",
            "data-[selected=true]:!text-white",
            "data-[unavailable=true]:bg-accent-400 rounded-[8px] !text-primary-950",
            "data-[disabled=true]:bg-secondary-50",
            `w-[${cellWidth}px] h-[${cellHeight}px]`,
          ],
        }}
      />
    </I18nProvider>
  );
}

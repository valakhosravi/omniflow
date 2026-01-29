import { parseDate } from "@internationalized/date";
import { DateValue, now, parseAbsoluteToLocal } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { DatePicker } from "@/ui/NextUi";
import { Icon } from "./Icon";

interface DatePickerModel {
  label?: string;
  width?: number;
  height?: number;
  cellWidth?: number;
  cellHeight?: number;
  value?: string;
  onChange?: (value: string) => void;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  gap?: number;
  isRequired?: boolean;
  errorMessage?: string
}

export default function PersianDatePicker({
  label,
  width,
  height,
  value,
  onChange,
  isOpen,
  setIsOpen,
  cellWidth,
  cellHeight,
  gap = 0,
  isRequired,
  errorMessage
}: DatePickerModel) {
  const dateValue = value ? parseDate(value) : null;

  return (
    <I18nProvider locale="fa-IR">
      <DatePicker
        isRequired={isRequired}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        label={label}
        labelPlacement="outside"
        variant={"bordered"}
        value={dateValue as any}
        onChange={(val) => {
          if (val) {
            const dateStr = (val as any).toString();
            onChange?.(dateStr);
            setIsOpen?.(false);
          } else {
            onChange?.("");
          }
        }}
        errorMessage={errorMessage}
        endContent={
          <Icon
            name="datePicker"
            onClick={() => {
              setIsOpen?.((prev) => !prev);
            }}
          />
        }
        calendarProps={{
          classNames: {
            title: `text-black`,
            prevButton: `text-black`,
            nextButton: `text-black`,
            gridHeaderCell: `text-black w-5`,
            gridBody: `space-y-[4px]`,
            gridHeader: `!shadow-none`,
            gridHeaderRow: `px-0 gap-x-2 w-[${width}px]`,
            gridBodyRow: `!border-none gap-x-${gap}`,
            cell: `w-[${cellWidth}px] h-[${cellHeight}px] px-0.5`,
            cellButton: [
              "data-[today=true]:bg-primary-950",
              "data-[today=true]:!text-white",
              "data-[selected=true]:data-[selection-start=true]:data-[selection=true]:bg-primary-950",
              "data-[selected=true]:data-[selection-start=true]:data-[selection=true]:rounded-[8px]",
              "data-[selected=true]:data-[selection-end=true]:data-[selection=true]:bg-primary-950",
              "data-[selected=true]:data-[selection-end=true]:data-[selection=true]:rounded-[8px]",
              `data-[selected=true]:data-[selection=true]:before:!bg-primary-950
              data-[selected=true]:!bg-primary-950`,
              `data-[selected=true]:!text-white`,
              "data-[unavailable=true]:bg-accent-400 rounded-[8px] !text-primary-950",
              "data-[disabled=true]:bg-secondary-50",
              // Size
              // `w-[${cellWidth}px] h-[${cellHeight}px]`,
            ],
          },
        }}
        classNames={{
          base: `!bg-white w-[${width}px]`,
          label: `font-bold text-[14px]/[20px]`,
          inputWrapper: `bg-transparent border border-default-300 rounded-[12px] !shadow-none hover:bg-transparent hover:border-default-400 h-[${height}px] min-h-[${height}px] w-[${width}px] min-w-[${width}px]`,
          calendar: `!text-secondary-950 !shadow-none !bg-white w-[${width}px]`,
          popoverContent: `!shadow-datepicker !border-none !border-b-0 !bg-white`,
          calendarContent: `!border-none !border-b-0 !bg-white w-[${width}px]`,
        }}
      />
    </I18nProvider>
  );
}

import { useHolidayList } from "@/hooks/food/useHolidayAction";
import { Icon } from "@/ui/Icon";
import { DateRangePicker } from "@heroui/react";
import { parseDate, CalendarDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  isInvalid: boolean;
  errorMessage?: string;
  name: string;
  label: string;
  isRequired?: boolean;
  width?: number;
  height?: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Datepicker({
  value,
  onChange,
  onBlur,
  isInvalid,
  errorMessage,
  label,
  isRequired,
  width,
  height,
  isOpen,
  setIsOpen,
}: Props) {
  const { holidayData } = useHolidayList();
  const parsedValue = value
    ? (() => {
        const [startStr, endStr] = value.split("/");
        return {
          start: parseDate(startStr),
          end: parseDate(endStr),
        };
      })()
    : null;

  const disabledRanges: CalendarDate[] = [];

  holidayData?.Data?.map((p) => {
    const hdate = parseDate(p.HolidayDate);
    disabledRanges.push(hdate);
  });

  return (
    <I18nProvider locale="fa-IR">
      <DateRangePicker
        // isDateUnavailable={(date) =>
        //   holidayData?.Data?.findIndex((p) => p.HolidayDate == date) > 1
        //     ? true
        //     : false
        // }
        // validationBehavior="native"
        allowsNonContiguousRanges={false}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isRequired={isRequired}
        label={label}
        labelPlacement="outside"
        firstDayOfWeek="sat"
        value={parsedValue as any}
        onChange={(range) => {
          if (range) {
            onChange(
              `${(range.start as any).toString()}/${(range.end as any).toString()}`,
            );
            setIsOpen(false);
          }
        }}
        defaultOpen={false}
        onBlur={onBlur}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        selectorButtonPlacement={"start"}
        startContent={
          <Icon
            name="calendar"
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          />
        }
        popoverProps={{
          triggerScaleOnOpen: false,
          shouldCloseOnInteractOutside: () => false,
        }}
        calendarProps={{
          classNames: {
            title: `text-black`,
            prevButton: `text-black`,
            nextButton: `text-black`,
            gridHeaderCell: `text-black`,
            gridBody: `space-y-[4px]`,
            gridHeader: `!shadow-none`,
            gridBodyRow: `!border-none`,
            cell: `w-[36px] h-[36px]`,
            cellButton: [
              "data-[today=true]:bg-primary-950",
              "data-[today=true]:!text-white",
              "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:bg-primary-950",
              "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-[8px]",
              "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:bg-primary-950",
              "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-[8px]",
              `data-[selected=true]:data-[range-selection=true]:before:!bg-primary-950
              [data-selected="true"][data-range-selection="true"]:before:!bg-primary-950`,
              `data-[selected=true]:data-[range-selection=true]:!text-white
              [data-selected="true"][data-range-selection="true"]:!text-white`,
              // Regular unselected dates
              // "data-[selected=false]:data-[unavailable=false]:bg-secondary-50 data-[selected=false]:data-[unavailable=false]:rounded-[8px]",
              // Unavailable dates styling - these should override other styles
              "data-[unavailable=true]:bg-accent-400 rounded-[8px] !text-primary-950",
              "data-[disabled=true]:bg-secondary-50",
              // Size
              "w-[36px] h-[36px]",
            ],
          },
        }}
        classNames={{
          base: `!bg-white`,
          label: `font-bold text-[14px]/[20px]`,
          inputWrapper: `bg-transparent border border-default-300 rounded-[12px] !shadow-none hover:bg-transparent hover:border-default-400 h-[${height}px] min-h-[${height}px] w-[${width}px] min-w-[${width}px]`,
          calendar: `!text-secondary-950 !shadow-none !bg-white w-[312px]`,
          popoverContent: `!shadow-datepicker !border-none !border-b-0 !bg-white`,
          calendarContent: `!border-none !border-b-0 !bg-white w-[312px]`,
        }}
      />
    </I18nProvider>
  );
}

import DatePicker from "react-multi-date-picker";
import { Icon } from "@/ui/Icon";

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

export default function MultiDatePicker({
  value,
  onChange,
  onBlur,
  isInvalid,
  errorMessage,
  label,
  isRequired,
  width,
  height,
  setIsOpen,
}: Props) {
  const handleDateChange = (date: any) => {
    if (date) {
      // Convert to YYYY-MM-DD format
      const formattedDate = date.format("YYYY-MM-DD");
      onChange(formattedDate);
    } else {
      onChange("");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onBlur();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="font-bold text-[14px]/[20px] text-foreground">
        {label}
        {isRequired && <span className="text-danger"> *</span>}
      </label>

      <div className="relative">
        <DatePicker
          value={value ? new Date(value) : null}
          onChange={handleDateChange}
          format="YYYY/MM/DD"
          calendarPosition="bottom-right"
          containerStyle={{
            width: `${width}px`,
            height: `${height}px`,
          }}
          inputClass={`w-[${width}px] h-[${height}px] bg-transparent border border-default-300 rounded-[12px] px-3 py-2 text-right text-foreground placeholder:text-default-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            isInvalid ? "border-danger" : ""
          }`}
          placeholder="تاریخ را انتخاب کنید"
          editable={false}
          showOtherDays={false}
          render={
            <input
              className={`w-[${width}px] h-[${height}px] bg-transparent border border-default-300 rounded-[12px] px-3 py-2 text-right text-foreground placeholder:text-default-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                isInvalid ? "border-danger" : ""
              }`}
              placeholder="تاریخ را انتخاب کنید"
              readOnly
              value={value}
              onClick={() => setIsOpen(true)}
            />
          }
          onOpen={() => handleOpenChange(true)}
          onClose={() => handleOpenChange(false)}
        />

        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Icon name="calendar" className="text-default-500" />
        </div>
      </div>

      {isInvalid && errorMessage && (
        <p className="text-danger text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

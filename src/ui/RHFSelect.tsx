import { Controller, Control, UseFormRegisterReturn } from "react-hook-form";
import { Select, SelectItem } from "./NextUi";

interface SelectOption {
  label: string;
  value: string | number;
}

interface FormSelectProps {
  name: string;
  control: Control<any>;
  error?: string;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  className?: string;
  valueType?: "string" | "number";
  register?: UseFormRegisterReturn;
  onSelectionChange?: (value: string | number | null) => void;
  width?: number;
  height?: number;
}

// New RHFSelect component that matches RHFInput styling
interface RHFSelectProps {
  label: string;
  name: string;
  control?: Control<any>;
  register?: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  width?: number;
  height?: number;
  options: SelectOption[];
  labelExention?: React.ReactNode;
  readOnly?: boolean;
  tabIndex?: number;
  fullWidth?: boolean;
  defaultValue?: string | number;
  containerClassName?: string;
  rules?: any;
  valueType?: "string" | "number";
}

export default function RHFSelect({
  name,
  control,
  label,
  required = false,
  register,
  error,
  placeholder,
  width = 435,
  height = 56,
  className = "",
  options,
  labelExention,
  readOnly = false,
  tabIndex,
  fullWidth = false,
  defaultValue,
  containerClassName,
  rules,
  valueType = "string",
}: RHFSelectProps) {
  return (
    <div className={`text-secondary-950 ${containerClassName}`}>
      <label className="font-bold text-[14px]/[20px]">
        {label} {required && <span className="text-accent-500">*</span>}{" "}
        {labelExention}
      </label>
      <div className="relative mt-[10px]">
        {control && name ? (
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field, fieldState }) => {
              const hasError = !!fieldState.error;

              return (
                <Select
                  placeholder={placeholder}
                  isInvalid={!!error}
                  isRequired={required}
                  errorMessage={error}
                  variant="bordered"
                  className={className}
                  aria-label={label || "Select option"}
                  selectedKeys={field.value ? [String(field.value)] : []}
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys)[0];
                    const convertedValue = selectedValue
                      ? valueType === "number"
                        ? Number(selectedValue)
                        : String(selectedValue)
                      : valueType === "number"
                      ? 0
                      : "";
                    field.onChange(convertedValue);
                  }}
                  isDisabled={readOnly}
                  tabIndex={tabIndex}
                  classNames={{
                    base: fullWidth ? "w-full" : "w-auto",
                    trigger: `
                   ${hasError ? "border-accent-500" : "border-default-300"}
                    ${readOnly ? "text-[#6C727F] bg-[#EEEEF0]" : "bg-white "} 
                    ${
                      fullWidth ? "w-full" : `w-[${width}px] min-w-[${width}px]`
                    }
                    border border-default-300 rounded-[12px] shadow-none 
                    h-[${height}px] min-h-[${height}px]`,
                    value: `text-sm text-secondary-950`,
                    popoverContent: `border border-default-300`,
                  }}
                >
                  {options.map((option) => (
                    <SelectItem key={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              );
            }}
          />
        ) : (
          <Select
            {...register}
            placeholder={placeholder}
            aria-label={label || "Select option"}
            isInvalid={!!error}
            errorMessage={error}
            variant="bordered"
            className={className}
            isDisabled={readOnly}
            tabIndex={tabIndex}
            defaultSelectedKeys={defaultValue ? [String(defaultValue)] : []}
            classNames={{
              base: fullWidth ? "w-full" : "w-auto",
              trigger: `
                ${readOnly ? "text-[#6C727F] bg-[#F7F8F8]" : "bg-white "}
                ${fullWidth ? "w-full" : `w-[${width}px] min-w-[${width}px]`}
                border border-default-300 rounded-[12px] shadow-none 
                h-[${height}px] min-h-[${height}px]`,
              value: `text-sm text-secondary-950`,
              popoverContent: `border border-default-300`,
            }}
          >
            {options.map((option) => (
              <SelectItem key={String(option.value)}>{option.label}</SelectItem>
            ))}
          </Select>
        )}
      </div>
    </div>
  );
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  control,
  error,
  options,
  label,
  placeholder,
  isRequired = false,
  isDisabled = false,
  className = "",
  valueType = "number",
  onSelectionChange,
  register,
  width,
  height,
}) => {
  const handleSelectionChange = (
    val: string | number | null,
    fieldOnChange: (value: any) => void
  ) => {
    const convertedValue = val
      ? valueType === "number"
        ? Number(val)
        : String(val)
      : null;
    fieldOnChange(convertedValue);
    onSelectionChange?.(convertedValue);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={`flex flex-col gap-1 text-secondary-950 ${className}`}>
          {label && (
            <label htmlFor={name} className="font-bold text-[14px]/[20px]">
              {label} {isRequired && <span className="text-accent-500">*</span>}
            </label>
          )}
          <Select
            {...field}
            {...register}
            id={name}
            variant="bordered"
            placeholder={placeholder}
            aria-label={label || "Select option"}
            classNames={{
              base: `text-sm text-secondary-950 bg-white shadow-none`,
              trigger: `!bg-white shadow-none border border-default-300 focus:border-default-400 hover:border-default-400
               rounded-[12px] h-[${height}px] min-h-[${height}px] w-[${width}px]
                "hover:bg-gray-50",
                "focus:bg-white",
                "border-none",
              `,
              popoverContent: `border border-default-300`,
            }}
            selectedKeys={field.value ? [String(field.value)] : []}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys)[0] as string;
              handleSelectionChange(selectedValue, field.onChange);
            }}
            isInvalid={!!error}
            errorMessage={error}
            isRequired={isRequired}
            isDisabled={isDisabled}
          >
            {options.map((item) => (
              <SelectItem key={String(item.value)}>{item.label}</SelectItem>
            ))}
          </Select>
        </div>
      )}
    />
  );
};

export const transformToOptions = <T,>(
  data: T[],
  labelKey: keyof T,
  valueKey: keyof T
): SelectOption[] => {
  return (
    data?.map((item) => ({
      label: String(item[labelKey]),
      value: item[valueKey] as string | number,
    })) || []
  );
};

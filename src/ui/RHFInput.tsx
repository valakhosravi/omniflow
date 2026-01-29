"use client";

import { Input, Textarea } from "@heroui/react";
import { Control, Controller, UseFormRegisterReturn, RegisterOptions } from "react-hook-form";
import Image from "next/image";
import { formatNumberWithCommas, removeCommas } from "@/utils/formatNumber";

interface TextInputProps {
  label: string;
  type?: string;
  icon?: string;
  required?: boolean;
  register?: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  placeholderAlign?: "left" | "right";
  inputDirection?: "ltr" | "rtl";
  className?: string;
  width?: number;
  height?: number;
  textAlignment?: string;
  name?: string;
  control?: Control<any>;
  rules?: RegisterOptions;
  customEvent?: any;
  autoComplete?: string;
  withCommaSeparator?: boolean;
  labelExention?: React.ReactNode;
  readOnly?: boolean;
  tabIndex?: number;
  fullWidth?: boolean;
  isTextarea?: boolean;
  containerClassName?: string;
  "data-cy"?: string;
  isDisabled?: boolean;
}

export default function RHFInput({
  name,
  control,
  label,
  type = "text",
  icon,
  required = false,
  register,
  error,
  placeholder,
  startContent,
  endContent,
  placeholderAlign = "right",
  inputDirection,
  width = 435,
  height = 56,
  textAlignment = "text-left",
  className = "",
  customEvent = {},
  autoComplete,
  withCommaSeparator,
  labelExention,
  readOnly = false,
  tabIndex,
  fullWidth = false,
  isTextarea = false,
  containerClassName = "",
  "data-cy": dataCy,
  isDisabled = false,
  rules,
}: TextInputProps) {
  const placeholderAlignmentClass =
    placeholderAlign === "left"
      ? "placeholder:text-left"
      : "placeholder:text-right";
  return (
    <div className={`text-secondary-950 ${containerClassName}`}>
      <label className="font-bold text-[14px]/[20px]">
        {label} {required && <span className="text-accent-500">*</span>}{" "}
        {labelExention}
      </label>
      <div className="relative mt-[10px]">
        {icon && (
          <Image
            src={icon}
            alt={`${label}-icon`}
            width={20}
            height={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          />
        )}
        {control && name ? (
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => {
              const isNumber = type === "number";

              const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const rawValue = e.target.value;
                const numericValue = removeCommas(rawValue);

                if (isNumber && withCommaSeparator) {
                  if (/^\d*$/.test(numericValue)) {
                    field.onChange(numericValue);
                  }
                } else {
                  field.onChange(rawValue);
                }
              };

              const displayValue =
                isNumber && withCommaSeparator && field.value
                  ? formatNumberWithCommas(field.value)
                  : field.value ?? "";

              return isTextarea ? (
                <Textarea
                  {...field}
                  {...register}
                  placeholder={placeholder}
                  isInvalid={!!error}
                  errorMessage={error}
                  classNames={{
                    base: fullWidth ? "w-full" : "w-auto",
                    inputWrapper: `
                      ${readOnly ? "text-[#6C727F] bg-[#EEEEF0]" : "bg-white "} 
                      ${
                        fullWidth
                          ? "w-full"
                          : `w-[${width}px] min-w-[${width}px]`
                      }
                      border border-default-300 rounded-[12px] shadow-none 
                      h-[${height}px] min-h-[${height}px]`,
                    input: `text-sm text-secondary-950 placeholder:text-secondary-400 ${textAlignment} ${placeholderAlignmentClass}`,
                  }}
                  {...(inputDirection === "ltr" ? { dir: "ltr" } : {})}
                />
              ) : (
                <Input
                  {...field}
                  {...register}
                  type="text"
                  placeholder={placeholder}
                  isInvalid={!!error}
                  errorMessage={error}
                  variant="bordered"
                  startContent={startContent}
                  endContent={endContent}
                  className={className}
                  value={displayValue}
                  onChange={handleChange}
                  {...(autoComplete ? { autoComplete } : {})}
                  {...customEvent}
                  readOnly={readOnly}
                  tabIndex={tabIndex}
                  data-cy={dataCy}
                  isDisabled={isDisabled}
                  classNames={{
                    base: fullWidth ? "w-full" : "w-auto",
                    inputWrapper: `
                      ${readOnly ? "text-[#6C727F] bg-[#EEEEF0]" : "bg-white "} 
                      ${
                        fullWidth
                          ? "w-full"
                          : `w-[${width}px] min-w-[${width}px]`
                      }
                      border border-default-300 rounded-[12px] shadow-none 
                      h-[${height}px] min-h-[${height}px]`,
                    input: `text-sm text-secondary-950 placeholder:text-secondary-400 ${textAlignment} ${placeholderAlignmentClass}`,
                  }}
                  {...(inputDirection === "ltr" ? { dir: "ltr" } : {})}
                />
              );
            }}
          />
        ) : isTextarea ? (
          <Textarea
            {...register}
            placeholder={placeholder}
            isInvalid={!!error}
            errorMessage={error}
            data-cy={dataCy}
            classNames={{
              base: fullWidth ? "w-full" : "w-auto",
              inputWrapper: `
                ${readOnly ? "text-[#6C727F] bg-[#F7F8F8]" : "bg-white "}
                ${fullWidth ? "w-full" : `w-[${width}px] min-w-[${width}px]`}
                border border-default-300 rounded-[12px] shadow-none 
                h-[${height}px] min-h-[${height}px]`,
              input: `text-sm text-secondary-950 placeholder:text-secondary-400 ${textAlignment} ${placeholderAlignmentClass}`,
            }}
            {...(inputDirection === "ltr" ? { dir: "ltr" } : {})}
          />
        ) : (
          <Input
            {...register}
            type={type}
            placeholder={placeholder}
            isInvalid={!!error}
            errorMessage={error}
            variant="bordered"
            startContent={startContent}
            endContent={endContent}
            className={className}
            {...(autoComplete ? { autoComplete } : {})}
            {...customEvent}
            readOnly={readOnly}
            tabIndex={tabIndex}
            data-cy={dataCy}
            classNames={{
              base: fullWidth ? "w-full" : "w-auto",
              inputWrapper: `
              ${readOnly ? "text-[#6C727F] bg-[#F7F8F8]" : "bg-white "}
              ${fullWidth ? "w-full" : `w-[${width}px] min-w-[${width}px]`}
              border border-default-300 rounded-[12px] shadow-none 
              h-[${height}px] min-h-[${height}px]`,
              input: `text-sm text-secondary-950 placeholder:text-secondary-400 ${textAlignment} ${placeholderAlignmentClass}`,
            }}
            {...(inputDirection === "ltr" ? { dir: "ltr" } : {})}
          />
        )}
      </div>
    </div>
  );
}

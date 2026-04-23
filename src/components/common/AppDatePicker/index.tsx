"use client";

import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { classNames } from "@/utils/classNames";
import type { AppDatePickerProps } from "./AppDatePicker.types";
import { getStringValue } from "./AppDatePicker.utils";
import AppInput from "../AppInput";

export type { AppDatePickerProps } from "./AppDatePicker.types";

type DatePickerRenderInputProps = {
  value?: string;
  openCalendar?: () => void;
};

const DatePickerRenderInput = React.forwardRef<
  HTMLInputElement,
  DatePickerRenderInputProps & AppDatePickerProps
>(function DatePickerRenderInput(
  {
    value,
    openCalendar,
    label,
    required,
    labelExtension,
    error,
    placeholder,
    disabled,
    readOnly,
    name,
    "data-cy": dataCy,
  },
  ref,
) {
  return (
    <div className="w-full" onClick={() => openCalendar?.()}>
      <AppInput
        ref={ref}
        label={label ?? ""}
        required={required}
        labelExtension={labelExtension}
        error={error}
        className="w-full"
        placeholder={placeholder}
        value={value ?? ""}
        readOnly
        disabled={disabled || readOnly}
        name={name}
        data-cy={dataCy}
        dir="rtl"
      />
    </div>
  );
});

export default function AppDatePicker({
  label,
  required = false,
  labelExtension,
  error,
  className,
  width,
  height = 56,
  cellWidth,
  cellHeight,
  format = "YYYY/MM/DD",
  placeholder = "انتخاب تاریخ",
  name,
  value,
  defaultValue,
  disabled,
  readOnly,
  "data-cy": dataCy,
  onChange,
  onBlur,
}: AppDatePickerProps) {
  return (
    <div
      className={classNames(className)}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      <DatePicker
        value={value ?? defaultValue ?? ""}
        calendar={persian}
        locale={persian_fa}
        format={format}
        disabled={disabled || readOnly}
        editable={false}
        containerClassName="w-full block"
        render={
          <DatePickerRenderInput
            label={label}
            required={required}
            labelExtension={labelExtension}
            error={error}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            name={name}
            data-cy={dataCy}
          />
        }
        onClose={() => onBlur?.()}
        onChange={(date) => {
          if (!date) {
            onChange?.("");
            return;
          }
          onChange?.(getStringValue(date, format));
        }}
        mapDays={() => ({
          style: {
            width: cellWidth ? `${cellWidth}px` : undefined,
            height: cellHeight ? `${cellHeight}px` : undefined,
          },
        })}
      />
    </div>
  );
}

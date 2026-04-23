"use client";

import React from "react";
import { classNames } from "@/utils/classNames";
import type { AppInputProps } from "./AppInput.types";
import { formatNumberWithCommas } from "@/utils/formatNumber";

/* -------------------- Style tokens -------------------- */

const INPUT_WRAPPER =
  "flex items-center h-14 mt-2.5 px-3 bg-white border border-default-300 rounded-xl shadow-none transition-colors hover:border-default-400 focus-within:border-default-500";

const INPUT_WRAPPER_READONLY =
  "cursor-default hover:!border-default-300 focus-within:!border-default-300";

const INPUT_WRAPPER_INVALID =
  "!border-accent-500 hover:!border-accent-500 focus-within:!border-accent-500";

const INPUT_WRAPPER_DISABLED = "opacity-50 pointer-events-none";

const INPUT =
  "w-full h-full bg-transparent outline-none text-sm text-secondary-950 placeholder:text-secondary-400";

const INPUT_READONLY = "cursor-default !text-neutral-600";

/* ====================================================== */

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  function AppInput(
    {
      label,
      required = false,
      labelExtension,
      error,
      className,
      readOnly,
      disabled,
      value,
      type,
      ...inputProps
    },
    ref,
  ) {
    const wrapperClasses = classNames(
      INPUT_WRAPPER,
      readOnly && INPUT_WRAPPER_READONLY,
      !!error && INPUT_WRAPPER_INVALID,
      disabled && INPUT_WRAPPER_DISABLED,
    );

    const displayValue =
      type === "number"
        ? formatNumberWithCommas(value as string)
        : (value ?? "");

    return (
      <div className={classNames("text-secondary-950", className)}>
        <label className="font-bold text-[14px]/[20px]">
          {label}
          {required && <span className="text-accent-500"> *</span>}
          {labelExtension && <> {labelExtension}</>}
        </label>

        <div className={wrapperClasses}>
          <input
            ref={ref}
            readOnly={readOnly}
            disabled={disabled}
            className={classNames(INPUT, readOnly && INPUT_READONLY)}
            value={displayValue}
            {...inputProps}
          />
        </div>
      </div>
    );
  },
);

export default AppInput;

"use client";

import React, { useCallback, useId, useState } from "react";
import type { AppSwitchProps, AppSwitchSize } from "./AppSwitch.types";

export type {
  AppSwitchProps,
  AppSwitchSize,
  AppSwitchClassNames,
} from "./AppSwitch.types";

const sizeConfig: Record<
  AppSwitchSize,
  { track: string; thumb: string; thumbTranslate: string }
> = {
  sm: {
    track: "w-10 h-6",
    thumb: "size-4",
    thumbTranslate: "translate-x-4 rtl:-translate-x-4",
  },
  md: {
    track: "w-12 h-7",
    thumb: "size-5",
    thumbTranslate: "translate-x-5 rtl:-translate-x-5",
  },
  lg: {
    track: "w-14 h-8",
    thumb: "size-6",
    thumbTranslate: "translate-x-6 rtl:-translate-x-6",
  },
};

export function AppSwitch({
  isSelected: controlledSelected,
  defaultSelected = false,
  onValueChange,
  onChange,
  isDisabled = false,
  isReadOnly = false,
  size = "md",
  name,
  value,
  classNames,
  className,
  children,
}: AppSwitchProps) {
  const id = useId();
  const [internalSelected, setInternalSelected] = useState(defaultSelected);

  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? controlledSelected : internalSelected;

  const config = sizeConfig[size];

  const handleToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled || isReadOnly) return;

      const newValue = !selected;
      if (!isControlled) {
        setInternalSelected(newValue);
      }
      onValueChange?.(newValue);
      onChange?.(e);
    },
    [isDisabled, isReadOnly, selected, isControlled, onValueChange, onChange],
  );

  return (
    <label
      data-selected={selected ? "true" : "false"}
      data-disabled={isDisabled ? "true" : "false"}
      data-readonly={isReadOnly ? "true" : "false"}
      className={[
        "group inline-flex items-center gap-2 select-none",
        isDisabled
          ? "opacity-50 pointer-events-none"
          : isReadOnly
            ? "cursor-default"
            : "cursor-pointer",
        classNames?.base,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="checkbox"
        role="switch"
        id={id}
        name={name}
        value={value}
        checked={selected}
        disabled={isDisabled}
        readOnly={isReadOnly}
        onChange={handleToggle}
        className="sr-only"
        aria-checked={selected}
      />

      <span
        data-selected={selected ? "true" : "false"}
        className={[
          "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200",
          config.track,
          selected ? "bg-primary-950" : "bg-default-200",
          classNames?.wrapper,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span
          className={[
            "bg-white rounded-full shadow-sm transition-transform duration-200 mx-1",
            config.thumb,
            selected ? config.thumbTranslate : "translate-x-0",
            classNames?.thumb,
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </span>

      {children && (
        <span
          className={["text-sm", classNames?.label].filter(Boolean).join(" ")}
        >
          {children}
        </span>
      )}
    </label>
  );
}

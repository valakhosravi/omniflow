import { AppSwitch as Switch } from "@/components/common/AppSwitch";
import { classNames } from "@/utils/classNames";
import React from "react";

interface LabeledSwitchProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  isSelected?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function LabeledSwitch({
  icon,
  label,
  isSelected = false,
  onValueChange,
  disabled,
  readOnly = false,
}: LabeledSwitchProps) {
  return (
    <div
      className={classNames(
        "p-2 flex justify-between items-center border border-neutral-200 rounded-xl",
        disabled ? "bg-gray-100 opacity-80" : "",
        readOnly && "bg-gray-100",
      )}
    >
      <div className="flex items-center">
        <div
          className={classNames(
            "size-10 rounded-xl bg-color-neutral-50 flex items-center justify-center",
            readOnly && "text-neutral-600",
          )}
        >
          {icon}
        </div>
        <div
          className={classNames(
            "text-sm text-color-neutral-500 ms-2.5",
            readOnly && "text-neutral-600",
          )}
        >
          {label}
        </div>
      </div>
      <Switch
        isSelected={isSelected}
        onValueChange={onValueChange}
        isDisabled={disabled}
        isReadOnly={readOnly}
        classNames={{
          wrapper: "group-data-[selected=true]:!bg-brand",
        }}
      />
    </div>
  );
}

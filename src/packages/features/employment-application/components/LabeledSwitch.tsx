import { Switch } from "@heroui/react";
import React from "react";

interface LabeledSwitchProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  isSelected?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
}

export default function LabeledSwitch({
  icon,
  label,
  name,
  isSelected = false,
  onValueChange,
  disabled,
}: LabeledSwitchProps) {
  return (
    <div className={`p-[8px] flex justify-between items-center border border-[#D8D9DF] rounded-[12px] ${disabled ? "bg-gray-100 opacity-80" : ""}`}>
      <div className="flex items-center">
        <div className="w-[40px] h-[40px] rounded-[12px] bg-[#F8F9FA] flex items-center justify-center">
          {icon}
        </div>
        <div className="text-[14px] text-[#8F94A1] ms-[10px]">{label}</div>
      </div>
      <Switch
        isSelected={isSelected}
        onValueChange={onValueChange}
        isDisabled={disabled}
        classNames={{
          wrapper: "group-data-[selected=true]:!bg-[#1C3A63]",
        }}
      />
    </div>
  );
}
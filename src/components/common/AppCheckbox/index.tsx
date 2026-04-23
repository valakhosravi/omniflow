import React from "react";
import type { AppCheckboxProps } from "./AppCheckbox.types";

export type { AppCheckboxProps } from "./AppCheckbox.types";

export function AppCheckbox({
  label,
  description,
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  name,
}: AppCheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <label
      className={`flex items-start gap-2 cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />

      <span>
        <span className="font-semibold text-sm">{label}</span>

        {description && (
          <span className="block text-xs text-[#6b7280]">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

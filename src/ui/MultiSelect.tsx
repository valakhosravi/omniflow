"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Chip } from "@heroui/react";

interface MultiSelectOption {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: (string | number)[];
  onSelectionChange: (selectedValues: (string | number)[]) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export default function MultiSelect({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "انتخاب...",
  className = "",
  label,
  disabled = false,
}: MultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter options based on input value (keep all options, including selected ones)
  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  const handleSelect = (value: string | number) => {
    if (disabled) return;
    if (!selectedValues.includes(value)) {
      onSelectionChange([...selectedValues, value]);
      setInputValue(""); // Clear input after selection
    }
    setIsOpen(false);
  };

  const handleRemove = (valueToRemove: string | number) => {
    if (disabled) return;
    onSelectionChange(selectedValues.filter((val) => val !== valueToRemove));
  };

  const getSelectedOption = (value: string | number) => {
    return options.find((opt) => opt.value === value);
  };

  const handleWrapperClick = () => {
    if (!disabled) {
      inputRef.current?.focus();
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && selectedValues.length > 0) {
      // Remove last selected item when backspace is pressed on empty input
      onSelectionChange(selectedValues.slice(0, -1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter" && filteredOptions.length > 0) {
      // Select first option on Enter
      e.preventDefault();
      handleSelect(filteredOptions[0].value);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-[12px] font-medium text-primary-950/[.7] mb-2 block">
          {label}
        </label>
      )}
      <div className="relative" ref={wrapperRef}>
        {/* Custom input wrapper with chips inside */}
        <div
          onClick={handleWrapperClick}
          className={`
            flex flex-wrap items-center gap-1 
            px-[8px] py-[6px] min-h-[32px]
            border-1 border-primary-950/[.2] rounded-[8px] 
            bg-white cursor-text
            transition-colors
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary-950/[.3]"}
            ${isOpen ? "border-primary-950/[.4] ring-2 ring-primary-950/[.1]" : ""}
          `}
        >
          {/* Selected chips */}
          {selectedValues.map((value) => {
            const option = getSelectedOption(value);
            if (!option) return null;
            return (
              <Chip
                key={String(value)}
                onClose={disabled ? undefined : () => handleRemove(value)}
                variant="bordered"
                classNames={{
                  base: `border-1 rounded-[6px] text-secondary-200 px-[8px] py-[2px] gap-x-1 max-w-full`,
                  content: `font-semibold text-[11px]/[16px] text-primary-950/[.7] p-0 truncate`,
                  closeButton: `text-primary-950/[.5] text-[12px] ml-1`,
                }}
                dir="ltr"
              >
                {option.label}
              </Chip>
            );
          })}
          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedValues.length === 0 ? placeholder : ""}
            disabled={disabled}
            className={`
              flex-1 min-w-[120px] max-w-full
              font-normal text-[12px]/[18px] text-primary-950
              bg-transparent border-none outline-none
              placeholder:text-primary-950/[.4]
            `}
          />
        </div>

        {/* Dropdown menu */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border-1 border-primary-950/[.2] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div
                    key={String(option.value)}
                    onClick={() => !isSelected && handleSelect(option.value)}
                    className={`
                      px-3 py-2 text-[12px] text-primary-950 transition-colors
                      ${isSelected 
                        ? "opacity-50 cursor-not-allowed bg-primary-950/[.02]" 
                        : "cursor-pointer hover:bg-primary-950/[.05]"
                      }
                    `}
                  >
                    {option.label}
                    {isSelected && <span className="mr-2 text-primary-950/[.5]">✓</span>}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2 text-[12px] text-primary-950/[.5]">
                {inputValue.trim() ? "نتیجه‌ای یافت نشد" : "گزینه‌ای برای انتخاب وجود ندارد"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
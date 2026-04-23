"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  AppMultiSelectProps,
  DEFAULT_OTHER_OPTION_KEY,
} from "./AppMultiSelect.types";
import { AppIcon } from "../AppIcon";
import AppInput from "../AppInput";

export {
  type AppMultiSelectProps,
  type AppMultiSelectItem,
} from "./AppMultiSelect.types";
export { DEFAULT_OTHER_OPTION_KEY } from "./AppMultiSelect.types";

const TRIGGER =
  "flex flex-wrap items-center gap-1 w-full min-h-14 mt-2.5 px-3 py-2 bg-white border border-default-300 rounded-xl shadow-none transition-colors cursor-pointer select-none hover:border-default-400";

const TRIGGER_INVALID =
  "border-accent-500 hover:border-accent-500 focus:border-accent-500";

const TRIGGER_DISABLED = "opacity-50 pointer-events-none";

const DROPDOWN =
  "absolute z-50 mt-1.5 w-full bg-white border border-default-300 hover:border-default-500 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] overflow-hidden";

const SEARCH_WRAPPER =
  "flex items-center gap-2 mx-2.5 mt-2.5 mb-1.5 px-3 h-10 border border-default-300 rounded-lg bg-white transition-colors focus-within:border-default-500";

const SEARCH_INPUT =
  "w-full h-full bg-transparent outline-none text-sm text-secondary-950 text-end placeholder:text-secondary-400";

const OPTIONS_LIST = "max-h-56 overflow-y-auto";

const OPTION =
  "px-4 py-3.5 text-sm text-start text-color-neutral-500 cursor-pointer transition-colors border-b border-default-100 last:border-b-0 hover:bg-default-50";

const OPTION_SELECTED =
  "px-4 py-3.5 text-sm text-start text-neutral-900 font-medium cursor-pointer bg-default-50 border-b border-default-100 last:border-b-0";

const NO_RESULTS = "px-4 py-3.5 text-sm text-center text-neutral-400";

const CHEVRON = "text-color-neutral-500 transition-transform duration-200";

export default function AppMultiSelect({
  items,
  value = [],
  onChange,
  onBlur,
  label,
  required = false,
  placeholder = "انتخاب کنید",
  error,
  otherOptionKey = DEFAULT_OTHER_OPTION_KEY,
  otherOptionLabel = "سایر",
  otherValue = "",
  onOtherChange,
  onOtherBlur,
  otherLabel = "مشخصات سایر",
  otherPlaceholder = "مقدار مورد نظر را به صورت دستی وارد کنید",
  otherError,
  maxDisplayItems,
  isLoading = false,
  showSearch = true,
}: AppMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allItems = onOtherChange
    ? [...items, { id: otherOptionKey, name: otherOptionLabel }]
    : items;

  const selectedKeys = value ?? [];
  const hasOtherSelected =
    onOtherChange && selectedKeys.includes(otherOptionKey);

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) return allItems;
    return allItems.filter((opt) =>
      opt.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [allItems, inputValue]);

  const handleToggle = (id: string) => {
    if (selectedKeys.includes(id)) {
      onChange(selectedKeys.filter((k) => k !== id));
    } else {
      onChange([...selectedKeys, id]);
    }
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(selectedKeys.filter((k) => k !== id));
  };

  const getItemById = (id: string) => allItems.find((i) => i.id === id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  const displayItems =
    maxDisplayItems != null
      ? selectedKeys.slice(0, maxDisplayItems)
      : selectedKeys;
  const hasMore =
    maxDisplayItems != null && selectedKeys.length > maxDisplayItems;

  return (
    <>
      <div className="flex flex-col text-secondary-950">
        <label className="font-bold text-[14px]/[20px]">
          {label}
          {required && <span className="text-accent-500"> *</span>}
        </label>
        <div className="relative mt-1" ref={wrapperRef}>
          <div
            onClick={() => !isLoading && setIsOpen((v) => !v)}
            className={`
              ${TRIGGER} dir-rtl
              ${error ? TRIGGER_INVALID : ""}
              ${isLoading ? TRIGGER_DISABLED : ""}
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-2 text-default-500">
                <svg className="mr-3 size-5 animate-spin" viewBox="0 0 24 24" />
                در حال بارگذاری...
              </span>
            ) : selectedKeys.length === 0 ? (
              <span className="text-sm text-secondary-400">{placeholder}</span>
            ) : (
              <>
                {displayItems.map((id) => {
                  const item = getItemById(id);
                  if (!item) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full bg-default-100 border border-default-200 text-small"
                    >
                      {item.name}
                      <button
                        type="button"
                        onClick={(e) => handleRemove(e, id)}
                        className="hover:text-danger outline-none p-0.5 rounded cursor-pointer"
                        aria-label="حذف"
                      >
                        <AppIcon name="CloseCircle" size={14} />
                      </button>
                    </span>
                  );
                })}
                {hasMore && (
                  <span className="px-2 py-0.5 text-default-500 text-small">
                    ...
                  </span>
                )}
              </>
            )}
            {!isLoading && (
              <AppIcon
                name="ArrowDown2"
                size={16}
                className={`${CHEVRON} absolute left-3 ${isOpen ? "rotate-180" : ""}`}
              />
            )}
          </div>

          {isOpen && !isLoading && (
            <div className={DROPDOWN}>
              {showSearch && (
                <div className={SEARCH_WRAPPER}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="جستجو..."
                    dir="rtl"
                    className={SEARCH_INPUT}
                  />
                  <AppIcon name="SearchNormal1" size={16} className="shrink-0 text-color-neutral-500" />
                </div>
              )}
              <div className={OPTIONS_LIST}>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => {
                    const isSelected = selectedKeys.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleToggle(opt.id)}
                        className={isSelected ? OPTION_SELECTED : OPTION}
                      >
                        {opt.name}
                        {isSelected && (
                          <span className="mr-2 inline-flex">
                            <AppIcon
                              name="TickCircle"
                              size={14}
                              className="text-default-500"
                            />
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className={NO_RESULTS}>
                    {inputValue.trim()
                      ? "نتیجه‌ای یافت نشد"
                      : "گزینه‌ای برای انتخاب وجود ندارد"}
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="text-danger text-[12px]/[18px] mt-1">{error}</p>
          )}
        </div>
      </div>

      {hasOtherSelected && onOtherChange && (
        <div className="w-full">
          <AppInput
            label={otherLabel}
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            onBlur={onOtherBlur}
            placeholder={otherPlaceholder}
            dir="rtl"
            className="w-full"
            error={otherError}
          />
          {otherError && (
            <p className="text-danger text-[12px]/[18px] mt-1">{otherError}</p>
          )}
        </div>
      )}
    </>
  );
}

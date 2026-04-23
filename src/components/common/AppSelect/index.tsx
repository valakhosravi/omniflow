"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  useMemo,
} from "react";
import { classNames } from "@/utils/classNames";
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import type { AppSelectProps } from "./AppSelect.types";

export type { AppSelectProps, SelectOption } from "./AppSelect.types";

/* -------------------- Style tokens -------------------- */

const TRIGGER =
  "flex items-center justify-between w-full h-14 mt-2.5 px-3 bg-white border border-default-300 rounded-xl shadow-none transition-colors cursor-pointer select-none hover:border-default-400 focus:border-default-500 focus:outline-none";

const TRIGGER_INVALID =
  "border-accent-500 hover:border-accent-500 focus:border-accent-500";

const TRIGGER_DISABLED = "opacity-50 pointer-events-none";

const DROPDOWN =
  "absolute z-50 mt-1.5 w-full bg-white border border-default-300 hover:border-default-500 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] overflow-hidden";

const SEARCH_WRAPPER =
  "flex items-center gap-2 mx-2.5 mt-2.5 mb-1.5 px-3 h-10 border border-default-300 rounded-lg bg-white transition-colors focus-within:border-default-500";

const SEARCH_INPUT =
  "w-full h-full bg-transparent outline-none text-sm text-secondary-950 text-start placeholder:text-secondary-400";

const SEARCH_ICON = "shrink-0 text-color-neutral-500";

const OPTIONS_LIST = "max-h-56 overflow-y-auto";

const OPTION =
  "px-4 py-3.5 text-sm text-start text-color-neutral-500 cursor-pointer transition-colors border-b border-default-100 last:border-b-0 hover:bg-default-50";

const OPTION_SELECTED =
  "px-4 py-3.5 text-sm text-start text-neutral-900 font-medium cursor-pointer bg-default-50 border-b border-default-100 last:border-b-0";

const NO_RESULTS = "px-4 py-3.5 text-sm text-center text-neutral-400";

const CHEVRON = "text-color-neutral-500 transition-transform duration-200";

/* ====================================================== */

export const AppSelect = React.forwardRef<HTMLSelectElement, AppSelectProps>(
  function AppSelect(
    {
      label,
      required = false,
      labelExtension,
      error,
      className,
      options,
      placeholder,
      disabled,
      name,
      value,
      defaultValue,
      searchable = false,
      searchPlaceholder = "جستجو ...",
      onChange,
      onBlur,
      "data-cy": dataCy,
    },
    ref,
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    /* ---- Expose a fake element for RHF register() ---- */

    const fakeRef = useRef({
      value: String(value ?? defaultValue ?? ""),
      name: name ?? "",
      focus: () => triggerRef.current?.focus(),
    });

    const selectedValue = useMemo(() => {
      if (value !== undefined) {
        return String(value ?? "");
      }

      if (internalValue !== null) {
        return internalValue;
      }

      return String(defaultValue ?? "");
    }, [value, internalValue, defaultValue]);

    useEffect(() => {
      fakeRef.current.value = selectedValue;
      fakeRef.current.name = name ?? "";
    }, [selectedValue, name]);

    useImperativeHandle(
      ref,
      () => fakeRef.current as unknown as HTMLSelectElement,
    );

    /* ---- Derived state ---- */

    const selectedOption = options.find(
      (o) => String(o.value) === selectedValue,
    );

    const filteredOptions = useMemo(() => {
      if (!searchable || !searchQuery.trim()) return options;
      const q = searchQuery.trim().toLowerCase();
      return options.filter((o) => o.label.toLowerCase().includes(q));
    }, [options, searchQuery, searchable]);

    /* ---- Reset search & auto-focus when dropdown opens/closes ---- */

    useEffect(() => {
      if (isOpen) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchQuery("");
        if (searchable) {
          requestAnimationFrame(() => searchInputRef.current?.focus());
        }
      }
    }, [isOpen, searchable]);

    /* ---- Close on outside click ---- */

    useEffect(() => {
      if (!isOpen) return;

      function handleClickOutside(e: MouseEvent) {
        const target = e.target as Node;
        if (
          !dropdownRef.current?.contains(target) &&
          !triggerRef.current?.contains(target)
        ) {
          setIsOpen(false);
          onBlur?.({ target: fakeRef.current });
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onBlur]);

    /* ---- Handlers ---- */

    const handleSelect = useCallback(
      (optValue: string) => {
        if (value === undefined) {
          setInternalValue(optValue);
        }
        setIsOpen(false);
        fakeRef.current.value = optValue;
        
        onChange?.({ target: { value: optValue, name: name ?? "" } });
        onBlur?.({ target: fakeRef.current });
      },
      [onChange, onBlur, name, value],
    );

    const handleToggle = () => {
      if (!disabled) setIsOpen((prev) => !prev);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        onBlur?.({ target: fakeRef.current });
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggle();
      }
    };

    /* ---- Classes ---- */

    const triggerClasses = classNames(
      TRIGGER,
      !!error && TRIGGER_INVALID,
      disabled && TRIGGER_DISABLED,
    );

    /* ==================== Render ==================== */

    return (
      <div className={classNames("text-secondary-950 relative", className)}>
        <label className="font-bold text-[14px]/[20px]">
          {label}
          {required && <span className="text-accent-500"> *</span>}
          {labelExtension && <> {labelExtension}</>}
        </label>

        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
          data-cy={dataCy}
          className={triggerClasses}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        >
          <span
            className={classNames(
              "text-sm",
              selectedOption ? "text-secondary-950" : "text-secondary-400",
            )}
          >
            {selectedOption?.label ?? placeholder ?? ""}
          </span>

          <ArrowDown2
            size={16}
            className={classNames(CHEVRON, isOpen && "rotate-180")}
          />
        </button>

        {/* Dropdown popover */}
        {isOpen && (
          <div ref={dropdownRef} className={DROPDOWN} role="listbox">
            {/* Search input */}
            {searchable && (
              <div className={SEARCH_WRAPPER}>
                <input
                  ref={searchInputRef}
                  type="text"
                  className={SEARCH_INPUT}
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsOpen(false);
                      onBlur?.({ target: fakeRef.current });
                    }
                  }}
                />
                <SearchNormal1 size={16} className={SEARCH_ICON} />
              </div>
            )}

            {/* Options list */}
            <div className={OPTIONS_LIST}>
              {filteredOptions.length === 0 ? (
                <div className={NO_RESULTS}>نتیجه‌ای یافت نشد</div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.value) === selectedValue;
                  return (
                    <div
                      key={String(opt.value)}
                      role="option"
                      aria-selected={isSelected}
                      className={isSelected ? OPTION_SELECTED : OPTION}
                      onClick={() => handleSelect(String(opt.value))}
                    >
                      {opt.label}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

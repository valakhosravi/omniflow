"use client";
import { Autocomplete, AutocompleteItem, Chip } from "@heroui/react";
import { CloseCircle } from "iconsax-reactjs";
import { useState } from "react";

const units = [
  {
    id: 1,
    title: "واحد منابع انسانی",
    description: "مسئول جذب، آموزش، ارزیابی و مدیریت عملکرد کارکنان شرکت.",
  },
  {
    id: 2,
    title: "واحد مالی",
    description: "مدیریت حسابداری، بودجه‌بندی و کنترل هزینه‌های سازمان.",
  },
  {
    id: 3,
    title: "واحد فناوری اطلاعات",
    description:
      "پشتیبانی از زیرساخت‌های نرم‌افزاری و سخت‌افزاری، توسعه سیستم‌ها و امنیت اطلاعات.",
  },
  {
    id: 4,
    title: "واحد بازاریابی و فروش",
    description:
      "تحلیل بازار، طراحی استراتژی‌های تبلیغاتی و مدیریت ارتباط با مشتریان.",
  },
  {
    id: 5,
    title: "واحد تحقیق و توسعه",
    description: "تمرکز بر نوآوری، بهبود محصولات موجود و توسعه محصولات جدید.",
  },
  {
    id: 6,
    title: "واحد حقوقی",
    description:
      "ارائه مشاوره‌های حقوقی، تنظیم قراردادها و پیگیری مسائل قانونی.",
  },
  {
    id: 7,
    title: "واحد خدمات اداری",
    description: "مدیریت امور پشتیبانی، تدارکات و سرویس‌های عمومی شرکت.",
  },
];
interface unitType {
  id: number;
  title: string;
  description: string;
}

export default function ReferralAutoComplete() {
  const [selectedUnits, setSelectedUnits] = useState<unitType[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSelectionChange = (key: string | number | null) => {
    if (key) {
      const selectedUnit = units.find((unit) => unit.id === Number(key));
      if (selectedUnit) {
        // Check if already selected
        const isAlreadySelected = selectedUnits.find(
          (u: unitType) => u.id === selectedUnit.id
        );

        if (!isAlreadySelected) {
          setSelectedUnits([...selectedUnits, selectedUnit]);
        }
      }
    }
    // Clear the input and close dropdown
    setInputValue("");
  };

  const removeUnit = (unitId: number) => {
    setSelectedUnits(selectedUnits.filter((u: unitType) => u.id !== unitId));
  };

  const availableUnits = units.filter(
    (unit) => !selectedUnits.find((selected) => selected.id === unit.id)
  );

  return (
    <>
      <Autocomplete
        className="w-full flex flex-col"
        items={availableUnits}
        label="ارجاع به واحدها"
        labelPlacement="outside"
        placeholder="واحد های بررسی کننده"
        variant="bordered"
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSelectionChange={handleSelectionChange}
        selectedKey={null} // Always keep it null to allow multiple selections
        popoverProps={{
          offset: 10,
          classNames: {
            content: "shadow-none",
          },
        }}
        inputProps={{
          classNames: {
            label: `font-semibold text-[14px]/[23px] text-secondary-950 mb-[8px]`,
            inputWrapper: `border border-secondary-950/[.2] rounded-[12px]`,
          },
        }}
        classNames={{
          base: `text-sm text-secondary-950`,
          selectorButton: `text-secondary-400`,
          popoverContent: `border border-default-300`,
        }}
      >
        {(unit) => (
          <AutocompleteItem key={unit.id}>{unit.title}</AutocompleteItem>
        )}
      </Autocomplete>
      {selectedUnits.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedUnits.map((unit: unitType) => (
            <Chip
              key={unit.id}
              variant="bordered"
              size="sm"
              endContent={
                <CloseCircle size={17} className="text-secondary-500" />
              }
              onClose={() => removeUnit(unit.id)}
              classNames={{
                base: `border border-primary-950/[.25] rounded-[24px] text-secondary-200 px-[10px] py-[3px] max-w-[93px] gap-x-1
                flex-row-reverse`,
                content: `font-medium text-[12px]/[22px] text-secondary-950 p-0`,
                closeButton: `text-secondary-400`,
              }}
            >
              {unit.title}
            </Chip>
          ))}
        </div>
      )}
    </>
  );
}

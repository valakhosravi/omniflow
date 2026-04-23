"use client";
import { useEffect, useRef, useState } from "react";

export default function Toolbar({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="flex items-start py-[18.5px] px-4 gap-4 justify-between w-full">
      <h1 className="text-[20px]/[28px] font-semibold">{title}</h1>
      <div className="relative">
        <div
          className={`rounded-[12px] transition-all duration-300 ease-in-out ${
            isOpen && "border border-secondary-950/[.2]"
          }`}
        >
          {/* <Input
            isClearable
            type="search"
            onChange={(e) => {
              const value = e.target.value;
              setIsOpen(value.trim() !== "");
            }}
            onFocus={() => setIsOpen(true)}
            onClear={() => {
              setIsOpen(false);
            }}
            placeholder="جستجو ..."
            classNames={{
              base: `w-[493px] h-[49px] transition-all duration-300 ease-in-out ${
                isOpen ? "rounded-t-[12px]" : "rounded-[12px]"
              }`,
              inputWrapper: `!bg-white ${
                !isOpen && "border border-[#D8D9DF]"
              } rounded-[12px] h-[48px] shadow-none`,
            }}
            startContent={
              <SearchNormal1
                className="mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none shrink-0"
                size={20}
              />
            }
          /> */}
        </div>

        {/* <div ref={wrapperRef}>
          <div
            className={`absolute top-[40px] left-0 w-full bg-white border border-secondary-950/[.2]
               border-t-0 rounded-b-[12px] z-50 transition-all duration-300 ease-in-out origin-top
             ${
               isOpen
                 ? "opacity-100 translate-y-0"
                 : "opacity-0 -translate-y-2 pointer-events-none"
             }`}
          >
            <div
              className={`grid grid-cols-2 gap-x-[35px] gap-y-[37px] py-5 px-4 transition-all duration-300 ease-in-out delay-75 ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <PersianDatePicker
                label="از تاریخ"
                width={213}
                height={32}
                cellHeight={30}
                cellWidth={30}
                value={fromDate}
                onChange={(date) => setFilter("fromDate", date)}
              />
              <PersianDatePicker
                label="تا تاریخ"
                width={213}
                height={32}
                cellHeight={30}
                cellWidth={30}
                value={toDate}
                onChange={(date) => setFilter("toDate", date)}
              />
              <ProcessTypeDropDown items={processTypes?.Data ?? []} />
              <StatusTypesDropDown />
              <SearchLabelDropDown items={labels?.Data ?? []} />
            </div>
            <div
              className={`flex justify-end gap-2 px-4 pb-5 transition-all duration-300 ease-in-out delay-100 ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <CustomButton
                buttonVariant="outline"
                buttonSize="xs"
                onClick={handleResetFilters}
              >
                حذف فیلتر
              </CustomButton>
              <CustomButton
                buttonVariant="primary"
                buttonSize="xs"
                onClick={handleApplyFilters}
              >
                جستجو
              </CustomButton>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

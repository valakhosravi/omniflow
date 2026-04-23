"use client";
import { Input } from "@heroui/react";
import { SearchNormal1 } from "iconsax-reactjs";
import { useMemo, useState } from "react";
import ReadyClauseItem from "./ReadyClauseItem";
import { useGetTermLibraryByCategoryId } from "../../../hook/contractHook";
import { useSearchParams } from "next/navigation";
import Loading from "@/ui/Loading";

export default function ReadyMadeClauses() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const { termLibraries, isLoading } = useGetTermLibraryByCategoryId(
    Number(categoryId)
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const filteredLibraries = useMemo(() => {
    if (!searchTerm) return termLibraries;
    return termLibraries.filter(
      (library) =>
        library.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        library.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, termLibraries]);

  return (
    <div className="w-[369px] border border-primary-950/[.1] rounded-[20px] p-4 overflow-y-auto">
      <h1 className="font-semibold text-[20px]/[28px] text-primary-950">
        کتابخانه بند‌های‌ آماده
      </h1>
      <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-[32px]" />
      <div className="flex flex-col justify-center items-center space-y-4">
        <Input
          isClearable
          type="search"
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            setIsOpen(value.trim() !== "");
          }}
          onFocus={() => setIsOpen(true)}
          onClear={() => {
            setSearchTerm("");
            setIsOpen(false);
          }}
          placeholder="جستجو ..."
          classNames={{
            base: `w-full h-[49px] transition-all duration-300 ease-in-out ${
              isOpen ? "rounded-t-[12px]" : "rounded-[12px]"
            }`,
            inputWrapper: `!bg-white border border-[#D8D9DF]
            rounded-[12px] h-[48px] shadow-none`,
          }}
          startContent={
            <SearchNormal1
              className="mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none shrink-0"
              size={20}
            />
          }
        />
        <div
          className="relative z-50 border border-secondary-200 bg-day-title rounded-[8px] p-3 
          text-xs text-primary-950 text-justify space-y-2 leading-relaxed"
        >
          <p>
            برای افزودن بند از کتابخانه، ابتدا <strong>ماده مورد نظر</strong> را
            با کلیک انتخاب کنید، سپس در بخش کتابخانه روی دکمه{" "}
            <strong>افزودن</strong> کلیک نمایید تا بند انتخابی به آن ماده اضافه
            شود.
          </p>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <ReadyClauseItem libraries={filteredLibraries} />
        )}
      </div>
    </div>
  );
}

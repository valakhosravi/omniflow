"use client";
import { AppIcon } from "@/components/common/AppIcon";
import { Textarea } from "@heroui/react";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";

interface AdditionalInformationProps {
  setAdditionalDescription: Dispatch<SetStateAction<string>>;
  additionalDescription: string;
}

export default function AdditionalInformation({
  additionalDescription,
  setAdditionalDescription,
}: AdditionalInformationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const maxLength = 1500;

  const borderColorClass =
    additionalDescription.length === 0
      ? "border-secondary-950/[.2]"
      : additionalDescription.length <= maxLength
        ? "border-accent-100"
        : "border-accent-500";

  useEffect(() => {
    if (contentRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const handleCollapse = () => {
    setIsOpen((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxLength) {
      setAdditionalDescription(e.target.value);
    }
  };

  return (
    <div
      className="border border-secondary-100 rounded-[16px] py-4 p-[12px]
      flex justify-between items-start cursor-pointer"
      onClick={handleCollapse}
    >
      <div className={`${isOpen ? "space-y-4" : ""} w-full`}>
        <div className="flex gap-x-3">
          <div
            className="p-[12.5px] bg-pagination-dropdown rounded-[12px] flex items-center justify-center
            border border-primary-950/[.1] shrink-0"
          >
            <AppIcon name="Task" className="text-primary-950" />
          </div>
          <div>
            <h4 className="font-semibold text-[14px]/[25px] text-secondary-950">
              توضیحات تکمیلی
            </h4>
            <p className="font-medium text-[12px]/[22px] text-secondary-400">
              اگر موردی نیاز است لطفا در این قسمت برای توضیحات تکمیلی اضافه
              کنید.
            </p>
          </div>
        </div>

        <div
          className="transition-all duration-500 ease-in-out overflow-hidden"
          style={{ height: `${height}px` }}
        >
          <div
            ref={contentRef}
            className="px-[12px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Textarea
              name="description"
              fullWidth={true}
              type="text"
              variant="bordered"
              classNames={{
                inputWrapper: `border ${borderColorClass} rounded-[16px]`,
                input:
                  "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px] text-secondary-500 min-h-[200px]",
              }}
              value={additionalDescription}
              onChange={handleChange}
              className="relative"
            />
            <span className="absolute bottom-3 left-7 font-medium text-[12px]/[22px] text-secondary-400">
              {maxLength} / {additionalDescription.length} کاراکتر
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0 ml-2 mt-[30.5px] transition-transform duration-300 ease-in-out">
        {isOpen ? (
          <AppIcon name="ArrowUp2" size={12} className="text-secondary-950" />
        ) : (
          <AppIcon name="ArrowDown2" size={12} className="text-secondary-950" />
        )}
      </div>
    </div>
  );
}

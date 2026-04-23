"use client";

import { Icon } from "@/ui/Icon";
import { Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import {
  colorMap,
  filters,
  UNIT_ITEM_HEIGHT,
  units,
} from "../AppRequestDetails.const";
import { ReviewProps } from "../AppRequestDetails.type";

export default function AppRequestDetailReview({ reviewOfUnits }: ReviewProps) {
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => setShowAll((prev) => !prev);

  return (
    <>
      {reviewOfUnits && (
        <div className="border border-neutral-200 rounded-[20px] p-4 mb-[24px]">
          <div className="flex items-center gap-x-1">
            <h2 className="font-medium text-[16px]/[30px] text-primary-950">
              بررسی واحد‌ها
            </h2>
          </div>
          <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-4" />
          <div
            className="flex flex-col justify-center items-center gap-x-2 mx-auto
            transition-all duration-300 ease-in-out"
          >
            <Tabs
              fullWidth
              classNames={{
                base: `max-w-[500px]`,
                tabList: `bg-transparent border border-primary-950/[.1] p-[4px]`,
                tab: `leading-none`,
                cursor: `shadow-none group-data-[selected=true]:bg-primary-950/[.05] group-data-[selected=true]:border group-data-[selected=true]:border-primary-950/[.1]`,
                tabContent: `group-data-[selected=true]:text-primary-950 text-primary-950/[.5] font-medium text-[14px]/[23px]`,
                panel: `w-full`,
              }}
            >
              {filters.map((filter) => (
                <Tab
                  key={filter.id}
                  title={`${filter.title} (${filter.total}/${filter.count})`}
                >
                  <div className="mt-6 transition-all duration-300 ease-in-out">
                    <div
                      className="space-y-5 overflow-y-hidden 
                      transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: showAll
                          ? `${UNIT_ITEM_HEIGHT * (units?.length || 0)}px`
                          : `${UNIT_ITEM_HEIGHT * 4}px`,
                      }}
                    >
                      {units.map((unit) => {
                        return (
                          <div
                            key={unit.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-x-2">
                              <div className="p-2 bg-white rounded-[8px] border border-primary-950/[.1]">
                                {unit.icon}
                              </div>
                              <div className="font-medium text-primary-950/[.5] text-[14px]/[27px]">
                                {unit.title}
                              </div>
                            </div>
                            <div className="flex items-center gap-x-1">
                              {unit.straps.map((strap) => {
                                const colorClass =
                                  colorMap.find(
                                    (color) => color.id === strap.colorCode
                                  )?.className ?? "bg-gray-200 text-gray-600";

                                return (
                                  <div
                                    key={strap.id}
                                    className={`px-[10px] py-[7px] rounded-[24px] ${colorClass}
                                    font-semibold text-[12px]/[18px]`}
                                  >
                                    {strap.title}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="flex gap-2 text-primary-950 text-[14px] items-center 
                      transition-transform cursor-pointer self-center mx-auto mt-4"
                      onClick={toggleShowAll}
                    >
                      <Icon
                        name="arrowDown"
                        className={`size-[20px] transition-transform duration-300 ${
                          showAll ? "rotate-180" : ""
                        }`}
                      />
                      {showAll ? "کمتر" : "بیشتر"}
                    </button>
                  </div>
                </Tab>
              ))}
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}

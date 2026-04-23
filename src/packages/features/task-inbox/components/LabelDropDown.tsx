import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Tooltip,
} from "@/ui/NextUi";
import React, { useMemo, useState } from "react";
import TagIcon from "./TagIcon";
import { useRequests } from "../hooks/useRequests";
import { LabelType } from "../types/labelType";
import { SearchNormal1 } from "iconsax-reactjs";
import { useGetAllLabelsQuery } from "../api/labelApi";

type labelDropDownModel = {
  pageSize: number;
  pageNumber: number;
  requestId: number;
  LabelColor: string;
};

export default function LabelDropDown({
  pageSize,
  pageNumber,
  requestId,
  LabelColor,
}: labelDropDownModel) {
  const { data: labels } = useGetAllLabelsQuery();
  const { addRequestToLabel } = useRequests({
    pageSize,
    pageNumber,
  });
  const [selectedLabel, setSelectedLabel] = useState<{
    LabelId: number;
    ColorCode: string;
    Name: string;
  } | null>(() => {
    return (
      labels?.Data?.find((l: LabelType) => l.ColorCode === LabelColor) ?? null
    );
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLabels = useMemo(() => {
    if (!labels || !labels.Data) return [];
    if (!searchTerm.trim()) return labels.Data;

    return labels.Data.filter((label: LabelType) =>
      label.Name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [labels, searchTerm]);

  const handleSelect = (label: LabelType) => {
    setSelectedLabel(label);
    addRequestToLabel({ LabelId: label.LabelId, RequestId: requestId });
    setSearchTerm("");
  };

  const triggerColor = selectedLabel?.ColorCode
    ? selectedLabel.ColorCode
    : LabelColor || "#ccced1";

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <Dropdown
      placement="bottom-end"
      className="rounded-[12px] border-secondary-0 shadow-[(-8px_8px_40px_0px_#959DA51F)] p-0 min-w-[201px] w-[201px]"
    >
      <DropdownTrigger className="transition-none !opacity-100 shrink-0">
        <div>
          {selectedLabel ? (
            <Tooltip
              placement="bottom"
              content={selectedLabel.Name}
              closeDelay={300}
              className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px]
          px-[6px] py-[3.5px] rounded-[4px]"
              offset={4}
            >
              <span className="cursor-pointer inline-flex">
                <TagIcon fill={triggerColor} width={20} height={20} />
              </span>
            </Tooltip>
          ) : (
            <span className="cursor-pointer inline-flex">
              <TagIcon fill={triggerColor} width={20} height={20} />
            </span>
          )}
        </div>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="User Menu"
        items={filteredLabels}
        className="space-y-[12px] p-3"
        topContent={
          <Input
            startContent={<SearchNormal1 className="text-secondary-300" />}
            placeholder="جستجو ..."
            value={searchTerm}
            onValueChange={handleSearchChange}
            variant="bordered"
            size="sm"
            classNames={{
              base: "w-auto",
              inputWrapper: `
                bg-white border border-secondary-950/[.2] focus:border-secondary-950/[.4] rounded-[8px] shadow-none`,
              input: `font-medium text-[12px]/[22px] text-secondary-950 placeholder:text-secondary-400`,
            }}
            autoFocus
          />
        }
      >
        {(label) => (
          <DropdownItem key={label.LabelId} onPress={() => handleSelect(label)}>
            <div className="flex items-center gap-2">
              <TagIcon fill={label.ColorCode} />
              <span>{label.Name}</span>
            </div>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

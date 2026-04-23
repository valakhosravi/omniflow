import React from "react";
import { Skeleton } from "@heroui/react";
import { AppIcon } from "../../AppIcon";
import AppInfoRow from "./InfoRow";
import type { DetailRow } from "../AppWorkflowPage.type";

const DEFAULT_SKELETON_ROW_COUNT = 7;

/* ----------------------- Skeleton ----------------------- */

function DetailsListSkeleton({
  title,
  rowCount = DEFAULT_SKELETON_ROW_COUNT,
}: {
  title: string;
  rowCount?: number;
}) {
  return (
    <div
      className={`rounded-[20px] border border-neutral-200 bg-neutral-50 p-4 mb-4`}
    >
      <div className="text-[14px] text-[#1C3A63] font-[500] mb-4 pb-3 border-b border-[#1C3A631A]">
        {title}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div
            key={i}
            className="flex w-full items-center justify-between gap-2"
          >
            <div className="flex w-full min-w-0 items-center gap-2">
              <Skeleton className="h-[32px] w-[32px] shrink-0 rounded-[8px]" />
              <Skeleton
                className="h-4 flex-1 max-w-[140px] rounded"
                style={{ minWidth: 80 }}
              />
            </div>
            <Skeleton className="h-4 w-20 shrink-0 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------- DetailsList ----------------------- */

type DetailsListProps<TData> = {
  title: string;
  rows: DetailRow<TData>[];
  data: TData;
  isLoading?: boolean;
};

export default function DetailsList<TData>({
  title,
  rows,
  data,
  isLoading = false,
}: DetailsListProps<TData>) {
  if (isLoading) {
    return (
      <DetailsListSkeleton
        title={title}
        rowCount={rows.length || DEFAULT_SKELETON_ROW_COUNT}
      />
    );
  }

  return (
    <div
      className={`rounded-[20px] border border-neutral-200 bg-neutral-50 p-4 mb-4`}
    >
      <div className="text-[14px] text-[#1C3A63] font-[500] mb-4 pb-3 border-b border-[#1C3A631A]">
        {title}
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const valueNode =
            typeof row.value === "function" ? row.value({ data }) : row.value;

          return (
            <AppInfoRow
              key={row.key}
              icon={<AppIcon name={row.icon} />}
              title={row.label}
              value={valueNode}
              type={row.type}
            />
          );
        })}
      </div>
    </div>
  );
}

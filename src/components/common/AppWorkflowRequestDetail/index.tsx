"use client";

import React from "react";
import { useDisclosure } from "@heroui/react";
import { Skeleton } from "@/ui/NextUi";
import { useGetRequestByIdQuery, useGetRequestTimelineQuery, useGetLastRequestStatusQuery } from "@/services/commonApi/commonApi";
import { AppIcon } from "../AppIcon";
import { AppButton } from "../AppButton";
import type { AppWorkflowRequestDetailProps, AppWorkflowRequestDetailItem } from "./AppWorkflowRequestDetail.types";
import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";

export type { AppWorkflowRequestDetailItem, AppWorkflowRequestDetailProps } from "./AppWorkflowRequestDetail.types";

/* ----------------------------- Constants ----------------------------- */

const DEFAULT_SKELETON_ITEM_COUNT = 4;

/* ----------------------------- Helpers ----------------------------- */

const formatUpdatedAt = (value?: string | Date) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const [datePart, timePart] = date.toLocaleString("fa-IR").split(", ");
  if (!datePart) return "";
  if (!timePart) return `تاریخ ${datePart}`;

  const [hour, minute] = timePart.split(":");
  if (!hour || !minute) return `تاریخ ${datePart}`;

  return `تاریخ ${datePart} ساعت ${hour}:${minute}`;
};

function buildRequestDetailItems(
  lastRequestStatus: { StatusName?: string; FullName?: string; JobPositionName?: string } | null | undefined,
  requestData: { PersonnelId?: number } | null | undefined,
): AppWorkflowRequestDetailItem[] {
  return [
    {
      id: "status",
      title: "وضعیت درخواست",
      value: lastRequestStatus?.StatusName || "-",
      icon: <AppIcon name="Refresh" size={16} />,
    },
    {
      id: "fullName",
      title: "نام و نام خانوادگی",
      value: lastRequestStatus?.FullName || "-",
      icon: <AppIcon name="User" size={16} />,
    },
    {
      id: "jobPositionName",
      title: "سمت",
      value: lastRequestStatus?.JobPositionName || "-",
      icon: <AppIcon name="Profile2User" size={16} />,
    },
    {
      id: "personnelId",
      title: "کد پرسنلی",
      value: requestData?.PersonnelId ? String(requestData.PersonnelId) : "-",
      icon: <AppIcon name="Card" size={16} />,
    },
  ];
}

/* ----------------------------- Skeleton ----------------------------- */

function AppWorkflowRequestDetailSkeleton({
  itemCount = DEFAULT_SKELETON_ITEM_COUNT,
  stickyTop = 4,
  className = "",
  cardClassName = "",
}: {
  itemCount?: number;
  stickyTop?: number;
  className?: string;
  cardClassName?: string;
}) {
  return (
    <div
      className={`space-y-3 sticky self-start ${className}`.trim()}
      style={{ top: stickyTop }}
    >
      <Skeleton className="h-10 w-full rounded-lg" />
      <div
        className={`border border-neutral-200 rounded-[20px] p-4 ${cardClassName}`.trim()}
      >
        <Skeleton className="h-[30px] w-[200px] rounded" />
        <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-4" />
        <div className="flex flex-col space-y-[20px]">
          {Array.from({ length: itemCount }).map((_, i) => (
            <div key={i} className="flex flex-col gap-y-1">
              <div className="flex justify-between flex-row items-center">
                <div className="flex items-center gap-x-2">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-[8px]" />
                  <Skeleton
                    className="h-[27px] flex-1 max-w-[120px] rounded"
                    style={{ minWidth: 80 }}
                  />
                </div>
                <Skeleton className="h-[27px] w-16 shrink-0 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-[22px] w-[180px] rounded" />
    </div>
  );
}

/* ======================== AppWorkflowRequestDetail ======================== */

/**
 * Self-contained request detail sidebar.
 *
 * Takes only a `requestId` and handles all data fetching and rendering
 * internally: request status items, "updated at" timestamp, request flow
 * button, and the request flow modal.
 */
export default function AppWorkflowRequestDetail({
  requestId,
  title = "آخرین وضعیت درخواست",
  stickyTop = 4,
  className = "",
  cardClassName = "",
}: AppWorkflowRequestDetailProps) {
  const skip = !requestId;

  /* ---- Data fetching ---- */

  const { data: lastRequestStatusResult, isLoading: isStatusLoading } =
    useGetLastRequestStatusQuery(requestId, {
      skip,
      refetchOnMountOrArgChange: true,
    });

  const { data: requestDataResult, isLoading: isRequestLoading } =
    useGetRequestByIdQuery(requestId, { skip });

  const { data: requestTimeline } =
    useGetRequestTimelineQuery(requestId, {
      skip,
      refetchOnMountOrArgChange: true,
    });

  /* ---- Request flow modal ---- */

  const { isOpen: isFlowModalOpen, onOpen: onFlowModalOpen, onOpenChange: onFlowModalOpenChange } =
    useDisclosure();

  /* ---- Derived state ---- */

  const isLoading = !skip && (isStatusLoading || isRequestLoading);
  const lastRequestStatus = lastRequestStatusResult?.Data;
  const requestData = requestDataResult?.Data;

  const items = buildRequestDetailItems(lastRequestStatus, requestData);

  const updatedAt = lastRequestStatus?.CreatedDate || requestData?.CreatedDate;
  const formattedUpdatedAt = formatUpdatedAt(updatedAt);
  const showUpdatedAt = Boolean(formattedUpdatedAt);

  /* ---- Render ---- */

  if (isLoading) {
    return (
      <AppWorkflowRequestDetailSkeleton
        stickyTop={stickyTop}
        className={className}
        cardClassName={cardClassName}
      />
    );
  }

  return (
    <>
      <div
        className={`space-y-3 sticky self-start ${className}`.trim()}
        style={{ top: stickyTop }}
      >
        {/* Request flow button */}
        <div className="flex justify-end">
          <AppButton
            label="مراحل گردش درخواست"
            icon="Refresh"
            size="normal"
            color="primary"
            variant="outline"
            onClick={onFlowModalOpen}
          />
        </div>

        {/* Request detail card */}
        <div
          className={`border border-neutral-200 rounded-[20px] p-4 ${cardClassName}`.trim()}
        >
          <div className="flex items-center gap-x-1">
            <h2 className="font-medium text-[16px]/[30px] text-primary-950">
              {title}
            </h2>
          </div>

          <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-4" />

          <div className="flex flex-col space-y-[20px]">
            {items.map((item, index) => (
              <div key={item.id ?? index} className="flex flex-col gap-y-1">
                <div className="flex justify-between flex-row items-center">
                  <div className="flex items-center gap-x-2">
                    {item.icon && (
                      <div className="p-2 bg-white rounded-[8px] border border-primary-950/[.1]">
                        {item.icon}
                      </div>
                    )}
                    <h6 className="font-medium text-primary-950/[.5] text-[14px]/[27px]">
                      {item.title}
                    </h6>
                  </div>
                  <div className="font-medium text-primary-950 text-[14px]/[27px]">
                    {item.description ?? item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showUpdatedAt && (
          <div className="flex flex-col font-medium text-[12px]/[22px] text-primary-950/[.5]">
            <div className="text-xs text-[#1C3A6380]">
              آخرین بروزرسانی در {formattedUpdatedAt}
            </div>
          </div>
        )}
      </div>

      {/* Request flow modal */}
      <AppRequestFlowModal
        isOpen={isFlowModalOpen}
        onOpenChange={onFlowModalOpenChange}
        requestTimeline={requestTimeline}
      />
    </>
  );
}

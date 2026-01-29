"use client";

import { useMemo, useState } from "react";
import { calculateRowIndex } from "../utils/calculateRowIndex";
import { toRelativeTime } from "../utils/toRelativeTime";
import { Button, useDisclosure } from "@heroui/react";
import { SmsTracking } from "iconsax-reactjs";
import SnoozeDropDown from "./SnoozeDropDown";
import TableTaskInbox from "./TableTaskInbox";
import { toDurationFromNow } from "../utils/toDurationFromNow";
import { UserRequestsTaskModel } from "@/models/camunda-process/GetRequestsByInstanceIds";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import getTasksByFilter from "../hooks/useTasks";
import LabelDropDown from "./LabelDropDown";
import SnoozeModal from "./SnoozeModal";

export default function SnoozeTable() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hoveredRowId, setHoveredRowId] = useState<string | number | null>(
    null
  );
  const [rowRequestId, setRowRequestId] = useState<number | null>();
  const { userDetail } = useAuth();
  const { requestsData, mergedTasks, isLoading } = getTasksByFilter({
    pageNumber: currentPage,
    pageSize: pageSize,
    assignee: Number(userDetail?.UserDetail?.PersonnelId),
    hasSnooze: true,
  });

  const filteredItems = useMemo(() => {
    return mergedTasks.filter((item) => item.SnoozeId !== 0);
  }, [mergedTasks]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleOpenSnoozeModal = (requestId: number) => {
    setRowRequestId(requestId);
    onOpen();
  };

  const headers = [
    {
      key: "index",
      title: "شماره",
      render: (_: any, __: any, index?: number) => {
        if (index === undefined) return 1;
        return calculateRowIndex(currentPage, pageSize, index);
      },
    },
    {
      key: "Label",
      title: "برچسب",
      render: (_: any, row: UserRequestsTaskModel) => {
        return (
          <LabelDropDown
            pageSize={pageSize}
            pageNumber={currentPage}
            requestId={row.requestId}
            LabelColor={row.ColorCode}
          />
        );
      },
    },
    { key: "fullName", title: "اقدام کننده" },
    {
      key: "name",
      title: "نام وظیفه",
      render: (_: any, row: UserRequestsTaskModel) => {
        return <div>{row.name}</div>;
      },
    },
    {
      key: "createdDate",
      title: "زمان یادآوری",
      render: (_: any, row: UserRequestsTaskModel) => {
        const isThisRowHovered = hoveredRowId === String(row.requestId);
        return (
          <div className="relative flex items-center">
            <span
              className={`transition-opacity duration-200 ${
                isThisRowHovered ? "opacity-0" : "opacity-100"
              }`}
            >
              {row.SnoozeId === null
                ? toRelativeTime(row.createdDate)
                : toDurationFromNow(row.SnoozeDate)}
            </span>
            <div
              className={`absolute right-0 flex gap-x-2 transition-all duration-200 ${
                isThisRowHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2 pointer-events-none"
              }`}
            >
              <Button
                isIconOnly
                variant="solid"
                className="!bg-transparent text-secondary-400 hover:bg-pagination-dropdown p-2"
              >
                <SmsTracking size={16} />
              </Button>
              <SnoozeDropDown
                requestId={row.requestId}
                snoozeId={row.SnoozeId}
                onOpenSnoozeModal={() => handleOpenSnoozeModal(row.requestId)}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-4 py-3">
      <TableTaskInbox
        data-cy="task-inbox-snooze-table"
        headers={headers}
        isLoading={isLoading}
        rows={mergedTasks ?? []}
        totalPages={requestsData?.Data?.TotalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={requestsData?.Data?.TotalCount ?? 0}
        onPageSizeChange={handlePageSizeChange}
        setIsHovered={setHoveredRowId}
      />
      <SnoozeModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        requestId={rowRequestId}
      />
    </div>
  );
}

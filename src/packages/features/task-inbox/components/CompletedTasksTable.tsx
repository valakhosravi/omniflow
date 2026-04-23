"use client";
import React, { useState } from "react";
import { useCompletedTasks } from "../hooks/useCompletedTasks";
import { calculateRowIndex } from "../utils/calculateRowIndex";
import { CompletedTask } from "@/models/camunda-process/GetCompletedTasks";
import TableTaskInbox from "./TableTaskInbox";
import { useRouter } from "next/navigation";
import { toLocalDateTimeShort } from "@/utils/dateFormatter";
import pascalToKebab from "@/utils/pascalToSnake";

export default function CompletedTasksTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { completedTasks, isLoading } = useCompletedTasks({
    pageNumber: currentPage,
    pageSize: pageSize,
    SortColumn: "CreatedDate",
    SortDirection: "DESC",
  });
  const [, setHoveredRowId] = useState<string | number | null>(null);

  // Calculate pagination for completed tasks
  const totalCount = completedTasks.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTasks = completedTasks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
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
      key: "ProcessTypeName",
      title: "نوع درخواست",
      render: (_: any, row: CompletedTask) => {
        return row.ProcessTypeName;
      },
    },
    {
      key: "Title",
      title: "عنوان",
      render: (_: any, row: CompletedTask) => {
        return row.Title;
      },
    },
    {
      key: "RequestCreatorName",
      title: "ایجادکننده",
      render: (_: any, row: CompletedTask) => {
        return row.RequestCreatorName;
      },
    },
    {
      key: "TrackingCode",
      title: "کد پیگیری",
      render: (_: any, row: CompletedTask) => {
        return row.TrackingCode;
      },
    },
    {
      key: "StatusDate",
      title: "تاریخ تکمیل",
      render: (_: any, row: CompletedTask) => {
        return (
          <div className={"text-medium "}>
            {toLocalDateTimeShort(row.StatusDate)}
          </div>
        );
      },
    },
    {
      key: "StatusName",
      title: "وضعیت نهایی",
      render: (_: any, row: CompletedTask) => {
        return (
          <div className="flex items-center gap-x-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                "رد درخواست" === row.StatusName
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {row.StatusName}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-4 py-3">
      <TableTaskInbox
        data-cy="completed-tasks-table"
        onRowClick={(row) => {
          const id = row.RequestId;
          const processName = row.ProcessName;
          const version = row.Version;

          const searchParams = new URLSearchParams({
            requestId: id,
          });

          if (processName === "Bug") {
            router.push(`/support/bug/v1/follow-up?${searchParams.toString()}`);
          } else if (processName === "EmploymentCertificate") {
            router.push(
              `/human-resource/employment-certificate/v1/follow-up?${searchParams.toString()}`,
            );
          } else if (processName === "Report") {
            router.push(`/Report/BI/v1/follow-up?${searchParams.toString()}`);
            return;
          } else if (processName === "Contract") {
            router.push(
              `/issue/contract/v1/follow-up?${searchParams.toString()}`,
            );
            return;
          } else if (processName === "Development") {
            router.push(
              `/product/development/v1/follow-up?${searchParams.toString()}`,
            );
            return;
          } else if (processName === "InvoicePayment") {
            router.push(
              `/invoice/payment/v1/follow-up?${searchParams.toString()}`,
            );
          } else if (processName === "SalaryDedution") {
            router.push(
              `/${pascalToKebab(processName)}/V${version}/follow-up?${searchParams.toString()}`,
            );
          } else {
            router.push(
              `/task-inbox/${processName}/V${version}/follow-up/${id}`,
            );
          }
          router.push(
            `/task-inbox/${processName}/V${version}/follow-up/${id}`,
          );
        }}
        headers={headers}
        isLoading={isLoading}
        rows={paginatedTasks}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageSizeChange={handlePageSizeChange}
        setIsHovered={setHoveredRowId}
      />
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { useRequests } from "../hooks/useRequests";
import { calculateRowIndex } from "../utils/calculateRowIndex";
import { GetUserRequests } from "@/models/camunda-process/GetRequests";
import LabelDropDown from "./LabelDropDown";
import TableTaskInbox from "./TableTaskInbox";
import StatusBadge from "./StatusBadge";
import { useRouter } from "next/navigation";
import { toLocalDateTimeShort } from "@/utils/dateFormatter";
import pascalToKebab from "@/utils/pascalToSnake";

export default function RequestTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { requests, isLoading } = useRequests({
    pageNumber: currentPage,
    pageSize: pageSize,
    SortColumn: "CreatedDate",
    SortDirection: "DESC",
  });
  const [, setHoveredRowId] = useState<string | number | null>(null);

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
      key: "Label",
      title: "برچسب",
      render: (_: any, row: GetUserRequests) => {
        return (
          <LabelDropDown
            pageSize={pageSize}
            pageNumber={currentPage}
            requestId={row.RequestId}
            LabelColor={row.LabelColor}
          />
        );
      },
    },
    {
      key: "ProcessTypeName",
      title: "نوع درخواست",
      render: (_: any, row: GetUserRequests) => {
        return row.ProcessTypeName;
      },
    },
    {
      key: "Title",
      title: "عنوان",
      render: (_: any, row: GetUserRequests) => {
        return row.Title;
      },
    },
    {
      key: "Title",
      title: "تاریخ درخواست",
      render: (_: any, row: GetUserRequests) => {
        return (
          <div className={"text-medium "}>
            {toLocalDateTimeShort(row.CreatedDate)}
          </div>
        );
      },
    },
    {
      key: "StatusName",
      title: "وضعیت",
      render: (_: any, row: GetUserRequests) => {
        return <StatusBadge request={row} />;
      },
    },
    {
      key: "inCharge",
      title: "مسئول مربوطه",
      render: (_: any, row: GetUserRequests) => {
        return (
          <div className="flex items-center gap-x-1">
            <span>{row.FullName}</span>
            <span className="text-[13px] font-light text-primary-950/[.7]">
              ({row.JobPositionName})
            </span>
          </div>
        );
      },
    },
  ];

  //توسط <span>{request.JobPositionName}</span>

  return (
    <div className="px-4 py-3">
      <TableTaskInbox
        data-cy="task-inbox-requests-table"
        onRowClick={(row) => {
          const id = row.RequestId;
          const processName = row.ProcessName;
          const version = row.Version;
          const searchParams = new URLSearchParams({
            requestId: id,
          });

          console.log('processName', processName)
          if (processName === "Bug") {
            router.push(`/support/bug/v1/follow-up?${searchParams.toString()}`);
            return;
          } else if (processName === "EmploymentCertificate") {
            router.push(
              `/human-resource/employment-certificate/v1/follow-up?${searchParams.toString()}`,
            );
            return;
          } else if (processName === "Report") {
            router.push(`/Report/BI/v1/follow-up?${searchParams.toString()}`);
            return;
          } else if (processName === "Development") {
            if (Number(version) < 3) {
              router.push(
                `/product/development/v1/follow-up/${id}?${searchParams.toString()}`,
              );
              return;
            } else {
              router.push(
                `/product/development/v2/follow-up/${id}?${searchParams.toString()}`,
              );
              return;
            }
          } else if (processName === "SalaryAdvanceRequest") {
            router.push(
              `/loan/salary-advance/v1/follow-up?${searchParams.toString()}`,
            );
            return;
          } else if (processName === "Contract") {
            router.push(
              `/issue/contract/v1/follow-up?${searchParams.toString()}`,
            );
            return;
          } else if (processName === "InvoicePayment") {
            router.push(
              `/invoice/payment/v1/follow-up?${searchParams.toString()}`,
            );
            return;
          } else if (processName === "SalaryDeduction") {
            router.push(
              `/human-resource/${pascalToKebab(processName)}/v1/follow-up?${searchParams.toString()}`,
            );
          } else {
            router.push(
              `/task-inbox/${processName}/V${version}/follow-up/${id}`,
            );
            return;
          }
        }}
        headers={headers}
        isLoading={isLoading}
        rows={requests?.Data?.Items ?? []}
        totalPages={requests?.Data?.TotalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={requests?.Data?.TotalCount ?? 0}
        onPageSizeChange={handlePageSizeChange}
        setIsHovered={setHoveredRowId}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { calculateRowIndex } from "../utils/calculateRowIndex";
import TableTaskInbox from "./TableTaskInbox";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import LabelDropDown from "./LabelDropDown";
import getTasksByFilter from "../hooks/useTasks";
import { UserRequestsTaskModel } from "@/models/camunda-process/GetRequestsByInstanceIds";
import { toLocalDateTimeShort } from "@/utils/dateFormatter";
import { toRelativeTime } from "../utils/toRelativeTime";
import { Button, useDisclosure } from "@heroui/react";
import { SmsTracking } from "iconsax-reactjs";
import SnoozeDropDown from "./SnoozeDropDown";
import { TaskFilter } from "@/constants/task-filter";
import { useRouter } from "next/navigation";
import SnoozeModal from "./SnoozeModal";
import {
  useGetUnreadQuery,
  useUpdateGroupIsReadMutation,
  useUpdateIsReadMutation,
} from "../api/ReadApi";
import { GetUnRead } from "../types/UnReadTasks";
import pascalToKebab from "@/utils/pascalToSnake";

interface TaskTableProps {
  type: TaskFilter;
}

export default function TaskTable({ type }: TaskTableProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hoveredRowId, setHoveredRowId] = useState<string | number | null>(
    null,
  );
  const [rowRequestId, setRowRequestId] = useState<number | null>();
  const { userDetail } = useAuth();
  const router = useRouter();
  const { mergedTasks, requestsData, isLoading } = getTasksByFilter({
    pageNumber: currentPage,
    pageSize: pageSize,
    candidateGroup:
      type === TaskFilter.CandidateGroup
        ? userDetail?.UserDetail?.GroupKeys
        : undefined,
    assignee:
      type === TaskFilter.Assignee
        ? Number(userDetail?.UserDetail?.PersonnelId)
        : undefined,
  });
  const [updateIsRead] = useUpdateIsReadMutation();
  const [updateGroupIsRead] = useUpdateGroupIsReadMutation();
  const { data: unReadTasks, refetch } = useGetUnreadQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

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

  const rowsWithUnread = (mergedTasks ?? []).map((task) => ({
    ...task,
    isRead: unReadTasks?.Data?.some(
      (x: GetUnRead) => x.RequestId === task.requestId,
    ),
  }));

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
      title: "تاریخ درخواست",
      render: (_: any, row: any) => {
        return (
          <div className={"text-medium "}>
            {toLocalDateTimeShort(row.createdDate)}
          </div>
        );
      },
    },
    {
      key: "submitDate",
      title: "زمان ثبت",
      render: (_: any, row: UserRequestsTaskModel) => {
        const isThisRowHovered = hoveredRowId === String(row.requestId);
        return (
          <div className="relative flex items-center">
            <span
              className={`text-secondary-400 transition-opacity duration-200 ${
                isThisRowHovered ? "opacity-0" : "opacity-100"
              }`}
            >
              {toRelativeTime(row.createdDate)}
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
        data-cy="task-inbox-task-table"
        onRowClick={(row) => {
          const id = row.requestId;
          const formName = row.formName;
          const processName = row.processName;
          const version = row.version;
          const searchParams = new URLSearchParams({
            taskId: row.taskId,
            requestId: id,
          });
          if (type === TaskFilter.Assignee) {
            updateIsRead({
              UserId: userDetail?.UserDetail.UserId ?? 0,
              RequestId: id ?? 0,
            }).then(() => refetch());
          } else if (type === TaskFilter.CandidateGroup) {
            updateGroupIsRead({
              GroupKey: userDetail?.UserDetail.GroupKeys[0] ?? "",
              RequestId: id ?? 0,
            }).then(() => refetch());
          }

          if (processName === "Bug") {
            router.push(
              `/support/bug/v1/${formName}?${searchParams.toString()}`,
            );
            return;
          } else if (processName === "EmploymentCertificate") {
            router.push(
              `/human-resource/employment-certificate/v1/employement-certificate-hr-print?${searchParams.toString()}`,
            );
            return;
          } else if (processName === "Report") {
            router.push(`/Report/BI/v1/${formName}?${searchParams.toString()}`);
            return;
          } else if (processName === "Development") {
            if (Number(version) < 3) {
              router.push(
                `/product/development/v1/${formName}?${searchParams.toString()}`,
              );
              return;
            } else {
              router.push(
                `/product/development/v2/${formName}?${searchParams.toString()}`,
              );
              return;
            }
          } else if (processName === "SalaryAdvanceRequest") {
            router.push(
              `/loan/salary-advance/v1/${formName}?${searchParams.toString()}`,
            );
            return;
          } else if (processName === "Contract") {
            router.push(
              `/issue/contract/v1/${formName}?${searchParams.toString()}`,
            );
            return;
          } else if (processName === "InvoicePayment") {
            router.push(
              `/invoice/payment/v1/${formName}?${searchParams.toString()}`,
            );
          } else if (processName === "SalaryDeduction") {
            router.push(
              `/human-resource/${pascalToKebab(processName)}/v${version}/${formName}?${searchParams.toString()}`,
            );
          } else {
            router.push(
              `/task-inbox/${processName}/v${version}/${formName}/${id}?${searchParams.toString()}`,
            );
            return;
          }
        }}
        headers={headers}
        isLoading={isLoading}
        rows={rowsWithUnread}
        totalPages={requestsData?.Data?.TotalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={requestsData?.Data?.TotalCount ?? 0}
        onPageSizeChange={handlePageSizeChange}
        setIsHovered={setHoveredRowId}
        name="Task"
      />
      <SnoozeModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        requestId={rowRequestId}
      />
    </div>
  );
}

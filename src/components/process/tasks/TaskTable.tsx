import { UserRequestsTaskModel } from "@/models/camunda-process/GetRequestsByInstanceIds";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/NextUi";
import { FaRegEye } from "react-icons/fa6";
import { toLocalDateTimeShort } from "@/utils/dateFormatter";
import useEmployeeRequestStore from "@/store/EmployeeStore";
import TableTop from "@/components/TableTop";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface TaskTableProps {
  currentPage: number;
  items: UserRequestsTaskModel[];
  isLoading: boolean;
  data?: any;
  totalPages: number;
  isGroupTask: boolean;
  onPageChange?: (page: number) => void;
}

export default function TaskTable({
  items,
  isLoading,
  totalPages,
  isGroupTask,
}: TaskTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const queryClient = useQueryClient();

  const calculateRowIndex = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      queryClient.removeQueries({
        queryKey: ["GetRequests", currentPage, pageSize],
      });

      setCurrentPage(page);
    }
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  const { setRequest } = useEmployeeRequestStore();

  const router = useRouter();

  const headers = [
    {
      key: "index",
      title: "#",
      render: (_: any, __: any, index?: number) => {
        if (index === undefined) return 1;
        return calculateRowIndex(index);
      },
    },
    { key: "fullName", title: "اقدام کننده" },
    {
      key: "name",
      title: "نوع درخواست ",
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
      key: "Operation",
      title: "عملیات",
      render: (_: any, row: any) => {
        return (
          <Button
            isIconOnly
            color="primary"
            size="md"
            className=""
            onPress={() => {
              sessionStorage.setItem("isGroupTask", isGroupTask.toString());
              setRequest(row);
              router.push(`/${row.formName.toLowerCase()}`);
            }}
          >
            <FaRegEye size={18} />
          </Button>
        );
      },
    },
  ];

  return (
    <TableTop
      headers={headers}
      isLoading={isLoading}
      rows={items}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      pageSize={pageSize}
      totalCount={1}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}

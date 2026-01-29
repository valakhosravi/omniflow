import TableTop from "@/components/TableTop";
import {
  useClearRequest,
  useGetUserRequests,
} from "@/hooks/process/useProcess";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { Button, useDisclosure } from "@/ui/NextUi";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { GetUserRequests } from "@/models/camunda-process/GetRequests";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { ClearRequestBody } from "@/models/camunda-process/ClearRequestBody";

export default function RequestTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { userRequests, isGetting } = useGetUserRequests(currentPage, pageSize);
  const items = userRequests?.data?.Data?.Items ?? [];
  const queryClient = useQueryClient();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleDelete = (id: string) => {
    setSelectedId(id);
    onDeleteOpen();
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { clearRequest, isClearing } = useClearRequest();

  const confirmDelete = async (instanceId: string) => {
    onDeleteClose();

    const queryKey = ["GetRequests", currentPage, pageSize];
    const previousData = queryClient.getQueryData<any>(queryKey);
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.Data?.Items) return oldData;
      return {
        ...oldData,
        Data: {
          ...oldData.Data,
          Items: oldData.Data.Items.filter(
            (item: GetUserRequests) => item.InstanceId !== instanceId
          ),
        },
      };
    });

    try {
      const payload: ClearRequestBody = {
        processInstanceId: instanceId,
        messageName: "TerminateRequest",
      };

      await clearRequest(payload);
    } catch (error: any) {
      queryClient.setQueryData(queryKey, previousData);
    }
  };

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

  const headers = [
    {
      key: "index",
      title: "#",
      render: (_: any, __: any, index?: number) => {
        if (index === undefined) return 1;
        return calculateRowIndex(index);
      },
    },
    { key: "FullName", title: "اقدام کننده" },
    {
      key: "ProcessTypeName",
      title: "نوع درخواست ",
    },
    {
      key: "StatusName",
      title: "وضعیت",
    },
    {
      key: "CreatedDate",
      title: "تاریخ درخواست",
      render: (_: any, row: any) => {
        return toLocalDateShort(row.CreatedDate);
      },
    },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: any, row: GetUserRequests) =>
        row.CanBeCanceled && (
          <Button
            isIconOnly
            color="danger"
            variant="ghost"
            size="md"
            onPress={() => handleDelete(row.InstanceId)}
          >
            <ImCross size={15} />
          </Button>
        ),
    },
  ];

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <>
      <TableTop
        headers={headers}
        isLoading={isGetting}
        rows={items}
        totalPages={userRequests?.data.Data?.TotalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={10}
        totalCount={userRequests?.data.Data?.TotalCount ?? 0}
        onPageSizeChange={handlePageSizeChange}
      />
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={() => confirmDelete(selectedId)}
          isLoading={isClearing}
          itemId={selectedId}
        />
      )}
    </>
  );
}

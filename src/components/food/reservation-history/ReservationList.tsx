"use client";
import TableTop from "@/components/TableTop";
import { useDeleteOrder, useOrderList } from "@/hooks/food/useOrderAction";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { Button, useDisclosure } from "@/ui/NextUi";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin7Line } from "react-icons/ri";
import { BiShow } from "react-icons/bi";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { useRouter } from "next/navigation";
import { addToaster } from "@/ui/Toaster";

export default function ReservationList() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { orderData, isGetting } = useOrderList(currentPage, pageSize);
  const { deleteOrder, isDeleting } = useDeleteOrder();
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const calculateRowIndex = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      queryClient.removeQueries({
        queryKey: ["planList", currentPage, pageSize],
      });

      setCurrentPage(page);
    }
  };

  const handleDelete = (id: number) => {
    setSelectedDeleteId(id);
    onOpen();
  };

  const handleShow = (id: number) => {
    router.push(`/food/reservation-history/preview/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/food/reservation?id=${id}`);
  };

  const confirmDelete = async (id: number) => {
    const previousData = queryClient.getQueryData([
      "orderList",
      currentPage,
      pageSize,
    ]);

    queryClient.setQueryData(
      ["orderList", currentPage, pageSize],
      (oldData: any) => {
        if (!oldData?.Data?.Items) return oldData;
        return {
          ...oldData,
          Data: {
            ...oldData.Data,
            Items: oldData.Data.Items.filter(
              (item: any) => item.OrderId !== id
            ),
          },
        };
      }
    );

    deleteOrder(
      { OrderId: id, DailyMealIds: [] },
      {
        onSuccess: (response) => {
          if (response.ResponseCode === 100) {
            onClose();
          } else if (response.ResponseCode === 105) {
            addToaster({
              title: response.ResponseMessage,
              color: "danger",
            });
            onClose();
          } else {
            queryClient.setQueryData(
              ["orderList", currentPage, pageSize],
              previousData
            );
            addToaster({
              title: response.ResponseMessage,
              color: "danger",
            });
          }
        },
        onError: () => {
          queryClient.setQueryData(
            ["orderList", currentPage, pageSize],
            previousData
          );
        },
      }
    );
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
    { key: "PlanName", title: "نام برنامه" },
    {
      key: "StartDate",
      title: "تاریخ شروع",
      render: (_: any, row: any) => {
        return toLocalDateShort(row.StartDate);
      },
    },
    {
      key: "EndDate",
      title: "تاریخ پایان",
      render: (_: any, row: any) => {
        return toLocalDateShort(row.EndDate);
      },
    },
    {
      key: "CreatedDate",
      title: "تاریخ ایجاد",
      render: (_: any, row: any) => {
        return toLocalDateShort(row.CreatedDate);
      },
    },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button
            isIconOnly
            size="sm"
            color="danger"
            variant="ghost"
            onPress={() => handleDelete(row.OrderId)}
          >
            <RiDeleteBin7Line />
          </Button>

          <Button
            isIconOnly
            size="sm"
            color="primary"
            variant="ghost"
            onPress={() => handleEdit(row.OrderId)}
          >
            <FaRegEdit />
          </Button>
          <Button
            isIconOnly
            size="sm"
            color="secondary"
            variant="ghost"
            onPress={() => handleShow(row.OrderId)}
          >
            <BiShow className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <TableTop
        headers={headers}
        isLoading={isGetting}
        rows={orderData?.Data?.Items || []}
        currentPage={currentPage}
        totalPages={orderData?.Data?.TotalPages || 1}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        totalCount={orderData?.Data?.TotalCount || 0}
        onPageSizeChange={() => {}}
      />
      {selectedDeleteId !== null && (
        <DeleteConfirmModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={() => confirmDelete(selectedDeleteId)}
          isLoading={isDeleting}
          itemId={selectedDeleteId}
        />
      )}
    </>
  );
}

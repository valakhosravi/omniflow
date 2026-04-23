"use client";

import TableTop from "@/components/TableTop";
import {
  useDeleteSupplier,
  useGetSupplierList,
} from "@/hooks/food/useSupplierAction";
import { useDisclosure } from "@/ui/NextUi";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import { Icon } from "@/ui/Icon";
import { addToaster } from "@/ui/Toaster";

type SupplierListProps = {
  onEdit: (id: number) => void;
};

export default function SupplierList({ onEdit }: SupplierListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { supplierData, isSupplierLoading } = useGetSupplierList(
    currentPage,
    pageSize
  );
  const { deletePending, deleteMutation } = useDeleteSupplier();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const handleDelete = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      queryClient.removeQueries({
        queryKey: ["supplier-list", currentPage, pageSize],
      });

      setCurrentPage(page);
    }
  };

  const calculateRowIndex = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const confirmDelete = async (id: number) => {
    const previousData = queryClient.getQueryData([
      "supplierList",
      currentPage,
      pageSize,
    ]);

    queryClient.setQueryData(
      ["supplierList", currentPage, pageSize],
      (oldData: any) => {
        if (!oldData?.Data?.Items) return oldData;
        return {
          ...oldData,
          Data: {
            ...oldData.Data,
            Items: oldData.Data.Items.filter(
              (item: any) => item.SupplierId !== id
            ),
          },
        };
      }
    );

    deleteMutation(id, {
      onSuccess: (response) => {
        if (response.ResponseCode === 100) {
          onClose();
        } else {
          queryClient.setQueryData(
            ["supplierList", currentPage, pageSize],
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
          ["supplierList", currentPage, pageSize],
          previousData
        );
      },
    });
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const headers = [
    {
      key: "index",
      title: "شماره",
      render: (_: any, __: any, index?: number) => {
        if (index === undefined) return 1;
        return calculateRowIndex(index);
      },
    },
    { key: "Name", title: "نام تامین کننده" },
    { key: "Phone", title: "تلفن" },
    { key: "Address", title: "آدرس" },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: any, row: any) => {
        const items = [
          {
            key: "edit",
            label: "ویرایش",
            icon: <Icon name="edit" className="size-[20px]" />,
            onClick: () => onEdit(row.SupplierId),
          },
          {
            key: "delete",
            label: "حذف",
            icon: <Icon name="trash" className="size-[20px]" />,
            color: "#ff1751",
            onClick: () => handleDelete(row.SupplierId),
          },
        ].filter(Boolean);

        return <OperationDropdown items={items as DropdownAction[]} />;
      },
    },
  ];

  return (
    <>
      <TableTop
        headers={headers}
        rows={supplierData?.Data?.Items || []}
        isLoading={isSupplierLoading}
        totalPages={supplierData?.Data?.TotalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={supplierData?.Data?.TotalCount ?? 0}
        onPageSizeChange={handlePageSizeChange}
      />

      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={() => confirmDelete(selectedId)}
          isLoading={deletePending}
          itemId={selectedId}
        />
      )}
    </>
  );
}

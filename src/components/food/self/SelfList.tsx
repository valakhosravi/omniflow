"use client";

import TableTop from "@/components/TableTop";
import { useDeleteSelf, useSelfList } from "@/hooks/food/useSelfAction";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { Icon } from "@/ui/Icon";
import { useDisclosure } from "@/ui/NextUi";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import { addToaster } from "@/ui/Toaster";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type SelfListProps = {
  onEdit: (id: number) => void;
};

export default function SelfList({ onEdit }: SelfListProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { deleteSelf, isDeleting } = useDeleteSelf();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { selfData, isGetting } = useSelfList(currentPage, pageSize);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      queryClient.removeQueries({
        queryKey: ["selfList", currentPage, pageSize],
      });

      setCurrentPage(page);
    }
  };

  const calculateRowIndex = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  const confirmDelete = async (id: number) => {
    const previousData = queryClient.getQueryData([
      "selfList",
      currentPage,
      pageSize,
    ]);

    queryClient.setQueryData(
      ["selfList", currentPage, pageSize],
      (oldData: any) => {
        if (!oldData?.Data?.Items) return oldData;
        return {
          ...oldData,
          Data: {
            ...oldData.Data,
            Items: oldData.Data.Items.filter((item: any) => item.SelfId !== id),
          },
        };
      }
    );

    deleteSelf(id, {
      onSuccess: (response) => {
        if (response.ResponseCode === 100) {
          onClose();
          addToaster({
            title: response.ResponseMessage,
            color: "success",
          });
        } else {
          queryClient.setQueryData(
            ["selfList", currentPage, pageSize],
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
          ["selfList", currentPage, pageSize],
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
    { key: "Name", title: "نام" },
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
            onClick: () => onEdit(row.SelfId),
          },
          {
            key: "delete",
            label: "حذف",
            icon: <Icon name="trash" className="size-[20px]" />,
            color: "#ff1751",
            onClick: () => handleDelete(row.SelfId),
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
        rows={selfData?.Data?.Items || []}
        isLoading={isGetting}
        totalPages={selfData?.Data?.TotalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={selfData?.Data?.TotalCount ?? 0}
        onPageSizeChange={handlePageSizeChange}
      />
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={() => confirmDelete(selectedId)}
          isLoading={isDeleting}
          itemId={selectedId}
        />
      )}
    </>
  );
}

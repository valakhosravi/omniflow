"use client";
import TableTop from "@/components/TableTop";
import { calculateRowIndex } from "@/packages/features/task-inbox/utils/calculateRowIndex";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { Icon } from "@/ui/Icon";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import { useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useDeleteContractorMutation,
  useGetContractorsQuery,
} from "../contractor.services";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { CategoryDetails, ContractorDetails } from "../contractors.type";

interface ContractorsTableProps {
  searchTerm?: string;
  handleEdit: (id: number) => void;
  categories: GeneralResponse<CategoryDetails[]> | undefined;
}

export default function ContractorsTable({
  searchTerm,
  handleEdit,
  categories,
}: ContractorsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();
  const { data: contractors, isLoading } = useGetContractorsQuery({
    PageNumber: currentPage,
    PageSize: pageSize,
    ...(searchTerm?.trim() ? { SearchTerm: searchTerm } : {}),
  });
  const [deleteContractor, { isLoading: isDeleting }] =
    useDeleteContractorMutation();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    onDeleteOpen();
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
      key: "Name",
      title: <div className="flex items-center gap-1">نام پیمانگار</div>,
    },
    {
      key: "mobile",
      title: "شماره تلفن",
      render: (_: any, row: ContractorDetails) => {
        return row.Mobile;
      },
    },
    {
      key: "categoryId",
      title: "دسته",
      render: (_: any, row: ContractorDetails) => {
        const category =
          categories?.Data &&
          categories?.Data.find((c) => {
            return c.CategoryId === row.CategoryId;
          });
        return category?.Name;
      },
    },
    {
      key: "address",
      title: "آدرس",
      render: (_: any, row: ContractorDetails) => {
        return row.Address;
      },
    },
    {
      key: "VatendDate",
      title: "آخرین همکاری",
      render: (_: any, row: ContractorDetails) => {
        return row.LastCollabrationDate === null
          ? "-"
          : toLocalDateShort(row.LastCollabrationDate);
      },
    },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: any, row: ContractorDetails) => {
        const items = [
          {
            key: "edit",
            label: "ویرایش",
            icon: <Icon name="edit" className="size-[20px]" />,
            onClick: () => handleEdit(row.ContractorId),
          },
          {
            key: "delete",
            label: "حذف",
            color: "#e53935",
            icon: <Icon name="trash" className="size-[20px]" />,
            onClick: () => handleDelete(row.ContractorId),
          },
        ].filter(Boolean);
        return <OperationDropdown items={items as DropdownAction[]} />;
      },
    },
  ];

  const confirmDelete = async (selectedId: number) => {
    deleteContractor(selectedId).then(() => {
      onDeleteClose();
    });
  };

  return (
    <>
      <TableTop
        headers={headers}
        isLoading={isLoading}
        rows={contractors?.Data?.Items ?? []}
        totalPages={contractors?.Data?.TotalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={contractors?.Data?.TotalCount ?? 0}
        onPageSizeChange={handlePageSizeChange}
        onRowClick={(row: ContractorDetails) => {
          router.push(
            `/invoice/contractors/v1/projects?contractorId=${row.ContractorId}`,
          );
        }}
      />
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={() => confirmDelete(selectedId)}
          isLoading={isDeleting}
          itemId={selectedId}
        />
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { AppIcon } from "@/components/common/AppIcon";
import TableTop from "@/components/TableTop";
import { useDisclosure } from "@/ui/NextUi";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import {
  useDeleteTeacherMutation,
  useGetAllTeachersQuery,
} from "../learning.services";
import type { TeacherDto } from "../learning.types";

interface TeacherTableProps {
  onEdit: (id: number) => void;
}

export default function TeacherTable({ onEdit }: TeacherTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: teachersData, isLoading } = useGetAllTeachersQuery();
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const allTeachers = teachersData?.Data ?? [];
  const totalCount = allTeachers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedRows = allTeachers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  const confirmDelete = async (id: number) => {
    await deleteTeacher(id);
    onClose();
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const calculateRowIndex = (index: number) =>
    (currentPage - 1) * pageSize + index + 1;

  const headers = [
    {
      key: "index",
      title: "شماره",
      render: (_: unknown, __: unknown, index?: number) =>
        index !== undefined ? calculateRowIndex(index) : 1,
    },
    { key: "FullName", title: "نام مدرس" },
    { key: "Mobile", title: "موبایل" },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: unknown, row: TeacherDto) => {
        const items: DropdownAction[] = [
          {
            key: "edit",
            label: "ویرایش",
            icon: <AppIcon name="Edit" size={20} />,
            onClick: () => onEdit(row.TeacherId),
          },
          {
            key: "delete",
            label: "حذف",
            icon: <AppIcon name="Trash" size={20} />,
            color: "danger",
            onClick: () => handleDelete(row.TeacherId),
          },
        ];
        return <OperationDropdown items={items} />;
      },
    },
  ];

  return (
    <>
      <TableTop
        headers={headers}
        rows={paginatedRows}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={totalCount}
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

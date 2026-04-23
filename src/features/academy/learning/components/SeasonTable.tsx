"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TableTop from "@/components/TableTop";
import { useDisclosure, Chip } from "@/ui/NextUi";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import { Icon } from "@/ui/Icon";
import {
  useGetSeasonsByCourseIdQuery,
  useDeleteSeasonMutation,
} from "../learning.services";
import type { SeasonDto } from "../learning.types";

interface SeasonTableProps {
  courseId: number;
  onEdit: (id: number) => void;
}

export default function SeasonTable({ courseId, onEdit }: SeasonTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: seasonsData, isLoading } =
    useGetSeasonsByCourseIdQuery(courseId);
  const [deleteSeason, { isLoading: isDeleting }] = useDeleteSeasonMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const allSeasons = seasonsData?.Data ?? [];
  const totalCount = allSeasons.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedRows = allSeasons.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  const confirmDelete = async (id: number) => {
    await deleteSeason(id);
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
    { key: "Title", title: "عنوان فصل" },
    { key: "OrderNumber", title: "ترتیب" },
    {
      key: "IsActive",
      title: "وضعیت",
      render: (_: unknown, row: SeasonDto) => (
        <Chip
          size="sm"
          variant="flat"
          color={row.IsActive ? "success" : "danger"}
        >
          {row.IsActive ? "فعال" : "غیرفعال"}
        </Chip>
      ),
    },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: unknown, row: SeasonDto) => {
        const items: DropdownAction[] = [
          {
            key: "edit",
            label: "ویرایش",
            icon: <Icon name="edit" className="size-[20px]" />,
            onClick: () => onEdit(row.SeasonId),
          },
          {
            key: "sections",
            label: "مدیریت بخش‌ها",
            icon: <Icon name="eye" className="size-[20px]" />,
            onClick: () =>
              router.push(
                `/academy/learning/courses/${courseId}/seasons/${row.SeasonId}/sections`,
              ),
          },
          {
            key: "delete",
            label: "حذف",
            icon: <Icon name="trash" className="size-[20px]" />,
            color: "danger",
            onClick: () => handleDelete(row.SeasonId),
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

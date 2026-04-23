"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/common/AppIcon";
import TableTop from "@/components/TableTop";
import { useDisclosure } from "@/ui/NextUi";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import {
  useGetSectionsBySeasonIdQuery,
  useDeleteSectionMutation,
} from "../learning.services";
import type { SectionDto } from "../learning.types";

interface SectionTableProps {
  courseId: number;
  seasonId: number;
  onEdit: (id: number) => void;
}

export default function SectionTable({
  courseId,
  seasonId,
  onEdit,
}: SectionTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: sectionsData, isLoading } =
    useGetSectionsBySeasonIdQuery(seasonId);
  const [deleteSection, { isLoading: isDeleting }] =
    useDeleteSectionMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const allSections = sectionsData?.Data ?? [];
  const totalCount = allSections.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedRows = allSections.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  const confirmDelete = async (id: number) => {
    await deleteSection(id);
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
    { key: "Title", title: "عنوان بخش" },
    { key: "CreatedDate", title: "تاریخ ایجاد" },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: unknown, row: SectionDto) => {
        const items: DropdownAction[] = [
          {
            key: "edit",
            label: "ویرایش",
            icon: <AppIcon name="Edit" size={20} />,
            onClick: () => onEdit(row.SectionId),
          },
          {
            key: "view",
            label: "مشاهده محتوا",
            icon: <AppIcon name="Eye" size={20} />,
            onClick: () =>
              router.push(
                `/academy/learning/courses/${courseId}/seasons/${seasonId}/sections/${row.SectionId}`,
              ),
          },
          {
            key: "delete",
            label: "حذف",
            icon: <AppIcon name="Trash" size={20} />,
            color: "danger",
            onClick: () => handleDelete(row.SectionId),
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

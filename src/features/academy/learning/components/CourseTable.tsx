"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/common/AppIcon";
import TableTop from "@/components/TableTop";
import { useDisclosure, Chip } from "@/ui/NextUi";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import {
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
} from "../learning.services";
import type { CourseDto } from "../learning.types";

interface CourseTableProps {
  onEdit: (id: number) => void;
}

export default function CourseTable({ onEdit }: CourseTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: coursesData, isLoading } = useGetAllCoursesQuery();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const allCourses = coursesData?.Data ?? [];
  const totalCount = allCourses.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedRows = allCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  const confirmDelete = async (id: number) => {
    await deleteCourse(id);
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
    { key: "Title", title: "عنوان دوره" },
    { key: "CategoryName", title: "دسته‌بندی" },
    { key: "TeacherName", title: "مدرس" },
    {
      key: "IsActive",
      title: "وضعیت",
      render: (_: unknown, row: CourseDto) => (
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
      key: "DurationMinutes",
      title: "مدت (دقیقه)",
    },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: unknown, row: CourseDto) => {
        const items: DropdownAction[] = [
          {
            key: "edit",
            label: "ویرایش",
            icon: <AppIcon name="Edit" size={20} />,
            onClick: () => onEdit(row.CourseId),
          },
          {
            key: "seasons",
            label: "مدیریت فصل‌ها",
            icon: <AppIcon name="Eye" size={20} />,
            onClick: () =>
              router.push(
                `/academy/learning/courses/${row.CourseId}/seasons`,
              ),
          },
          {
            key: "delete",
            label: "حذف",
            icon: <AppIcon name="Trash" size={20} />,
            color: "danger",
            onClick: () => handleDelete(row.CourseId),
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

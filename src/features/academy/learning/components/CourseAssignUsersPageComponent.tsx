"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Checkbox } from "@heroui/react";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";
import TableTop from "@/components/TableTop";
import AppInput from "@/components/common/AppInput";
import { AppSelect } from "@/components/common/AppSelect";
import CustomButton from "@/ui/Button";
import { Chip } from "@/ui/NextUi";
import { addToaster } from "@/ui/Toaster";
import {
  useAssignUsersToCourseMutation,
  useGetCourseAssignableUsersQuery,
  useGetCourseByIdQuery,
} from "../learning.services";
import type { CourseAssignableUserDto } from "../learning.types";

export default function CourseAssignUsersPageComponent() {
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const { data: courseData } = useGetCourseByIdQuery(courseId);
  const { data: usersData, isLoading, refetch } = useGetCourseAssignableUsersQuery({
    courseId,
    pageNumber: currentPage,
    pageSize,
    searchTerm: searchTerm.trim() || undefined,
    department: selectedDepartment === "all" ? undefined : selectedDepartment,
  });
  const [assignUsersToCourse, { isLoading: isAssigning }] =
    useAssignUsersToCourseMutation();

  const courseTitle = courseData?.Data?.Title ?? "...";
  const users = usersData?.Data?.Items ?? [];
  const totalCount = usersData?.Data?.TotalCount ?? 0;
  const totalPages = usersData?.Data?.TotalPages ?? 1;
  const selectableRows = useMemo(
    () => users.filter((u) => !u.IsAssigned),
    [users],
  );
  const departmentOptions = useMemo(() => {
    const uniqueDepartments = Array.from(
      new Set(users.map((u) => u.Department).filter((d): d is string => Boolean(d))),
    );
    return [
      { value: "all", label: "همه دپارتمان‌ها" },
      ...uniqueDepartments.map((department) => ({
        value: department,
        label: department,
      })),
    ];
  }, [users]);

  const isAllCurrentPageSelected =
    selectableRows.length > 0 &&
    selectableRows.every((u) => selectedUserIds.includes(u.UserId));

  const breadcrumbs: BreadcrumbsItem[] = [
    { Name: "خانه", Href: "/" },
    { Name: "دوره‌ها", Href: "/academy/learning/courses" },
    {
      Name: `اختصاص کاربران برای ${courseTitle}`,
      Href: `/academy/learning/courses/${courseId}/assign-users`,
    },
  ];

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setCurrentPage(1);
  };

  const toggleUserSelection = (userId: number, checked: boolean) => {
    setSelectedUserIds((prev) =>
      checked ? Array.from(new Set([...prev, userId])) : prev.filter((id) => id !== userId),
    );
  };

  const toggleSelectAllOnPage = (checked: boolean) => {
    const selectableIds = selectableRows.map((u) => u.UserId);
    setSelectedUserIds((prev) => {
      if (checked) return Array.from(new Set([...prev, ...selectableIds]));
      return prev.filter((id) => !selectableIds.includes(id));
    });
  };

  const handleAssignSelectedUsers = async () => {
    if (selectedUserIds.length === 0) {
      addToaster({
        title: "حداقل یک کاربر را برای تخصیص انتخاب کنید",
        color: "warning",
      });
      return;
    }

    try {
      const response = await assignUsersToCourse({
        CourseId: courseId,
        UserIds: selectedUserIds,
      }).unwrap();

      if (response.ResponseCode === 100) {
        addToaster({
          title: "کاربران با موفقیت به دوره اختصاص داده شدند",
          color: "success",
        });
        setSelectedUserIds([]);
        await refetch();
        return;
      }

      addToaster({
        title: response.ResponseMessage || "خطا در اختصاص کاربران",
        color: "danger",
      });
    } catch (error: unknown) {
      const err = error as { data?: { ResponseMessage?: string }; message?: string };
      addToaster({
        title:
          err?.data?.ResponseMessage || err?.message || "خطا در اختصاص کاربران",
        color: "danger",
      });
    }
  };

  const headers = [
    {
      key: "select",
      title: (
        <Checkbox
          isSelected={isAllCurrentPageSelected}
          onValueChange={toggleSelectAllOnPage}
          isDisabled={selectableRows.length === 0}
          radius="sm"
        />
      ),
      render: (_: unknown, row: CourseAssignableUserDto) => (
        <Checkbox
          isSelected={selectedUserIds.includes(row.UserId) || row.IsAssigned}
          onValueChange={(checked) => toggleUserSelection(row.UserId, checked)}
          isDisabled={row.IsAssigned}
          radius="sm"
        />
      ),
    },
    { key: "PersonnelId", title: "شماره پرسنلی" },
    { key: "FullName", title: "نام و نام خانوادگی" },
    { key: "Department", title: "دپارتمان" },
    { key: "Title", title: "سمت" },
    {
      key: "IsAssigned",
      title: "وضعیت تخصیص",
      render: (_: unknown, row: CourseAssignableUserDto) => (
        <Chip
          size="sm"
          variant="flat"
          color={row.IsAssigned ? "success" : "warning"}
        >
          {row.IsAssigned ? "اختصاص داده شده" : "اختصاص داده نشده"}
        </Chip>
      ),
    },
  ];

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />
      <div className="mb-10 flex justify-between items-center">
        <div className="flex items-center gap-x-3 py-[18.5px]">
          <h1 className="font-semibold text-xl/[28px] text-secondary-950">
            اختصاص کاربران به دوره {courseTitle}
          </h1>
        </div>
        <CustomButton
          buttonVariant="primary"
          buttonSize="md"
          className="font-semibold text-[14px]/[20px] min-w-[230px]"
          isDisabled={selectedUserIds.length === 0}
          isLoading={isAssigning}
          onClick={handleAssignSelectedUsers}
        >
          اختصاص کاربران انتخاب شده
        </CustomButton>
      </div>

      <div className="mb-4 grid md:grid-cols-2 gap-4">
        <AppInput
          label="جستجوی کاربر"
          placeholder="جستجو بر اساس نام یا شماره پرسنلی"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          dir="rtl"
        />
        <AppSelect
          label="فیلتر دپارتمان"
          options={departmentOptions}
          value={selectedDepartment}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          placeholder="دپارتمان را انتخاب کنید"
        />
      </div>

      <TableTop
        headers={headers}
        rows={users}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}

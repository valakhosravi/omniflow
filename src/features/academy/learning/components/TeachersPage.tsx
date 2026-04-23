"use client";

import { useState } from "react";
import { useDisclosure } from "@/ui/NextUi";
import AppButton from "@/components/common/AppButton/AppButton";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";
import TeacherForm from "./TeacherForm";
import TeacherTable from "./TeacherTable";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "مدرس‌ها", Href: "/academy/learning/teachers" },
];

export default function TeachersPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editId, setEditId] = useState<number | null>(null);

  const handleAdd = () => {
    setEditId(null);
    onOpen();
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    onOpen();
  };

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />
      <div className="mb-10 flex justify-between items-center">
        <div className="flex items-center gap-x-3 py-[18.5px]">
          <h1 className="font-semibold text-xl/[28px] text-secondary-950">
            لیست مدرس‌ها
          </h1>
        </div>
        <AppButton label="اضافه کردن مدرس" onClick={handleAdd} />
      </div>

      <TeacherForm isOpen={isOpen} onOpenChange={onClose} teacherId={editId} />
      <TeacherTable onEdit={handleEdit} />
    </>
  );
}

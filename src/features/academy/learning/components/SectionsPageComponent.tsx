"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useDisclosure } from "@/ui/NextUi";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";
import {
  useGetCourseByIdQuery,
  useGetSeasonByIdQuery,
} from "../learning.services";
import SectionForm from "./SectionForm";
import SectionTable from "./SectionTable";

export default function SectionsPageComponent() {
  const params = useParams<{ courseId: string; seasonId: string }>();
  const courseId = Number(params.courseId);
  const seasonId = Number(params.seasonId);
  const { data: courseData } = useGetCourseByIdQuery(courseId);
  const { data: seasonData } = useGetSeasonByIdQuery(seasonId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editId, setEditId] = useState<number | null>(null);

  const courseTitle = courseData?.Data?.Title ?? "...";
  const seasonTitle = seasonData?.Data?.Title ?? "...";

  const breadcrumbs: BreadcrumbsItem[] = [
    { Name: "خانه", Href: "/" },
    { Name: "دوره‌ها", Href: "/academy/learning/courses" },
    {
      Name: `فصل‌های ${courseTitle}`,
      Href: `/academy/learning/courses/${courseId}/seasons`,
    },
    {
      Name: `بخش‌های ${seasonTitle}`,
      Href: `/academy/learning/courses/${courseId}/seasons/${seasonId}/sections`,
    },
  ];

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
            بخش‌های {seasonTitle}
          </h1>
        </div>
        <CustomButton
          buttonVariant="primary"
          className="font-semibold text-[14px]/[20px] min-w-[209px] flex items-center justify-center gap-x-[8px]"
          buttonSize="md"
          onClick={handleAdd}
        >
          <span>
            <Icon name="add" className="text-secondary-0" />
          </span>
          <span>اضافه کردن بخش</span>
        </CustomButton>
      </div>

      <SectionForm
        isOpen={isOpen}
        onOpenChange={onClose}
        sectionId={editId}
        seasonId={seasonId}
      />
      <SectionTable seasonId={seasonId} onEdit={handleEdit} />
    </>
  );
}

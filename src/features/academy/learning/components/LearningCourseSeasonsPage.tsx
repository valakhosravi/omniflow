"use client";

import { useParams } from "next/navigation";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";
import { Chip } from "@/ui/NextUi";
import AccordionCard from "@/ui/AccordionCard";
import {
  useGetCourseByIdQuery,
  useGetSeasonsByCourseIdQuery,
} from "../learning.services";

export default function LearningCourseSeasonsPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params.courseId);

  const { data: courseData, isLoading: isCourseLoading } =
    useGetCourseByIdQuery(courseId, { skip: !courseId });
  const { data: seasonsData, isLoading: isSeasonsLoading } =
    useGetSeasonsByCourseIdQuery(courseId, { skip: !courseId });

  const courseTitle = courseData?.Data?.Title ?? "...";
  const seasons = seasonsData?.Data ?? [];

  const breadcrumbs: BreadcrumbsItem[] = [
    { Name: "خانه", Href: "/" },
    { Name: "یادگیری", Href: "/academy/learning" },
    { Name: `${courseTitle}`, Href: `/academy/learning/${courseId}` },
  ];

  const isLoading = isCourseLoading || isSeasonsLoading;

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />
      <div className="mb-8">
        <h1 className="font-semibold text-xl/[28px] text-secondary-950">
          فصل‌های دوره {courseTitle}
        </h1>
      </div>

      {isLoading ? (
        <div className="text-sm/[20px] text-secondary-500">در حال بارگذاری...</div>
      ) : seasons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-secondary-200 p-6 text-secondary-500 text-sm/[20px]">
          این دوره هنوز فصلی ندارد.
        </div>
      ) : (
        <div className="space-y-4">
          {seasons.map((season) => {
            const sections = season.Sections ?? [];
            return (
              <AccordionCard
                key={season.SeasonId}
                defaultOpen={false}
                title={
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-[15px]/[22px] text-secondary-950">
                        {season.Title ?? "بدون عنوان"}
                      </h3>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={season.IsActive ? "success" : "default"}
                      >
                        {season.IsActive ? "فعال" : "غیرفعال"}
                      </Chip>
                    </div>
                    <div className="flex items-center gap-4 text-[13px]/[20px] text-secondary-700">
                      <span>ترتیب: {season.OrderNumber}</span>
                      <span>تعداد بخش‌ها: {sections.length}</span>
                    </div>
                  </div>
                }
                contentClassName="pt-2"
              >
                {sections.length === 0 ? (
                  <div className="text-sm/[20px] text-secondary-500">
                    برای این فصل هنوز بخشی ثبت نشده است.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {sections.map((section) => (
                      <li
                        key={section.SectionId}
                        className="rounded-lg border border-secondary-100 bg-secondary-50 px-3 py-2 text-sm/[20px] text-secondary-800"
                      >
                        {section.Title ?? "بدون عنوان"}
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionCard>
            );
          })}
        </div>
      )}
    </>
  );
}

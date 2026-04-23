"use client";

import Link from "next/link";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";
import { Chip } from "@/ui/NextUi";
import { useGetAllCoursesQuery } from "../learning.services";
import type { CourseDto } from "../learning.types";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "یادگیری", Href: "/academy/learning" },
];

function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "0 دقیقه";
  if (minutes < 60) return `${minutes} دقیقه`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours} ساعت` : `${hours} ساعت و ${mins} دقیقه`;
}

function CourseCard({ course }: { course: CourseDto }) {
  const seasonsCount = course.Seasons?.length ?? 0;

  return (
    <Link
      href={`/academy/learning/${course.CourseId}`}
      className="rounded-xl border border-secondary-100 p-4 bg-secondary-0 block hover:border-primary-200 transition-colors"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-semibold text-[15px]/[22px] text-secondary-950 line-clamp-1">
          {course.Title ?? "بدون عنوان"}
        </h3>
        <Chip size="sm" variant="flat" color={course.IsActive ? "success" : "default"}>
          {course.IsActive ? "فعال" : "غیرفعال"}
        </Chip>
      </div>
      <div className="flex items-center justify-between text-[13px]/[20px] text-secondary-700">
        <span>تعداد فصل‌ها: {seasonsCount}</span>
        <span>مدت دوره: {formatDuration(course.DurationMinutes)}</span>
      </div>
    </Link>
  );
}

function CourseSection({
  title,
  courses,
  emptyText,
}: {
  title: string;
  courses: CourseDto[];
  emptyText: string;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg/[26px] text-secondary-950">{title}</h2>
      </div>
      {courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-secondary-200 p-6 text-secondary-500 text-sm/[20px]">
          {emptyText}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.CourseId} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function LearningIndexPage() {
  const { data: coursesData, isLoading } = useGetAllCoursesQuery();
  const allCourses = coursesData?.Data ?? [];

  const latestCourses = [...allCourses]
    .sort(
      (a, b) =>
        new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime(),
    )
    .slice(0, 6);

  // Until dedicated backend endpoints are available, these sections are built
  // from existing course data to keep the landing page usable.
  const userAssignedCourses = allCourses.filter((course) => course.IsActive).slice(0, 6);
  const viewedCourses = allCourses.filter((course) => !course.IsActive).slice(0, 6);

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-semibold text-xl/[28px] text-secondary-950">
          نمای کلی یادگیری
        </h1>
        <Link
          href="/academy/learning/courses"
          className="text-primary-600 text-sm/[20px] font-semibold hover:underline"
        >
          مدیریت دوره‌ها
        </Link>
      </div>

      {isLoading ? (
        <div className="text-sm/[20px] text-secondary-500">در حال بارگذاری...</div>
      ) : (
        <>
          <CourseSection
            title="جدیدترین دوره‌ها"
            courses={latestCourses}
            emptyText="دوره‌ای برای نمایش وجود ندارد."
          />
          <CourseSection
            title="دوره‌های اختصاص داده‌شده به کاربر"
            courses={userAssignedCourses}
            emptyText="هنوز دوره‌ای به کاربر اختصاص داده نشده است."
          />
          <CourseSection
            title="دوره‌های مشاهده‌شده توسط کاربر"
            courses={viewedCourses}
            emptyText="هنوز دوره مشاهده‌شده‌ای وجود ندارد."
          />
        </>
      )}
    </>
  );
}

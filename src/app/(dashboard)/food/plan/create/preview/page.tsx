"use client";
import PlanPreviewTable from "@/components/food/plan/create/preview/planPreviewTable";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import { useSearchParams } from "next/navigation";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "لیست برنامه های غذایی", Href: "/food/plan" },
  { Name: "اضافه کردن برنامه غذایی", Href: "/food/plan/create" },
  { Name: "پیش نمایش", Href: "/food/plan/create/preview" },
];

export default function Page() {
  const searchParams = useSearchParams();
  const name = searchParams?.get("name");
  return (
    <>
      <BreadcrumbsTop items={breadcrumbs} />
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-semibold text-xl/[28px] text-secondary-950 pt-[10px]">
          پیش نمایش {name}
        </h1>
      </div>
      <PlanPreviewTable />
    </>
  );
}

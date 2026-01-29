"use client";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import ContainerTop from "@/ui/ContainerTop";
import React from "react";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "رزرو غذا", Href: "/food/reservation" },
  { Name: "پیش نمایش رزرو غذا", Href: "/food/reservation/preview" },
];

export default function Page() {
  return (
    <>
      <BreadcrumbsTop items={breadcrumbs} />
      <ContainerTop>
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-bold text-2xl text-logo-1">پیش نمایش رزرو غذا</h1>
        </div>
        {/* <PreviewTable /> */}
      </ContainerTop>
    </>
  );
}

"use client";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { BreadcrumbsItem } from "./appBreadcrumb.types";

export default function AppBreadcrumb({ items }: { items: BreadcrumbsItem[] }) {
  return (
    <>
      <Breadcrumbs
        className="mb-6 mt-[40px]"
        key="top-breadcrumbs"
        radius="full"
        underline="always"
        itemClasses={{
          item: "text-secondary-300 data-[current=true]:text-secondary-950 data-[current=true]:font-bold text-[14px]/[20px] font-semibold",
          separator: "gap-x-[8px]",
        }}
      >
        {items.map((item, index) => (
          <BreadcrumbItem key={"brdc-" + index} href={item.Href}>
            {item.Name}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </>
  );
}

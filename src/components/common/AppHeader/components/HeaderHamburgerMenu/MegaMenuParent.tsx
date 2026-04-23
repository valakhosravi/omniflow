"use client";
import useGetSidebar from "@/hooks/useGetSidebar";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { MenuRequest } from "@/models/menu/MenuRequest";
import SidebarSkeleton from "@/ui/SidebarSkeleton";
import { TopLevelMenuItem } from "./TopLevelMenuItem";

type SideBarNavsProps = {
  setSelectedParentId: (id: number | null) => void;
  selectedParentId: number | null;
};

export default function HeaderHamburgerMenu({
  setSelectedParentId,
  selectedParentId,
}: SideBarNavsProps) {
  const { menuData, isLoading } = useGetSidebar();
  const pathname = usePathname();

  const groupedItems = useMemo(() => {
    return (menuData?.Data ?? []).reduce(
      (acc: Record<string, MenuRequest[]>, item: MenuRequest) => {
        const parentId =
          item.ParentId === null ? "root" : String(item.ParentId);
        if (!acc[parentId]) acc[parentId] = [];
        acc[parentId].push(item);
        return acc;
      },
      {}
    );
  }, [menuData]);

  const renderTopLevelMenuItems = useCallback(() => {
    const items = groupedItems["root"];
    if (!items) return null;

    return (
      <ul className="space-y-1">
        {items.map((item) => {
          const hasChildren = groupedItems[String(item.MenuId)];
          const isActive = pathname === item.UrlSlug;
          const isSelected = selectedParentId === item.MenuId;

          return (
            <TopLevelMenuItem
              key={item.MenuId}
              item={item}
              hasChildren={!!hasChildren}
              isActive={isActive}
              isSelected={isSelected}
              onMouseEnter={(menuId) => {
                if (hasChildren) {
                  setSelectedParentId(menuId);
                }
              }}
            />
          );
        })}
      </ul>
    );
  }, [groupedItems, pathname, setSelectedParentId, selectedParentId]);

  const renderedMenu = useMemo(
    () => renderTopLevelMenuItems(),
    [renderTopLevelMenuItems]
  );

  if (isLoading) return <SidebarSkeleton />;
  return renderedMenu;
}

TopLevelMenuItem.displayName = "TopLevelMenuItem";

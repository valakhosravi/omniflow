"use client";
import useGetSidebar from "@/hooks/useGetSidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ExpandMoreRounded } from "@mui/icons-material";
import { MenuRequest } from "@/models/menu/MenuRequest";
import SidebarSkeleton from "@/ui/SidebarSkeleton";

type OpenMapType = Record<number, boolean>;

export default function SideBarNavs() {
  const { menuData, isLoading } = useGetSidebar();
  const pathname = usePathname();
  const [openMap, setOpenMap] = useState<OpenMapType>({});

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

  const menuItemsMap = useMemo(() => {
    return (menuData?.Data ?? []).reduce((acc, item) => {
      acc[item.MenuId] = item;
      return acc;
    }, {} as Record<number, MenuRequest>);
  }, [menuData]);

  const getParentChain = useCallback(
    (activePath: string) => {
      const activeItem = Object.values(menuItemsMap).find(
        (item) => item.UrlSlug === activePath
      );
      const chain: number[] = [];
      let current = activeItem;

      while (current && current.ParentId !== null) {
        chain.push(current.ParentId);
        current = menuItemsMap[current.ParentId];
      }

      return chain;
    },
    [menuItemsMap]
  );

  useEffect(() => {
    if (!menuData) return;

    const parentChain = getParentChain(pathname || "");
    setOpenMap((prev) => {
      const updated = { ...prev };
      let changed = false;

      parentChain.forEach((id) => {
        if (!updated[id]) {
          updated[id] = true;
          changed = true;
        }
      });

      return changed ? updated : prev;
    });
  }, [menuData, pathname, getParentChain]);

  const toggle = useCallback((id: number) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const renderMenuItems = useCallback(
    (parentId: string, level = 0) => {
      const items = groupedItems[parentId];
      if (!items) return null;

      return (
        <ul
          className={`space-y-1 ${
            level > 0 ? "mr-4 border-r-2 border-secondary-300 pr-2" : ""
          }`}
        >
          {items.map((item) => {
            const hasChildren = groupedItems[String(item.MenuId)];
            const isOpen = openMap[item.MenuId];
            const isActive = pathname === item.UrlSlug;

            return (
              <MenuItem
                key={item.MenuId}
                item={item}
                hasChildren={!!hasChildren}
                isOpen={isOpen}
                isActive={isActive}
                toggle={toggle}
                renderChildren={() =>
                  hasChildren
                    ? renderMenuItems(String(item.MenuId), level + 1)
                    : null
                }
              />
            );
          })}
        </ul>
      );
    },
    [groupedItems, openMap, pathname, toggle]
  );

  const renderedMenu = useMemo(
    () => renderMenuItems("root"),
    [renderMenuItems]
  );

  if (isLoading) return <SidebarSkeleton />;
  return renderedMenu;
}

type MenuItemProps = {
  item: MenuRequest;
  hasChildren: boolean;
  isOpen: boolean;
  isActive: boolean;
  toggle: (id: number) => void;
  renderChildren: () => React.ReactNode;
};

const MenuItem = memo(
  ({
    item,
    hasChildren,
    isOpen,
    isActive,
    toggle,
    renderChildren,
  }: MenuItemProps) => {
    return (
      <li>
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
            isActive
              ? "bg-blue-100 text-logo-1 font-semibold"
              : "text-gray-700 hover:bg-secondary-100"
          }`}
          onClick={() => {
            if (hasChildren) toggle(item.MenuId);
          }}
        >
          <Link
            href={item.UrlSlug || "#"}
            className="flex items-center flex-1"
            onClick={(e) => {
              if (hasChildren) e.preventDefault();
            }}
          >
            {item.Icon && (
              <span
                className="mr-3 text-lg"
                dangerouslySetInnerHTML={{ __html: item.Icon }}
              />
            )}
            <span className="truncate">{item.Title}</span>
          </Link>

          {hasChildren && (
            <span className="ml-2 transition-transform duration-300">
              <ExpandMoreRounded
                fontSize="small"
                className={`transform transition-transform duration-300 ${
                  isOpen ? "rotate-0" : "rotate-90"
                }`}
              />
            </span>
          )}
        </div>

        <div
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="pl-2">{renderChildren()}</div>
        </div>
      </li>
    );
  }
);

MenuItem.displayName = "MenuItem";

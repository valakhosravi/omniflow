import { memo, useMemo } from "react";
import Link from "next/link";
import { MenuRequest } from "@/models/menu/MenuRequest";
import { Icon } from "@/ui/Icon";

type ChildMenuItemsProps = {
  selectedParentId: number | null;
  menuData: any;
  onOpenChange: (isOpen: boolean) => void;
};

const ChildMenuItems = memo(
  ({ selectedParentId, menuData, onOpenChange }: ChildMenuItemsProps) => {
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

    const children = useMemo(() => {
      if (selectedParentId === null) return [];
      return groupedItems[String(selectedParentId)] || [];
    }, [selectedParentId, groupedItems]);

    return (
      <div className="space-y-[16px] p-[19px]">
        {children.map((item: MenuRequest) => {
          return (
            <Link
              key={item.MenuId}
              href={item.UrlSlug || "#"}
              onClick={() => onOpenChange(false)}
              className={`group flex items-center px-3 py-2 rounded-lg transition-colors duration-200 
                font-medium text-[12px]/[18px] text-secondary-400 hover:text-primary-950 gap-x-2
                `}
            >
              <span className="truncate">{item.Title}</span>
              <span
                className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 
               transition-all duration-300 ease-in-out"
              >
                <Icon
                  name="arrowleft"
                  className="text-primary-950 w-[10px] h-[10px]"
                />
              </span>
            </Link>
          );
        })}
      </div>
    );
  }
);

ChildMenuItems.displayName = "ChildMenuItems";

export default ChildMenuItems;

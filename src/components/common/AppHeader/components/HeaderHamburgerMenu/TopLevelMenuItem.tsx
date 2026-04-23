import { MenuRequest } from "@/models/menu/MenuRequest";
import Link from "next/link";
import { memo } from "react";
import { PiHamburger, PiUser,PiNoteThin,PiHandCoinsDuotone    } from "react-icons/pi";
import { Data } from "iconsax-reactjs";

type TopLevelMenuItemProps = {
  item: MenuRequest;
  hasChildren: boolean;
  isActive: boolean;
  isSelected: boolean;
  onMouseEnter: (menuId: number) => void;
};

const iconMap: Record<string, React.ReactNode> = {
  "سامانه غذا": <PiHamburger className="flex-shrink-0 text-primary-950/[.7] text-xl" />,
  "سرمایه انسانی": <PiUser className="flex-shrink-0 text-primary-950/[.7] text-xl" />,
  "فناوری اطلاعات": <Data size={20} className="flex-shrink-0 text-primary-950/[.7] text-lg" />,
  "سامانه قرارداد": <PiNoteThin className="flex-shrink-0 text-primary-950/[.7] text-xl" />,
  "مالی": <PiHandCoinsDuotone  className="flex-shrink-0 text-primary-950/[.7] text-xl"  />,
};

export const TopLevelMenuItem = memo(
  ({
    item,
    hasChildren,
    isActive,
    isSelected,
    onMouseEnter,
  }: TopLevelMenuItemProps) => {
    return (
      <li onMouseEnter={() => onMouseEnter(item.MenuId)}>
        <div
          className={`flex items-center gap-x-[8px] font-semibold text-[14px]/[20px] text-primary-950/[70%] py-[14px] px-[16px] 
            bg-transparent hover:bg-secondary-0 hover:text-primary-950 rounded-[10px] cursor-pointer
            ${
              (isActive || isSelected) && "text-primary-950 stroke-primary-950"
            }`}
        >
          {iconMap[item.Title]}
          <Link
            href={item.UrlSlug || "#"}
            className="flex items-center flex-1"
            onClick={(e) => {
              if (hasChildren) e.preventDefault();
            }}
          >
            <span className="truncate">{item.Title}</span>
          </Link>
        </div>
      </li>
    );
  }
);

TopLevelMenuItem.displayName = "TopLevelMenuItem";

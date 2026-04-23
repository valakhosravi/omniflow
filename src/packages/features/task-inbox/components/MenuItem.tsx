"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  badge?: React.ReactNode;
  contextMenu?: React.ReactNode;
  showContextMenu?: boolean;
  href?: string;
}

export default function MenuItem({
  icon,
  title,
  badge,
  contextMenu,
  showContextMenu = false,
  href,
}: MenuItemProps) {
  const pathname = usePathname();
  const isActive = href && pathname === href;

  return (
    <div className="group relative">
      <Link href={href ?? "#"}>
        <div
          className={`transition-colors-opacity duration-300 ease-in-out cursor-pointer flex items-center justify-between py-[10px] px-[12px] rounded-lg
             font-medium text-[14px]/[20px]
             ${
               isActive
                 ? "text-primary-950 bg-day-title"
                 : "text-primary-950/[.5] bg-transparent hover:text-primary-950 "
             }`}
        >
          <div className="flex gap-x-2 items-center">
            <div className="">{icon}</div>
            <div className="text-[14px] text-primary-">{title}</div>
          </div>
          {badge && <>{badge}</>}
        </div>
      </Link>

      {showContextMenu && contextMenu && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {contextMenu}
        </div>
      )}
    </div>
  );
}

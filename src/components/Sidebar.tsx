import React from "react";
import SideBarNavs from "./SideBarNavs";
import useOutsideClick from "@/hooks/useOutsideClick";
import { CloseRounded } from "@mui/icons-material";
import TopTaskBag from "./TopTaskBag";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useOutsideClick(onClose);
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 xl:hidden"
          onClick={onClose}
        />
      )}
      <aside
        ref={ref}
        className={`col-start-1 col-span-1 bg-secondary-0
            transition-transform duration-300 ease-in-out
            fixed top-0 right-0 z-30 h-full xl:w-[250px] 2xl:w-[275px]
             shadow-lg border-l border-secondary-200
            ${open ? "translate-x-0" : "translate-x-full bg-inherit"}
            xl:translate-x-0 xl:static xl:block
          `}
      >
        <div className="flex justify-end p-4 xl:hidden">
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-red-600 cursor-pointer"
            aria-label="Close Sidebar"
          >
            <CloseRounded />
          </button>
        </div>
        <div className="h-full">
          <TopTaskBag />
          <div className="p-5 pt-10 xl:pt-8 flex flex-col">
            <div className="flex-grow">
              <SideBarNavs />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

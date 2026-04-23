"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import EditBookmarkDropDown from "./EditBookmarkDropDown";
import { favoriteModel } from "@/features/homePage/homePage.types";
import { PiHamburgerBold } from "react-icons/pi";

interface SortableFavoriteProps {
  favorite: favoriteModel;
  onOpenChange: (open: boolean) => void;
  setIsEditMode: (edit: boolean) => void;
  setEditingFavorite: (favorite: favoriteModel) => void;
}

export default function SortableFavorite({
  favorite,
  onOpenChange,
  setIsEditMode,
  setEditingFavorite,
}: SortableFavoriteProps) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(favorite.id),
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? ("none" as const) : ("auto" as const),
    cursor: isDragging ? "grabbing" : "grab",
    background: "transparent",
    border: "transparent",
  };

  const handleNavigationClick = () => {
    if (!isDragging) {
      router.push(`${favorite.MenuUrlSlug}`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="relative flex flex-col items-center space-y-[12px] group w-[84px] h-[116px]"
      onClick={handleNavigationClick}
    >
      <span
        className="flex items-center justify-center btn bg-white size-[64px] min-h-[84px] min-w-[84px]
        rounded-[10px] [box-shadow:-8px_8px_40px_0px_#959DA51F] group-hover:[box-shadow:0px_10px_36px_0px_#00000029] drop-shadow-md"
      >
        <EditBookmarkDropDown
          favorite={favorite}
          onOpenChange={onOpenChange}
          setIsEditMode={setIsEditMode}
          setEditingFavorite={setEditingFavorite}
        />
        {favorite.MenuIcon ? (
          <Image
            src={favorite.MenuIcon}
            alt={favorite.MenuTitle}
            width={32}
            height={32}
          />
        ) : (
          <span className="text-primary-950 text-[20px] font-bold">
            {favorite.MenuTitle === "رزرو غذا" ? (
              <PiHamburgerBold className="flex-shrink-0 text-2xl" />
            ) : (
              favorite.MenuTitle?.[0] || "?"
            )}
          </span>
        )}
      </span>
      <span
        {...listeners}
        className="text-secondary-950 text-medium font-medium leading-[20px] text-center cursor-grab"
        style={{ userSelect: "none" }}
      >
        {favorite.MenuTitle}
      </span>
    </div>
  );
}

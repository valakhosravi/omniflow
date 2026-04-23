"use client";
import { useBookmark } from "@/hooks/food/useBookmark";
import BookmarkIcon from "@/ui/BookmarkIcon";
import { useState } from "react";
import { StartProcessHeaderProps } from "./AppStartProcessHeader.types";

export default function StartProcessHeader({ title }: StartProcessHeaderProps) {
  const [urlValue] = useState(() => window.location.href);

  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(urlValue);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-3 py-[18.5px]">
          {favoriteCount < 9 && (
            <BookmarkIcon
              isBookmarked={isBookmarked}
              onClick={handleToggleBookmark}
            />
          )}
          <h1 className="font-semibold text-xl/[28px] text-secondary-950">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}

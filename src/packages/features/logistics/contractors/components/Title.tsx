"use client";
import { useBookmark } from "@/hooks/food/useBookmark";
import BookmarkIcon from "@/ui/BookmarkIcon";
import Image from "next/image";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";

interface TitleProps {
  title: string;
  buttons?: JSX.Element[];
  haveSearch?: boolean;
  setSearchTerm?: Dispatch<SetStateAction<string>>;
}

export default function Title({
  title,
  buttons,
  haveSearch,
  setSearchTerm,
}: TitleProps) {
  const [urlValue, setUrlValue] = useState("");
  useEffect(() => {
    setUrlValue(window.location.href);
  }, []);
  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(urlValue);

  return (
    <>
      <div className="py-[18px] flex justify-between items-center">
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
        {buttons && (
          <div className="flex items-center self-end gap-x-[12px]">
            {haveSearch && setSearchTerm && (
              <div className={`relative rounded-[12px]`}>
                <Image
                  src="/icons/search.svg"
                  alt="search"
                  width={20}
                  height={20}
                  className="absolute right-4 top-[24px] transform -translate-y-1/2"
                />
                <input
                  name="search"
                  type="search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="جستجو ..."
                  className={`w-[300px] h-[48px] py-[5px] pr-[45px] focus:outline-none bg-white 
                    border-1 border-secondary-950/[.2] rounded-[12px] font-normal text-[14px]/[20px]
               [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none`}
                />
              </div>
            )}

            {buttons.map((button) => button)}
          </div>
        )}
      </div>
    </>
  );
}

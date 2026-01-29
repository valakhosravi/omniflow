"use client";

import React, { useState } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";

interface BookmarkHeaderProps {
  title: string;
  initialBookmarked?: boolean;
  onBookmarkChange?: (isBookmarked: boolean) => void;
  className?: string;
}

export default function BookmarkHeader({
  title,
  initialBookmarked = false,
  onBookmarkChange,
  className = ""
}: BookmarkHeaderProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const handleBookmarkToggle = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    onBookmarkChange?.(newBookmarkState);
  };

  return (
    <div className={`flex gap-3 items-center ${className}`}>
      <span
        onClick={handleBookmarkToggle}
        className="cursor-pointer"
      >
        {isBookmarked ? (
          <PiStarFill size={24} color="#EFBF04" />
        ) : (
          <PiStar size={24} color={"#B7BBC2"} />
        )}
      </span>
      <div className="text-[16px] font-[600] w-[306px]">{title}</div>
    </div>
  );
}

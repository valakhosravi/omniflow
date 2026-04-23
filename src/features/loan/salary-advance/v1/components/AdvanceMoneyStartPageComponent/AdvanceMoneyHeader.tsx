"use client";
import { useBookmark } from "@/hooks/food/useBookmark";
import BookmarkIcon from "@/ui/BookmarkIcon";
import { Button } from "@/ui/NextUi";
import { useState } from "react";
import RequestHistoryModal from "./RequestHistoryModal";
import { useLazyGetRequestHistoryQuery } from "@/services/commonApi/commonApi";

interface AdvanceMoneyHeaderProps {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function AdvanceMoneyHeader({
  title = "درخواست مساعده",
}: AdvanceMoneyHeaderProps) {
  const [urlValue] = useState(() => window.location.href);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [
    getRequestHistory,
    { data: historyData, isLoading: isHistoryLoading },
  ] = useLazyGetRequestHistoryQuery();

  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(urlValue);

  const onButtonClick = () => {
    getRequestHistory(2);
    setIsHistoryModalOpen(true);
  };

  return (
    <>
      <div className="px-[16px] py-[18px] flex justify-between items-center">
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
        <Button
          variant="bordered"
          className="text-[#1C3A63] border-[#26272B33] border-1 rounded-[12px]"
          onPress={onButtonClick}
        >
          تاریخچه درخواست
        </Button>
      </div>

      <RequestHistoryModal
        isOpen={isHistoryModalOpen}
        onOpenChange={() => setIsHistoryModalOpen(false)}
        data={historyData?.Data || []}
        isLoading={isHistoryLoading}
        requestType="advance-money"
      />
    </>
  );
}

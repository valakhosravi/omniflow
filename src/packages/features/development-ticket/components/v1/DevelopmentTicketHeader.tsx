"use client";
import { useBookmark } from "@/hooks/food/useBookmark";
import { useLazyGetRequestHistoryQuery } from "@/packages/features/advance-money/api/advanceMoneyApi";
import RequestHistoryModal from "@/packages/features/advance-money/components/RequestHistoryModal";
import BookmarkIcon from "@/ui/BookmarkIcon";
import { useEffect, useState } from "react";

interface DevelopmentTicketProps {
  title: string;
  onButtonClick?: () => void;
}

export default function DevelopmentTicketHeader({
  title,
}: DevelopmentTicketProps) {
  const [urlValue, setUrlValue] = useState("");
  useEffect(() => {
    setUrlValue(window.location.href);
  }, []);
  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(urlValue);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [
    getRequestHistory,
    { data: historyData, isLoading: isHistoryLoading },
  ] = useLazyGetRequestHistoryQuery();

  const onButtonClick = () => {
    getRequestHistory(4);
    setIsHistoryModalOpen(true);
  };

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
        {/* <Button
          variant="bordered"
          className="text-[#1C3A63] border-[#26272B33] border-1 rounded-[12px]"
          onPress={onButtonClick}
        >
          تاریخچه درخواست
        </Button> */}
      </div>
      <RequestHistoryModal
        isOpen={isHistoryModalOpen}
        onOpenChange={() => setIsHistoryModalOpen(false)}
        data={historyData?.Data || []}
        isLoading={isHistoryLoading}
        requestType="contract"
      />
    </div>
  );
}

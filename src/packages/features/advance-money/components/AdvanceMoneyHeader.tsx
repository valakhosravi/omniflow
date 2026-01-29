"use client";
import { useBookmark } from "@/hooks/food/useBookmark";
import BookmarkIcon from "@/ui/BookmarkIcon";
import { Button } from "@/ui/NextUi";
import { useEffect, useState } from "react";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useLazyGetRequestHistoryQuery } from "../api/advanceMoneyApi";
import RequestHistoryModal from "./RequestHistoryModal";

interface AdvanceMoneyHeaderProps {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function AdvanceMoneyHeader({
  title = "درخواست مساعده",
  buttonText = "تاریخچه درخواست مساعده",
}: AdvanceMoneyHeaderProps) {
  const [urlValue, setUrlValue] = useState("");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const { userDetail } = useAuth();

  const [
    getRequestHistory,
    { data: historyData, isLoading: isHistoryLoading },
  ] = useLazyGetRequestHistoryQuery();

  useEffect(() => {
    setUrlValue(window.location.href);
  }, []);

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

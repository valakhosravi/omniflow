"use client";
import { useBookmark } from "@/hooks/food/useBookmark";
import BookmarkIcon from "@/ui/BookmarkIcon";
import {useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { useRequestTimeline } from "../../task-inbox/hooks/useRequestTimeline";
import RequestFlowModal from "../../task-inbox/components/RequestFlowModal";
import CustomButton from "@/ui/Button";
import { Refresh } from "iconsax-reactjs";

interface ContractHeaderProps {
  title: string;
  requestId: number;
  onButtonClick?: () => void;
}

export default function ContractHeader({
  title,
  requestId,
}: ContractHeaderProps) {
  const [urlValue, setUrlValue] = useState("");
  useEffect(() => {
    setUrlValue(window.location.href);
  }, []);
  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(urlValue);

  const { requestTimeline, refetch: refetchRequestTimeline } =
    useRequestTimeline({ requestId: requestId });

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

  return (
    <>
      <div className="px-[32px] py-[18px] flex justify-between items-center">
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
        <CustomButton
          buttonVariant="outline"
          className="font-semibold text-[14px]/[35px] text-primary-950 border-[#26272B33] border-1 rounded-[12px]"
          buttonSize="md"
          startContent={<Refresh size={20} />}
          onPress={onRequestFlowOpen}
        >
          مراحل گردش درخواست
        </CustomButton>
      </div>
      <RequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </>
  );
}

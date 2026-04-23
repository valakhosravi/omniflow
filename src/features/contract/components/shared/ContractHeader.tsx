"use client";
import { useBookmark } from "@/hooks/food/useBookmark";
import BookmarkIcon from "@/ui/BookmarkIcon";
import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";
import CustomButton from "@/ui/Button";
import { Refresh } from "iconsax-reactjs";
import { useGetRequestTimelineQuery } from "@/services/commonApi/commonApi";

interface ContractHeaderProps {
  title: string;
  requestId: number;
  onButtonClick?: () => void;
}

export default function ContractHeader({
  title,
  requestId,
}: ContractHeaderProps) {
  const [urlValue] = useState(() => window.location.href);
  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(urlValue);

  const { data: requestTimeline } =
    useGetRequestTimelineQuery(Number(requestId), {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    });

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
      <AppRequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </>
  );
}

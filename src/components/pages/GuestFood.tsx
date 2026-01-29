"use client";
import { useBookmark } from "@/hooks/food/useBookmark";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import BookmarkIcon from "@/ui/BookmarkIcon";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import CustomButton from "@/ui/Button";
import { useDisclosure } from "@heroui/react";
import { usePathname } from "next/navigation";
import GuestPlanSelectModal from "../food/guest-food/GuestPlanSelectModal";
import GuestOrderTable from "../food/guest-food/GuestOrderTable";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "تاریخچه رزرو غذای مهمان", Href: "/food/guest-food" },
];

export default function GuestFood() {
  const pathname = usePathname();
  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(pathname);
  const { onOpen, isOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <BreadcrumbsTop items={breadcrumbs} />
      <div>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-x-3 py-[18.5px]">
            {favoriteCount < 9 && (
              <BookmarkIcon
                isBookmarked={isBookmarked}
                onClick={handleToggleBookmark}
              />
            )}
            <h1 className="font-semibold text-xl/[28px] text-secondary-950">
              تاریخچه رزرو غذای مهمان
            </h1>
          </div>
          <CustomButton buttonVariant="primary" onPress={onOpen}>
            انتخاب برنامه غذایی
          </CustomButton>
        </div>
        <GuestOrderTable />
      </div>
      <GuestPlanSelectModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}

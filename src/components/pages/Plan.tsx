"use client";

import PlanForm from "@/components/food/plan/PlanForm";
import PlanList from "@/components/food/plan/PlanList";
import { usePlanContext } from "@/context/EditPlanDataContext";
import { useBookmark } from "@/hooks/food/useBookmark";
import { useGetPlanById } from "@/hooks/food/usePlanAction";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import { usePlanStore } from "@/store/planStore";
import BookmarkIcon from "@/ui/BookmarkIcon";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { useDisclosure } from "@/ui/NextUi";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "لیست برنامه های غذایی", Href: "/food/plan" },
];

export default function Plan() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editId, setEditId] = useState<number | null>(null);
  const { planData, isGetting } = useGetPlanById(editId);
  const router = useRouter();
  const { setPlanData, setEditIdData, clearEditIdData } = usePlanContext();

  useEffect(() => {
    if (planData?.Data) {
      setPlanData(planData.Data);

      const { Name, FromDate, ToDate } = planData.Data;

      const query = new URLSearchParams({
        name: Name,
        from: FromDate,
        to: ToDate,
      }).toString();
      router.push(`/food/plan/create?${query}`);
    }
  }, [planData]);

  const queryClient = useQueryClient();
  const handleAdd = () => {
    setEditId(null);
    clearEditIdData();
    onOpen();
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    setEditIdData(id);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["planList"] });
  };
  const [urlValue, setUrlValue] = useState("");
  useEffect(() => {
    setUrlValue(window.location.href);
  }, []);
  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(urlValue);

  return (
    <>
      <BreadcrumbsTop items={breadcrumbs} />
      <div className="mb-10 flex justify-between items-center">
        <div className="flex items-center gap-x-3 py-[18.5px]">
          {favoriteCount < 9 && (
            <BookmarkIcon
              isBookmarked={isBookmarked}
              onClick={handleToggleBookmark}
            />
          )}
          <h1 className="font-semibold text-xl/[28px] text-secondary-950">
            لیست برنامه های غذایی
          </h1>
        </div>
        <CustomButton
          buttonVariant="primary"
          className="font-semibold text-[14px]/[20px] min-w-[209px] flex items-center justify-center
               gap-x-[8px]"
          buttonSize="md"
          onClick={handleAdd}
        >
          <span>
            <Icon name="edit" className="text-secondary-0" />
          </span>
          <span>اضافه کردن برنامه غذایی</span>
        </CustomButton>
      </div>
      <PlanForm
        isOpen={isOpen}
        onOpenChange={onClose}
        planId={editId}
        onSuccess={handleSuccess}
      />
      <PlanList onEdit={handleEdit} />
    </>
  );
}

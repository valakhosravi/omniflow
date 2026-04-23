"use client";

import SupplierForm from "@/components/food/supplier/SupplierForm";
import SupplierList from "@/components/food/supplier/SupplierList";
import { useBookmark } from "@/hooks/food/useBookmark";
import BookmarkIcon from "@/ui/BookmarkIcon";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { useDisclosure } from "@/ui/NextUi";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "لیست تامین کنندگان", Href: "/food/supplier" },
];

export default function Supplier() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editId, setEditId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const [urlValue] = useState(() => window.location.href);

  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(urlValue);

  const handleAdd = () => {
    setEditId(null);
    onOpen();
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    onOpen();
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["supplier-list"] });
  };

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />
      <div className="mb-10 flex justify-between items-center">
        <div className="flex items-center gap-x-3 py-[18.5px]">
          {favoriteCount < 9 && (
            <BookmarkIcon
              isBookmarked={isBookmarked}
              onClick={handleToggleBookmark}
            />
          )}
          <h1 className="font-semibold text-xl/[28px] text-secondary-950">
            لیست تامین کنندگان
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
          <span>اضافه کردن تامین کنندگان</span>
        </CustomButton>
      </div>

      <SupplierForm
        isOpen={isOpen}
        onOpenChange={onClose}
        supplierId={editId}
        onSuccess={handleSuccess}
      />

      <SupplierList onEdit={handleEdit} />
    </>
  );
}

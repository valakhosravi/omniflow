"use client";

import MealForms from "@/components/food/meal/MealForms";
import MealTable from "@/components/food/meal/MealTable";
import { useBookmark } from "@/hooks/food/useBookmark";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import BookmarkIcon from "@/ui/BookmarkIcon";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import { useDisclosure } from "@/ui/NextUi";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "منوی غذایی", Href: "/food/meal" },
];

export default function Meal() {
  const pathname = usePathname();
  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(pathname);
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();
  // const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = () => {
    setEditId(null);
    onCreateOpen();
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    onCreateOpen();
  };

  const mealTypeMap: Record<number, string> = {
    1: "غذای اصلی",
    3: "دسر",
    4: "نوشیدنی",
  };

  const mealTypeOptions = [
    { value: "", label: "همه" },
    ...Object.entries(mealTypeMap).map(([key, value]) => ({
      value: key,
      label: value,
    })),
  ];

  const { userDetail } = useAuth();
  const hasRequiredService = userDetail?.ServiceIds.includes(1501);

  return (
    <>
      <BreadcrumbsTop items={breadcrumbs} />
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-x-3 py-[18.5px]">
          {favoriteCount < 9 && (
            <BookmarkIcon
              isBookmarked={isBookmarked}
              onClick={handleToggleBookmark}
            />
          )}
          <h1 className="font-semibold text-xl/[28px] text-secondary-950">
            منوی غذایی
          </h1>
        </div>
        <div className="flex items-center gap-x-[16px]">
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

          {/* <Autocomplete
              label="فیلتر بر اساس نوع غذا"
              items={mealTypeOptions}
              selectedKey={selectedMealType !== null ? selectedMealType : ""}
              size="sm"
              className="max-w-xs"
              onSelectionChange={(key) => {
                const stringKey = key as string;
                setSelectedMealType(stringKey !== "" ? stringKey : null);
              }}
            >
              {(item) => (
                <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
              )}
            </Autocomplete> */}

          {hasRequiredService && (
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
              <span>اضافه کردن آیتم غذایی</span>
            </CustomButton>
          )}
        </div>

        <MealForms
          isCreateOpen={isCreateOpen}
          coverImageUrl={coverImageUrl}
          onCreateOpenChange={onCreateOpenChange}
          setCoverImageUrl={setCoverImageUrl}
          mealId={editId}
        />
      </div>

      <MealTable
        onEdit={handleEdit}
        // filterMealType={selectedMealType}
        searchTerm={searchTerm}
      />
    </>
  );
}

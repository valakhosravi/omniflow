"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DevelopmentTicketHeader from "../../development-ticket/components/v2/DevelopmentTicketHeader";
import ContractLayout from "../layouts/ContractLayout";
import TableTop from "@/components/TableTop";
import { SubCategory } from "../types/contractModel";
import { useAllSubCategories, useContractCategories } from "../hook/contractHook";
import { useDeleteSubCategoryTemplateMutation } from "../api/contractApi";
import { toLocalDateShort } from "@/utils/dateFormatter";
import Image from "next/image";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import { Icon } from "@/ui/Icon";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { useDisclosure } from "@/ui/NextUi";
import { addToaster } from "@/ui/Toaster";
import CustomButton from "@/ui/Button";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "قراردادهای تیپ", Href: "/legal/contract/templates" },
];

export default function ContractTemplatesIndex() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    allSubCategories,
    isLoading: isLoadingSubCategories,
    refetch,
  } = useAllSubCategories();
  const { categories, isLoading: isLoadingCategories } = useContractCategories();
  const [deleteSubCategory, { isLoading: isDeleting }] =
    useDeleteSubCategoryTemplateMutation();

  // Create a map of categoryId to category name
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((category) => {
      map.set(category.CategoryId, category.Name);
    });
    return map;
  }, [categories]);

  // Filter subcategories based on search term and IsPersonal
  const subCategories = useMemo(() => {
    // First filter by IsPersonal (only include where IsPersonal is false)
    const filteredByPersonal = allSubCategories.filter(
      (subCategory) => subCategory.IsPersonal === false
    );

    // Then filter by search term if provided
    if (!searchTerm.trim()) {
      return filteredByPersonal;
    }
    const term = searchTerm.toLowerCase();
    return filteredByPersonal.filter(
      (subCategory) =>
        subCategory.Name.toLowerCase().includes(term) ||
        subCategory.Description.toLowerCase().includes(term)
    );
  }, [allSubCategories, searchTerm]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    router.push("/legal/contract/templates/create");
  };

  const handleEdit = (subCategoryId: number) => {
    const subCategory = allSubCategories.find(
      (sc) => sc.SubCategoryId === subCategoryId
    );
    if (subCategory) {
      const searchParams = new URLSearchParams({
        subCategoryId: subCategoryId.toString(),
        categoryId: subCategory.CategoryId.toString(),
      });
      router.push(
        `/legal/contract/templates/update?${searchParams.toString()}`
      );
    }
  };

  const handleDelete = (templateId: number) => {
    setSelectedDeleteId(templateId);
    onDeleteOpen();
  };

  const confirmDelete = async (templateId: number | string) => {
    try {
      const subCategoryId = Number(templateId);
      const response = await deleteSubCategory(subCategoryId).unwrap();

      if (response.ResponseCode === 100) {
        addToaster({
          title: "قالب با موفقیت حذف شد",
          color: "success",
        });
        onDeleteClose();
        setSelectedDeleteId(null);
        // Refetch subcategories after successful deletion
        await refetch();
      } else {
        addToaster({
          title: response.ResponseMessage || "خطا در حذف قالب",
          color: "danger",
        });
      }
    } catch (error: any) {
      console.error("Error deleting subcategory:", error);
      addToaster({
        title:
          error?.data?.ResponseMessage || error?.message || "خطا در حذف قالب",
        color: "danger",
      });
    }
  };

  // Calculate pagination
  const totalCount = subCategories.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSubCategories = subCategories.slice(startIndex, endIndex);

  const headers = [
    {
      key: "index",
      title: "شماره",
    },
    {
      key: "Name",
      title: "نام زیردسته",
    },
    {
      key: "Description",
      title: "توضیحات",
    },
    {
      key: "CategoryId",
      title: "نام دسته",
      render: (_: any, row: SubCategory) => (
        <span className="text-secondary-500">
          {row.CategoryId ? (categoryMap.get(row.CategoryId) || row.CategoryId) : "-"}
        </span>
      ),
    },
    // {
    //   key: "IsType",
    //   title: "تیپ",
    //   render: (_: any, row: SubCategory) => (
    //     <span className="text-secondary-500">{row.IsType ? "بله" : "خیر"}</span>
    //   ),
    // },
    // {
    //   key: "IsPersonal",
    //   title: "شخصی",
    //   render: (_: any, row: SubCategory) => (
    //     <span className="text-secondary-500">
    //       {row.IsPersonal ? "بله" : "خیر"}
    //     </span>
    //   ),
    // },
    {
      key: "CreatedDate",
      title: "تاریخ ایجاد",
      render: (_: any, row: SubCategory) => (
        <span className="text-secondary-500">
          {row.CreatedDate ? toLocalDateShort(row.CreatedDate) : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "عملیات",
      render: (_: any, row: SubCategory) => {
        const actions: DropdownAction[] = [
          {
            key: "edit",
            label: "ویرایش",
            icon: <Icon name="edit" className="size-4" />,
            onClick: () => handleEdit(row.SubCategoryId),
          },
          {
            key: "delete",
            label: "حذف",
            color: "danger",
            icon: <Icon name="trash" className="size-4" />,
            onClick: () => handleDelete(row.SubCategoryId),
          },
        ];

        return <OperationDropdown items={actions} />;
      },
    },
  ];

  return (
    <ContractLayout>
      <div className="container mx-auto">
        <BreadcrumbsTop items={breadcrumbs} />
        <div className="flex justify-between items-center mb-6">
          <DevelopmentTicketHeader title="لیست قرارداد های تیپ" />
          <CustomButton
            buttonVariant="primary"
            className="font-semibold text-[14px]/[20px] min-w-[180px] flex items-center justify-center gap-x-[8px]"
            buttonSize="md"
            onClick={handleCreate}
          >
            <Icon name="add" className="text-secondary-0 size-5" />
            <span>ایجاد قالب جدید</span>
          </CustomButton>
        </div>
      </div>
      <div className="py-6 container mx-auto">
        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <Image
              src="/icons/search.svg"
              alt="search"
              width={20}
              height={20}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              placeholder="جستجو در نام یا توضیحات زیردسته..."
              className="w-full h-[48px] px-4 py-[5px] pr-[45px] border border-secondary-200 rounded-[12px] 
                focus:outline-none focus:border-primary-950 text-[14px]/[20px] 
                placeholder:text-secondary-400 text-secondary-950 bg-white
                [appearance:textfield]"
              dir="rtl"
            />
          </div>
        </div>

        <TableTop
          headers={headers}
          rows={paginatedSubCategories.map((subCategory: SubCategory) => ({
            ...subCategory,
            id: subCategory.SubCategoryId,
          }))}
          isLoading={isLoadingSubCategories || isLoadingCategories}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          totalCount={totalCount}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {selectedDeleteId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={confirmDelete}
          itemId={selectedDeleteId}
          description="آیا از حذف این قالب مطمئن هستید؟"
          isLoading={isDeleting}
        />
      )}
    </ContractLayout>
  );
}

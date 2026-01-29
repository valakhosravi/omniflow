import { Switch, useDisclosure } from "@/ui/NextUi";
import TableTop from "../../TableTop";
import { toLocalDateShort } from "@/utils/dateFormatter";
import {
  useChangeStatusMeal,
  useDeleteMeal,
  useGetMealList,
} from "@/hooks/food/useMealAction";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { Icon } from "@/ui/Icon";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import OperationDropdown from "@/ui/OperationDropdown";
import { DropdownAction } from "@/ui/OperationDropdown";
import { addToaster } from "@/ui/Toaster";

interface MealTableProps {
  onEdit: (id: number) => void;
  searchTerm?: string | null;
}

export default function MealTable({ onEdit, searchTerm }: MealTableProps) {
  const handleDelete = (id: number) => {
    setSelectedId(id);
    onDeleteOpen();
  };

  const { userDetail } = useAuth();
  const hasEditService = userDetail?.ServiceIds.includes(1502);
  const hasDeleteService = userDetail?.ServiceIds.includes(1503);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const currentSearchField: string | undefined = searchTerm
    ? "Name"
    : undefined;
  const currentSearchValue: string | undefined = searchTerm ?? undefined;

  type SortField = "Name" | "CreatedDate" | "MealType" | "SupplierId" | "Price";
  type SortType = "asc" | "desc";

  const [sortField, setSortField] = useState<SortField | undefined>("Name");
  const [sortType, setSortType] = useState<SortType>("asc");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const { mealList, isMenuListLoading } = useGetMealList(
    currentPage,
    pageSize,
    currentSearchField,
    currentSearchValue,
    sortField,
    sortType
  );

  const { mealDelete, isDeletingMeal } = useDeleteMeal();
  const { changeStatus, isChanging } = useChangeStatusMeal(
    currentPage,
    pageSize,
    currentSearchField,
    currentSearchValue,
    sortField,
    sortType
  );

  const queryClient = useQueryClient();
  const [indexSortOrder, setIndexSortOrder] = useState<"asc" | "desc">("asc");

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      queryClient.removeQueries({
        queryKey: ["mealList", currentPage, pageSize],
      });

      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const confirmDelete = async (id: number) => {
    const previousData = queryClient.getQueryData([
      "mealList",
      currentPage,
      pageSize,
    ]);

    queryClient.setQueryData(
      ["mealList", currentPage, pageSize],
      (oldData: any) => {
        if (!oldData?.Data?.Items) return oldData;
        return {
          ...oldData,
          Data: {
            ...oldData.Data,
            Items: oldData.Data.Items.filter((item: any) => item.MealId !== id),
          },
        };
      }
    );

    mealDelete(id, {
      onSuccess: (response) => {
        if (response.ResponseCode === 100) {
          onDeleteClose();
          queryClient.invalidateQueries({ queryKey: ["mealList"] });
          addToaster({
            title: response.ResponseMessage,
            color: "success",
          });
        } else {
          onDeleteClose();
          addToaster({
            title: response.ResponseMessage,
            color: "danger",
          });
        }
      },
      onError: () => {
        queryClient.setQueryData(
          ["mealList", currentPage, pageSize],
          previousData
        );
      },
    });
  };

  const mealTypeOptions = [
    { name: "غذای اصلی", id: 1 },
    { name: "پیش غذا", id: 2 },
    { name: "دسر", id: 3 },
    { name: "نوشیدنی", id: 4 },
  ];

  const mealItems: any[] = Array.isArray(mealList?.Data?.Items)
    ? mealList.Data.Items
    : [];

  const sortedMealItems = [...mealItems].sort((a, b) => {
    const indexA = mealItems.indexOf(a);
    const indexB = mealItems.indexOf(b);

    if (indexSortOrder === "asc") {
      return indexA - indexB;
    } else {
      return indexB - indexA;
    }
  });
  const calculateRowIndex = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const headers = [
    {
      key: "index",
      title: "شماره",
      render: (_: any, __: any, index?: number) => {
        if (index === undefined) return 1;
        return calculateRowIndex(index);
      },
    },
    {
      key: "Name",
      title: (
        <div className="flex items-center gap-1">
          <Icon
            name="arrowDown"
            className="size-[24px] text-primary-950 cursor-pointer"
            onClick={() => {
              setSortField("Name");
              setSortType((prev) => (prev === "asc" ? "desc" : "asc"));
              setCurrentPage(1);
            }}
          />
          <span>نام غذا</span>
        </div>
      ),
    },
    {
      key: "Supplier",
      title: "تامین کننده",
      render: (_: any, row: any) => {
        return row.Supplier.Name;
      },
    },
    {
      key: "MealType",
      title: "نوع غذا",
      render: (_: any, row: any) => {
        const mealType = mealTypeOptions.find(
          (type) => type.id === row.MealType
        );
        return mealType && mealType.name;
      },
    },
    {
      key: "IsActive",
      title: "وضعیت",
      render: (_: any, row: any) => {
        return (
          <Switch
            size="sm"
            classNames={{ wrapper: `${row.IsActive && "!bg-primary-950"}` }}
            isSelected={row.IsActive}
            isDisabled={isChanging}
            onChange={() => changeStatus({ ...row, IsActive: !row.IsActive })}
          />
        );
      },
    },
    {
      key: "Price",
      title: "قیمت (تومان)",
      render: (_: any, row: any) => {
        return <span>{formatNumberWithCommas(row.Price)}</span>;
      },
    },
    {
      key: "CreatedDate",
      title: "تاریخ ایجاد",
      render: (_: any, row: any) => {
        return toLocalDateShort(row.CreatedDate);
      },
    },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: any, row: any) => {
        const items = [
          hasEditService && {
            key: "edit",
            label: "ویرایش",
            icon: <Icon name="edit" className="size-[20px]" />,
            onClick: () => onEdit(row.MealId),
          },
          hasDeleteService && {
            key: "delete",
            label: "حذف",
            color: "#e53935",
            icon: <Icon name="trash" className="size-[20px]" />,
            onClick: () => handleDelete(row.MealId),
          },
        ].filter(Boolean);

        return <OperationDropdown items={items as DropdownAction[]} />;
      },
    },
  ];

  return (
    <>
      <TableTop
        headers={headers}
        isLoading={isMenuListLoading}
        rows={sortedMealItems}
        totalPages={mealList?.Data?.TotalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={mealList?.Data?.TotalCount ?? 0}
        onPageSizeChange={handlePageSizeChange}
      />
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={() => confirmDelete(selectedId)}
          isLoading={isDeletingMeal}
          itemId={selectedId}
        />
      )}
    </>
  );
}

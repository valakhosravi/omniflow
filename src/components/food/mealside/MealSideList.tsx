import TableTop from "@/components/TableTop";
import {
  useChangeStatusMealSide,
  useDeleteMealSide,
  useMealSideList,
} from "@/hooks/food/useMealSideAction";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { Button, Switch, useDisclosure } from "@/ui/NextUi";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin7Line } from "react-icons/ri";
import { addToaster } from "@/ui/Toaster";

type MealSideListProps = {
  onEdit: (id: number) => void;
};

export default function MealSideList({ onEdit }: MealSideListProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { isGetting, mealSideData } = useMealSideList(currentPage, pageSize);
  const { deleteSideMeal, isDeleting } = useDeleteMealSide();
  const { changeStatus, isChanging } = useChangeStatusMealSide(
    currentPage,
    pageSize
  );

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      queryClient.removeQueries({
        queryKey: ["mealsideList", currentPage, pageSize],
      });

      setCurrentPage(page);
    }
  };

  const calculateRowIndex = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const confirmDelete = async (id: number) => {
    const previousData = queryClient.getQueryData([
      "mealsideList",
      currentPage,
      pageSize,
    ]);
    queryClient.setQueryData(
      ["mealsideList", currentPage, pageSize],
      (oldData: any) => {
        if (!oldData?.Data?.Items) return oldData;
        return {
          ...oldData,
          Data: {
            ...oldData.Data,
            Items: oldData.Data.Items.filter(
              (item: any) => item.MealSideId !== id
            ),
          },
        };
      }
    );

    deleteSideMeal(id, {
      onSuccess: (response) => {
        if (response.ResponseCode === 100) {
          onClose();
        } else {
          queryClient.setQueryData(
            ["mealsideList", currentPage, pageSize],
            previousData
          );
          addToaster({
            title: response.ResponseMessage,
            color: "danger",
          });
        }
      },
      onError: () => {
        queryClient.setQueryData(
          ["mealsideList", currentPage, pageSize],
          previousData
        );
      },
    });
  };

  const headers = [
    {
      key: "index",
      title: "#",
      render: (_: any, __: any, index?: number) => {
        if (index === undefined) return 1;
        return calculateRowIndex(index);
      },
    },
    { key: "Name", title: "نام" },
    {
      key: "Supplier",
      title: "تامین کننده",
      render: (_: any, row: any) => {
        return row.Supplier.Name;
      },
    },
    {
      key: "Price",
      title: "قیمت",
    },
    {
      key: "IsActive",
      title: "وضعیت",
      render: (_: any, row: any) => {
        return (
          <Switch
            isSelected={row.IsActive}
            isDisabled={isChanging}
            onChange={() => changeStatus({ ...row, IsActive: !row.IsActive })}
          />
        );
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
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button
            isIconOnly
            size="sm"
            color="danger"
            variant="ghost"
            onPress={() => handleDelete(row.MealSideId)}
          >
            <RiDeleteBin7Line />
          </Button>

          <Button
            isIconOnly
            size="sm"
            color="primary"
            variant="ghost"
            onPress={() => onEdit(row.MealSideId)}
          >
            <FaRegEdit />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <TableTop
        headers={headers}
        isLoading={isGetting}
        rows={mealSideData?.Data?.Items || []}
        totalPages={mealSideData?.Data?.TotalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={mealSideData?.Data?.TotalCount ?? 0}
        onPageSizeChange={handlePageSizeChange}
      />
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={() => confirmDelete(selectedId)}
          isLoading={isDeleting}
          itemId={selectedId}
        />
      )}
    </>
  );
}

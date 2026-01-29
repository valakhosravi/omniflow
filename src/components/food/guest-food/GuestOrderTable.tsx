import TableTop from "@/components/TableTop";
import {
  useDeleteGuestOrder,
  useGetGuestOrderPlans,
} from "@/hooks/food/useGuestReservation";
import { setPlanId } from "@/store/guestReservationStore";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { Icon } from "@/ui/Icon";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import { toLocalDateShortExel } from "@/utils/dateFormatter";
import { useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function GuestOrderTable() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { plans, isGetting, refetch } = useGetGuestOrderPlans(
    currentPage,
    pageSize
  );
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const { deleteOrder, isDeleting } = useDeleteGuestOrder(selectedId ?? 0);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      refetch();
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const calculateRowIndex = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    onDeleteOpen();
  };

  const handleEdit = (id: number) => {
    router.push(`/food/guest-reservation?planId=${id}`);
    dispatch(setPlanId(id ?? null));
  };

  const confirmDelete = async (id: number) => {
    deleteOrder(id, {
      onSuccess: () => {
        refetch();
        onDeleteClose();
        setSelectedId(null);
      },
    });
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
      title: "نام رزرو",
    },
    {
      key: "FromDate",
      title: "از تاریخ",
      render: (value: string) => toLocalDateShortExel(value),
    },
    {
      key: "ToDate",
      title: "تا تاریخ",
      render: (value: string) => toLocalDateShortExel(value),
    },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: any, row: any) => {
        console.log(row);

        const items = [
          {
            key: "edit",
            label: "ویرایش",
            icon: <Icon name="edit" className="size-[20px]" />,
            onClick: () => handleEdit(row.PlanId),
          },
          {
            key: "delete",
            label: "حذف",
            icon: <Icon name="trash" className="size-[20px]" />,
            color: "#ff1751",
            onClick: () => {
              return handleDelete(row.PlanId);
            },
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
        rows={plans?.Data?.Items || []}
        isLoading={isGetting}
        totalPages={plans?.Data?.TotalPages || 1}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalCount={plans?.Data?.TotalCount ?? 0}
        onPageSizeChange={handlePageSizeChange}
      />
      {selectedId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={() => confirmDelete(selectedId)}
          isLoading={isDeleting}
          itemId={selectedId}
        />
      )}
    </>
  );
}

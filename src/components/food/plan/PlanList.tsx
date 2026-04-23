"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

// UI Components
import TableTop from "@/components/TableTop";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { Switch, useDisclosure } from "@/ui/NextUi";
import { Icon } from "@/ui/Icon";
import OperationDropdown, { DropdownAction } from "@/ui/OperationDropdown";
import CustomButton from "@/ui/Button";
import { addToaster } from "@/ui/Toaster";

// Hooks
import {
  useChangeStatusPlan,
  useDeletePlan,
  usePlanList,
} from "@/hooks/food/usePlanAction";
import { useReports } from "@/packages/features/food/hooks/useReports";

// Utils
import { toLocalDateShort, toLocalDateShortExel } from "@/utils/dateFormatter";
import { exportMealOrderToExcel } from "@/utils/exportMealOrderToExel";
import { exportOrderToExcel } from "@/utils/exportOrderToExel";

// Types
type PlanListProps = {
  onEdit: (id: number) => void;
};

type PlanData = {
  PlanId: number;
  Name: string;
  FromDate: string;
  ToDate: string;
  IsActive: boolean;
  CreatedDate: string;
};

type MealOrderData = {
  Date: string;
  Selfs: Array<{
    SelfName: string;
    BuildingName: string;
    Meals: Array<{
      MealName: string;
      Count: number;
    }>;
  }>;
};

export type ProcessedMealOrder = {
  supplierName: string;
  rows: any[];
};

// Constants
const PERSIAN_WEEKDAYS = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];

const DEFAULT_PAGE_SIZE = 5;
const RESPONSE_CODES = {
  SUCCESS: 100,
  NO_DATA: 104,
  ERROR: 105,
} as const;

// Helper functions
const calculateRowIndex = (
  index: number,
  currentPage: number,
  pageSize: number
) => {
  return (currentPage - 1) * pageSize + index + 1;
};

const processMealOrderData = (mealOrderData: any): ProcessedMealOrder[] => {
  // Handle both wrapped response and direct array

  const result: ProcessedMealOrder[] = [];
  mealOrderData.Data.Supliers.forEach((suplierWithOrder: any) => {
    let data: MealOrderData[];
    // data = mealOrderData;

    if (Array.isArray(mealOrderData)) {
      // Direct array (your case)
      data = mealOrderData;
    } else if (mealOrderData?.Data && Array.isArray(mealOrderData.Data)) {
      // Wrapped in response object
      data = Object.values(mealOrderData.Data).flat() as MealOrderData[];
    } else if (
      !mealOrderData?.Data ||
      mealOrderData?.ResponseCode === RESPONSE_CODES.NO_DATA
    ) {
      throw new Error("No data available");
    } else {
      // Fallback for other response structures
      data = Object.values(
        suplierWithOrder.SelfMeals
      ).flat() as MealOrderData[];
    }

    // Sort by date
    data.sort(
      (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
    );

    // Collect unique buildings and their selfs
    const buildingMap = new Map<string, Set<string>>();
    data.forEach((day) => {
      day.Selfs?.forEach((self) => {
        if (!buildingMap.has(self.BuildingName)) {
          buildingMap.set(self.BuildingName, new Set());
        }
        buildingMap.get(self.BuildingName)!.add(self.SelfName);
      });
    });

    const rows: ProcessedMealOrder[] = [];

    data.forEach((day) => {
      const dateObj = new Date(day.Date);
      const weekday = PERSIAN_WEEKDAYS[dateObj.getDay()];
      const mealMap = new Map<string, any>();

      day.Selfs?.forEach((self) => {
        self.Meals?.forEach((meal) => {
          const key = meal.MealName;
          if (!mealMap.has(key)) {
            const row: { [key: string]: any } = {
              تاریخ: toLocalDateShortExel(day.Date),
              "روز هفته": weekday,
              غذا: meal.MealName,
            };

            buildingMap.forEach((selfs, buildingName) => {
              const buildingColumn = `ساختمان (${buildingName})`;
              row[buildingColumn] = 0;
              selfs.forEach((selfName) => {
                row[selfName] = 0;
              });
            });

            mealMap.set(key, row);
          }

          const row = mealMap.get(key);
          row[self.SelfName] = meal.Count || 0;
          // Add to building total - FIX: use the formatted building column name
          const buildingColumn = `ساختمان (${self.BuildingName})`;
          row[buildingColumn] += meal.Count || 0;
        });
      });

      let isFirst = true;
      for (const row of mealMap.values()) {
        if (!isFirst) {
          row["تاریخ"] = "";
          row["روز هفته"] = "";
        }
        rows.push(row);
        isFirst = false;
      }
    });

    result.push({
      supplierName: suplierWithOrder.SupplierName,
      rows: rows,
    });
  });

  return result;
};

export default function PlanList({ onEdit }: PlanListProps) {
  // State
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { deletePlan, isDeleting } = useDeletePlan();
  const { changeStatus, isChanging } = useChangeStatusPlan(
    currentPage,
    pageSize
  );
  const { planData, isGetting } = usePlanList(currentPage, pageSize);
  const {
    getOrderByPlanId,
    orderFetching,
    getMealOrderByPlanId,
    mealOrderFetching,
  } = useReports();

  // Event handlers
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      queryClient.removeQueries({
        queryKey: ["planList", currentPage, pageSize],
      });
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    onOpen();
  };

  const handleView = (id: number) => {
    router.push(`/food/plan/order-summary?planId=${id}`);
  };

  const confirmDelete = async (id: number) => {
    const queryKey = ["planList", currentPage, pageSize];
    const previousData = queryClient.getQueryData(queryKey);

    deletePlan(id, {
      onSuccess: (response) => {
        if (response.ResponseCode === RESPONSE_CODES.SUCCESS) {
          queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData?.Data?.Items) return oldData;
            return {
              ...oldData,
              Data: {
                ...oldData.Data,
                Items: oldData.Data.Items.filter(
                  (item: PlanData) => item.PlanId !== id
                ),
              },
            };
          });
          onClose();
        } else if (response.ResponseCode === RESPONSE_CODES.ERROR) {
          addToaster({
            title: response.ResponseMessage,
            color: "danger",
          });
          onClose();
        } else {
          queryClient.setQueryData(queryKey, previousData);
          addToaster({
            title: response.ResponseMessage,
            color: "danger",
          });
        }
      },
      onError: () => {
        queryClient.setQueryData(queryKey, previousData);
      },
    });
  };

  const handleSeparate = async (id: number) => {
    setLoadingId(id);
    try {
      const { data } = await getOrderByPlanId(id);
      if (data?.ResponseCode === RESPONSE_CODES.SUCCESS && data.Data) {
        exportOrderToExcel(data.Data, `سفارشات_تفکیکی_${id}`);
      } else if (data?.ResponseCode === RESPONSE_CODES.NO_DATA) {
        addToaster({
          title: "دیتا وجود ندارد",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error exporting Separate data:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleAggregate = async (id: number) => {
    setLoadingId(id);
    try {
      const { data: mealOrderData } = await getMealOrderByPlanId(id);
      const rows = processMealOrderData(mealOrderData);
      exportMealOrderToExcel(rows, `سفارشات_تجمیعی_${id}`);
    } catch (error) {
      if (error instanceof Error && error.message === "No data available") {
        addToaster({ title: "دیتا وجود ندارد", color: "danger" });
      } else {
        console.error("Error exporting separate data:", error);
      }
    } finally {
      setLoadingId(null);
    }
  };

  // Table configuration
  const createOperationItems = (row: PlanData): DropdownAction[] => [
    {
      key: "view",
      label: "سفارشات",
      icon: <Icon name="eye" className="size-[20px]" />,
      onClick: () => handleView(row.PlanId),
    },
    {
      key: "edit",
      label: "ویرایش",
      icon: <Icon name="edit" className="size-[20px]" />,
      onClick: () => onEdit(row.PlanId),
    },
    {
      key: "delete",
      label: "حذف",
      icon: <Icon name="trash" className="size-[20px]" />,
      color: "danger",
      onClick: () => handleDelete(row.PlanId),
    },
  ];

  const headers = [
    {
      key: "index",
      title: "شماره",
      render: (_: any, __: any, index?: number) => {
        if (index === undefined) return 1;
        return calculateRowIndex(index, currentPage, pageSize);
      },
    },
    { key: "Name", title: "نام" },
    {
      key: "FromDate",
      title: "تاریخ شروع",
      render: (_: any, row: PlanData) => toLocalDateShort(row.FromDate),
    },
    {
      key: "ToDate",
      title: "تاریخ پایان",
      render: (_: any, row: PlanData) => toLocalDateShort(row.ToDate),
    },
    {
      key: "IsActive",
      title: "وضعیت",
      render: (_: any, row: PlanData) => (
        <Switch
          size="sm"
          classNames={{ wrapper: `${row.IsActive && "!bg-primary-950"}` }}
          isSelected={row.IsActive}
          isDisabled={isChanging}
          onChange={() => changeStatus({ ...row, IsActive: !row.IsActive })}
        />
      ),
    },
    {
      key: "CreatedDate",
      title: "تاریخ ایجاد",
      render: (_: any, row: PlanData) => toLocalDateShort(row.CreatedDate),
    },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: any, row: PlanData) => (
        <OperationDropdown items={createOperationItems(row)} />
      ),
    },
    {
      key: "report",
      title: "گزارشات",
      render: (_: any, row: PlanData) => (
        <div className="flex gap-2">
          <CustomButton
            buttonSize="xs"
            buttonVariant="outline"
            className="min-w-8"
            onPress={() => handleAggregate(row.PlanId)}
            isLoading={row.PlanId === loadingId && mealOrderFetching}
            isDisabled={row.PlanId === loadingId && mealOrderFetching}
          >
            تجمیعی
          </CustomButton>
          <CustomButton
            buttonSize="xs"
            buttonVariant="outline"
            className="min-w-8"
            onPress={() => handleSeparate(row.PlanId)}
            isLoading={row.PlanId === loadingId && orderFetching}
            isDisabled={row.PlanId === loadingId && orderFetching}
          >
            تفکیکی
          </CustomButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <TableTop
        headers={headers}
        isLoading={isGetting}
        rows={planData?.Data?.Items || []}
        currentPage={currentPage}
        totalPages={planData?.Data?.TotalPages || 1}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        totalCount={planData?.Data?.TotalCount ?? 0}
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

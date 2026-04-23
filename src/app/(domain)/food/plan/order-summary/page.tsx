"use client";
import Loading from "@/ui/Loading";
import ContainerTop from "@/ui/ContainerTop";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { useGetPlanOrderSummary } from "@/hooks/food/usePlanAction";
import { useDeleteUserOrderCascade } from "@/hooks/food/useOrderAction";
import { toLocalDateTimeShort } from "@/utils/dateFormatter";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  useDisclosure,
  Spinner,
  Input,
} from "@/ui/NextUi";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import { Trash, SearchNormal1 } from "iconsax-reactjs";
import PlanOrder from "@/models/food/plan/PlanOrder";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "لیست برنامه های غذایی", Href: "/food/plan" },
  { Name: "جزئیات برنامه غذایی", Href: "/food/plan/order-summary" },
];

function OrderSummaryContent() {
  const searchParams = useSearchParams();
  const planId = useMemo(
    () => parseInt(searchParams?.get("planId") ?? "0"),
    [searchParams],
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { planOrderSummary, isGetting } = useGetPlanOrderSummary(
    planId,
    debouncedSearchTerm || undefined,
  );
  const { deleteUserOrderCascade, isDeleting } = useDeleteUserOrderCascade();

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleDelete = (orderId: number) => {
    setSelectedOrderId(orderId);
    onDeleteOpen();
  };

  const confirmDelete = async (orderId: number) => {
    deleteUserOrderCascade(orderId, {
      onSuccess: () => {
        onDeleteClose();
        setSelectedOrderId(null);
      },
    });
  };

  const headers = [
    {
      key: "index",
      title: "#",
      render: (_: any, __: any, index?: number) => {
        if (index === undefined) return 1;
        return index + 1;
      },
    },
    { key: "FullName", title: "نام و نام خانوادگی" },
    { key: "PersonnelId", title: "کد پرسنلی" },
    { key: "Mobile", title: "شماره موبایل" },
    {
      key: "CreatedDate",
      title: "تاریخ سفارش",
      render: (_: any, row: any) => {
        return (
          <div className="text-medium">
            {toLocalDateTimeShort(row.CreatedDate)}
          </div>
        );
      },
    },
    {
      key: "IsOpen",
      title: "وضعیت",
      render: (_: any, row: any) => {
        return (
          <Chip
            color={row.IsOpen ? "success" : "danger"}
            variant="flat"
            size="sm"
          >
            {row.IsOpen ? "باز" : "بسته"}
          </Chip>
        );
      },
    },
    {
      key: "Operation",
      title: "عملیات",
      render: (_: any, row: any) => {
        return (
          <Button
            className="border-1 rounded-[12px]"
            isIconOnly
            color="danger"
            variant="ghost"
            size="sm"
            onPress={() => handleDelete(row.OrderId)}
          >
            <Trash size={14} />
          </Button>
        );
      },
    },
  ];

  const orders = planOrderSummary?.Data || [];

  return (
    <>
      <AppBreadcrumb items={breadcrumbs} />
      <ContainerTop>
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-semibold text-xl/[28px] text-secondary-950">
            سفارشات برنامه غذایی
          </h1>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <Input
            placeholder="جستجو بر اساس نام و نام خانوادگی..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<SearchNormal1 size={20} className="text-gray-400" />}
            className="max-w-sm"
            classNames={{
              inputWrapper: "shadow-none",
            }}
            variant="bordered"
          />
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          <Table
            aria-label="Order Summary Table"
            color="primary"
            classNames={{
              tr: "transition-all hover:bg-header-table even:bg-header-table !border-none",
              td: "py-3 !rounded-none !before:rounded-none",
              th: "bg-day-title !rounded-none h-[44px]",
              thead: "h-auto",
              wrapper: "p-0",
              table:
                "border-separate border-spacing-0 border border-secondary-100 rounded-[12px]",
            }}
            shadow="none"
            isStriped
          >
            <TableHeader>
              {headers.map((col) => (
                <TableColumn
                  className="font-semibold text-[14px]/[20px] text-secondary-600"
                  key={col.key}
                >
                  {col.title}
                </TableColumn>
              ))}
            </TableHeader>

            <TableBody
              isLoading={isGetting}
              loadingContent={
                <Spinner
                  label="درحال بارگزاری..."
                  classNames={{
                    wrapper: "scale-[1]",
                    circle1:
                      "border-2 border-t-primary-950 border-b-primary-950",
                    circle2: "border-2 border-primary-950",
                  }}
                />
              }
              emptyContent={"موردی برای نمایش وجود ندارد."}
            >
              {orders.map((row, index) => (
                <TableRow
                  key={row.OrderId ?? index}
                  className="font-medium text-[14px]/[20px]"
                >
                  {headers.map((col) => {
                    const value =
                      col.key === "index"
                        ? index + 1
                        : row[col.key as keyof PlanOrder];
                    const isNameCol = col.key === "FullName";
                    return (
                      <TableCell
                        key={col.key}
                        className={`${
                          isNameCol
                            ? "text-secondary-950"
                            : "text-secondary-500"
                        }`}
                      >
                        {col.render ? col.render(value, row, index) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ContainerTop>

      {selectedOrderId !== null && (
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={() => confirmDelete(selectedOrderId)}
          isLoading={isDeleting}
          itemId={selectedOrderId}
        />
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <OrderSummaryContent />
    </Suspense>
  );
}

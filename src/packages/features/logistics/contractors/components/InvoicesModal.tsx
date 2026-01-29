import { Modal, ModalContent, ModalHeader, ModalBody } from "@/ui/NextUi";
import { useGetInvoicesByProjectIdQuery } from "../../invoice/api/InvoiceApi";
import TableTop from "@/components/TableTop";
import { useState } from "react";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import { Icon } from "@/ui/Icon";
import { InvoiceDetails } from "../../invoice/types/InvoiceModels";

interface InvoicesModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: number | null;
}

export default function InvoicesModal({
  isOpen,
  onOpenChange,
  projectId,
}: InvoicesModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: invoicesData, isLoading } = useGetInvoicesByProjectIdQuery(
    {
      id: projectId ?? 0,
      PageNumber: currentPage,
      PageSize: pageSize,
    },
    {
      skip: !isOpen || !projectId,
      refetchOnMountOrArgChange: true,
    }
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const headers = [
    {
      key: "index",
      title: "شماره",
      render: (_: any, __: any, index?: number) => {
        if (index === undefined) return 1;
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      key: "Title",
      title: "عنوان",
      render: (_: any, row: InvoiceDetails) => {
        return row.Title || "-";
      },
    },
    {
      key: "FactorNumber",
      title: "شماره فاکتور",
      render: (_: any, row: InvoiceDetails) => {
        return row.FactorNumber || "-";
      },
    },
    {
      key: "InvoiceDate",
      title: "تاریخ صورتحساب",
      render: (_: any, row: InvoiceDetails) => {
        return toLocalDateShort(row.InvoiceDate ?? "");
      },
    },
    {
      key: "Amount",
      title: "مبلغ",
      render: (_: any, row: InvoiceDetails) => {
        return formatNumberWithCommas(row.Amount ?? 0);
      },
    },
    {
      key: "PaymentStatus",
      title: "وضعیت پرداخت",
      render: (_: any, row: InvoiceDetails) => {
        // PaymentStatus: 0 = Unpaid, 1 = Paid, etc. (adjust based on your actual status values)
        const statusMap: Record<number, string> = {
          0: "پرداخت نشده",
          1: "پرداخت شده",
        };
        return statusMap[row.PaymentStatus] || `وضعیت ${row.PaymentStatus}`;
      },
    },
    {
      key: "Description",
      title: "توضیحات",
      render: (_: any, row: InvoiceDetails) => {
        return row.Description || "-";
      },
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between font-semibold text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]">
          <span className="text-secondary-950">لیست صورتحساب‌ها</span>
        </ModalHeader>
        <div className="h-[1px] bg-secondary-100 w-full mx-auto mb-[15px]" />

        <ModalBody className="px-[20px] py-0 pb-[20px]">
          <TableTop
            headers={headers}
            isLoading={isLoading}
            rows={invoicesData?.Data?.Items || []}
            totalPages={invoicesData?.Data?.TotalPages || 1}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            totalCount={invoicesData?.Data?.TotalCount || 0}
            onPageSizeChange={handlePageSizeChange}
            onPaginationStickToTable={true}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}


"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
} from "@/ui/NextUi";
import { RequestHistoryItem } from "../../salary-advance.types";
import { formatPersianDate } from "@/utils/formatPersianDate";

interface RequestHistoryModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  data: RequestHistoryItem[];
  isLoading: boolean;
  requestType?:
    | "advance-money"
    | "development-ticket"
    | "employment-application"
    | "contract";
}

export default function RequestHistoryModal({
  isOpen,
  onOpenChange,
  data,
  isLoading,
  requestType = "advance-money",
}: RequestHistoryModalProps) {
  const getModalTitle = () => {
    switch (requestType) {
      case "advance-money":
        return "تاریخچه درخواست مساعده";
      case "development-ticket":
        return "تاریخچه درخواست تیکت توسعه";
      case "employment-application":
        return "تاریخچه درخواست اشتغال به کار";
      case "contract":
        return "تاریخچه درخواست قرارداد";
      default:
        return "تاریخچه درخواست";
    }
  };

  const getEmptyMessage = () => {
    switch (requestType) {
      case "advance-money":
        return "هنوز هیچ درخواست مساعده‌ای ثبت نشده است";
      case "development-ticket":
        return "هنوز هیچ درخواست تیکت توسعه‌ای ثبت نشده است";
      case "employment-application":
        return "هنوز هیچ درخواست اشتغال به کاری ثبت نشده است";
      case "contract":
        return "هنوز هیچ درخواست قرارداد ثبت نشده است";
      default:
        return "هنوز هیچ درخواستی ثبت نشده است";
    }
  };

  const getInstallmentStatusColor = (stateCode: number) => {
    switch (stateCode) {
      case 1:
        return "warning";
      case 2:
        return "danger";
      case 3:
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh] overflow-hidden",
        body: "",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between bg-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {getModalTitle()}
          </h2>
        </ModalHeader>

        <ModalBody className="px-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-lg font-medium mb-2">هیچ درخواستی یافت نشد</p>
              <p className="text-sm text-gray-400">{getEmptyMessage()}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                aria-label="Request history table"
                classNames={{
                  wrapper: "shadow-none",
                }}
              >
                <TableHeader>
                  <TableColumn className="text-right">کد پیگیری</TableColumn>
                  <TableColumn className="text-right">
                    وضعیت درخواست
                  </TableColumn>
                  <TableColumn className="text-right">
                    تاریخ درخواست
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={item.RequestId || index}>
                      <TableCell className="text-right">
                        {item.TrackingCode || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Chip
                          color={getInstallmentStatusColor(item.StateCode)}
                          size="sm"
                          variant="flat"
                        >
                          {item.StatusName || "در حال پرداخت"}
                        </Chip>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPersianDate(item.StatusDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

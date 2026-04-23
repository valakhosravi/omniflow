"use client";

import CustomButton from "@/ui/Button";
import { Select, SelectItem } from "@heroui/react";
import {
  useCloseOrder,
  useCloseOrderForOthers,
} from "@/hooks/food/useOrderAction";
import { InfoCircle } from "iconsax-reactjs";
import { useBasketStore } from "@/store/basketStore";
import { useRouter } from "next/navigation";

interface OrderSummaryData {
  subtotal: number;
  employeeDiscount: number;
  total: number;
  totalMeals: number;
}

interface OrderSummaryProps {
  id: string;
  orderSummary: OrderSummaryData;
  onProceedToPayment: () => void;
  onModifySelections: () => void;
  isProcessing: boolean;
}

export default function OrderSummary({
  orderSummary,
  onModifySelections,
}: OrderSummaryProps) {
  const { isClosing } = useCloseOrder();
  const { isClosingForOthers } = useCloseOrderForOthers();
  const selectedUser = useBasketStore((state) => state.selectedUser);
  const router = useRouter();

  return (
    <>
      {/* <div className="border border-primary-300 bg-primary-50 rounded-[8px] relative w-full text-[12px] text-primary-950 p-3 text-justify mb-4 flex items-center gap-1"> */}
      <div className="bg-secondary-0 rounded-xl shadow-sm border border-secondary-200 p-4 text-xs flex mb-4 items-center gap-1">
        <span>
          <InfoCircle size={18} />
        </span>
        <span>بعد از پرداخت، امکان حذف یا ویرایش سفارش غذا وجود ندارد.</span>
      </div>
      <div className="bg-secondary-0 rounded-xl shadow-sm border border-secondary-200 p-4">
        {/* Header */}
        <h2 className="text-md font-semibold text-secondary-700 mb-6">
          جزئیات پرداخت
        </h2>

        {/* Pricing Breakdown */}
        <div className="space-y-4 mb-6 text-sm">
          <div className="flex justify-between text-secondary-600">
            <span className="">مجموع ({orderSummary.totalMeals} وعده):</span>
            <span className="font-medium">
              {orderSummary.subtotal.toLocaleString()} تومان
            </span>
          </div>

          {orderSummary.employeeDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-secondary-600">سهم شرکت:</span>
              <span className="font-medium text-green-600">
                {orderSummary.employeeDiscount.toLocaleString()} تومان
              </span>
            </div>
          )}

          <div className="border-t border-secondary-200 pt-4">
            <div className="flex justify-between">
              <span className="font-semibold text-secondary-950">
                مجموع نهایی:
              </span>
              <span className="font-bold text-secondary-950">
                {orderSummary.total.toLocaleString()} تومان
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Select
            size="lg"
            className="w-full"
            defaultSelectedKeys={["1"]}
            variant="bordered"
            isDisabled={true}
            classNames={{
              base: "w-full",
              trigger: `
              bg-white 
              border border-default-300 
              rounded-[12px] 
              shadow-none 
              h-[56px] 
              min-h-[56px]
              hover:border-default-400
              focus:border-default-500
            `,
              value: "text-sm text-secondary-950",
              popoverContent: "border border-default-300",
            }}
          >
            <SelectItem key="1">کسر از حقوق</SelectItem>
          </Select>
          {/* <CustomButton
            buttonVariant="primary"
            buttonSize="lg"
            className="w-full flex items-center justify-center gap-2"
            onPress={handleCloseOrder}
            isLoading={selectedUser ? isClosingForOthers : isClosing}
          >
            پرداخت
          </CustomButton> */}
          <CustomButton
            buttonVariant="primary"
            buttonSize="lg"
            className="w-full flex items-center justify-center gap-2"
            onPress={() => {
              router.push("/food/payment-success");
            }}
            isLoading={selectedUser ? isClosingForOthers : isClosing}
          >
            تایید
          </CustomButton>

          <CustomButton
            buttonVariant="outline"
            buttonSize="lg"
            className="w-full"
            onPress={onModifySelections}
          >
            ویرایش سفارش
          </CustomButton>
        </div>
      </div>
    </>
  );
}

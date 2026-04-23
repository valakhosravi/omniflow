"use client";

import InvoiceFollowupIndex from "./InvoiceFollowupIndex";
import { InvoiceButtonsType, InvoicePageTypes } from "../../invoice.type";
import { AppButtonProps } from "@/components/common/AppButton";
import { useState } from "react";

export default function InvoicePaymentFinancialCheckPageComponent() {
  const [selectedBtn, setSelectedBtn] = useState<InvoiceButtonsType | null>(
    null,
  );

  const onCheck = () => setSelectedBtn(InvoiceButtonsType.CHECK);
  const onAccept = () => setSelectedBtn(InvoiceButtonsType.ACCEPT);

  const buttonList: AppButtonProps[] = [
    {
      label: "بررسی مجدد",
      color: "danger",
      variant: "outline",
      onClick: onCheck,
    },
    {
      label: "ارسال جهت پردازش مالی",
      color: "primary",
      variant: "contained",
      onClick: onAccept,
    },
  ];
  return (
    <>
      <InvoiceFollowupIndex
        selectedBtn={selectedBtn}
        buttonList={buttonList}
        pageType={InvoicePageTypes.FINANCIAL_CHECK}
      />
    </>
  );
}

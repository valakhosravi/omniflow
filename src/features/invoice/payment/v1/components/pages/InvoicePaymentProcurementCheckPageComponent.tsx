"use client";
import InvoiceFollowupIndex from "./InvoiceFollowupIndex";
import { InvoiceButtonsType, InvoicePageTypes } from "../../invoice.type";
import { AppButtonProps } from "@/components/common/AppButton";
import { useState } from "react";

export default function ProcurementSecondCheckIndex() {
  const [selectedBtn, setSelectedBtn] = useState<InvoiceButtonsType | null>(
    null,
  );

  const onAccept = () => setSelectedBtn(InvoiceButtonsType.ACCEPT);
  const onReject = () => setSelectedBtn(InvoiceButtonsType.REJECT);
  const onRefer = () => setSelectedBtn(InvoiceButtonsType.REFER);

  const buttonList: AppButtonProps[] = [
    {
      label: "ارجاع به ناظر",
      color: "primary",
      variant: "outline",
      onClick: onRefer,
    },

    {
      label: "عدم تایید",
      color: "danger",
      variant: "outline",
      onClick: onReject,
    },
    {
      label: "تایید",
      color: "primary",
      variant: "contained",
      onClick: onAccept,
    },
  ];
  return (
    <InvoiceFollowupIndex
      selectedBtn={selectedBtn}
      buttonList={buttonList}
      pageType={InvoicePageTypes.PROCUREMENT_CHECK}
    />
  );
}

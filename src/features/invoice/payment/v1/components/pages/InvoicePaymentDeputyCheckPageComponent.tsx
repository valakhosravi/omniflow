"use client";

import { AppButtonProps } from "@/components/common/AppButton";
import { InvoiceButtonsType, InvoicePageTypes } from "../../invoice.type";
import InvoiceFollowupIndex from "./InvoiceFollowupIndex";
import { useState } from "react";

export default function InvoicePaymentDeputyCheckPageComponent() {
  const [selectedBtn, setSelectedBtn] = useState<InvoiceButtonsType | null>(
    null,
  );

  const onAccept = () => setSelectedBtn(InvoiceButtonsType.ACCEPT);
  const onReject = () => setSelectedBtn(InvoiceButtonsType.REJECT);
  const onRefer = () => setSelectedBtn(InvoiceButtonsType.REFER);

  const buttonList: AppButtonProps[] = [
    {
      label: "ارجاع به کارشناس",
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
      pageType={InvoicePageTypes.DEPUTY_CHECK}
    />
  );
}

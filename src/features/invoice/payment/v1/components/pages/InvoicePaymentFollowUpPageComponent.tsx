"use client";

import InvoiceFollowupIndex from "./InvoiceFollowupIndex";
import { InvoicePageTypes } from "../../invoice.type";

export default function InvoicePaymentFollowUpPageComponent() {
  return (
    <InvoiceFollowupIndex
      selectedBtn={null}
      pageType={InvoicePageTypes.FOLLOW_UP}
    />
  );
}

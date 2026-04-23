"use client";

import { InvoicePageTypes } from "../../invoice.type";
import InvoiceFollowupIndex from "./InvoiceFollowupIndex";

export default function InvoicePaymentWarehouseCheckPageComponent() {
  return (
    <InvoiceFollowupIndex
      selectedBtn={null}
      pageType={InvoicePageTypes.WAREHOUSE_CHECK}
    />
  );
}

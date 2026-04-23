import {
  InvoiceButtonsType,
  InvoiceFormData,
  InvoicePageTypes,
  InvoicePayloadTypes,
} from "./invoice.type";

export const createInvoicePayload = ({
  pageType,
  data,
  selectedBtn,
}: {
  pageType: InvoicePageTypes;
  data: InvoiceFormData;
  selectedBtn: InvoiceButtonsType | null;
}): InvoicePayloadTypes => {
  return (invoicePayloadGenerators as any)[pageType](data, selectedBtn);
};

const invoiceDeputyPayloadGenerator = (
  data: InvoiceFormData,
  selectedBtn: InvoiceButtonsType,
): InvoicePayloadTypes[InvoicePageTypes.DEPUTY_CHECK] => {
  const isRefer = selectedBtn === InvoiceButtonsType.REFER;
  const isAccept = selectedBtn === InvoiceButtonsType.ACCEPT;

  const assign = isRefer;
  const assigneePersonnelId = isRefer ? String(data.select) : "";
  const assignUserId = isRefer ? data.userId : 0;
  const approve = isAccept;
  return {
    Assign: assign,
    AssigneePersonnelId: assigneePersonnelId,
    DeputyApprove: approve,
    AssigneeUserId: assignUserId,
    DeputyDescription: data.additionalDescription ?? "",
  };
};

const invoiceProcurementPayloadGenerator = (
  data: InvoiceFormData,
  selectedBtn: InvoiceButtonsType,
): InvoicePayloadTypes[InvoicePageTypes.PROCUREMENT_CHECK] => {
  const isRefer = selectedBtn === InvoiceButtonsType.REFER;
  const isAccept = selectedBtn === InvoiceButtonsType.ACCEPT;

  const refer = isRefer;
  const approve = isAccept;

  return {
    CPOSecondApprove: approve,
    CPOSecondDescription: data.additionalDescription ?? "",
    Edit: false,
    DeputyAssign: refer,
  };
};

const invoiceDeputyExpertPayloadGenerator = (
  data: InvoiceFormData,
  selectedBtn: InvoiceButtonsType,
): InvoicePayloadTypes[InvoicePageTypes.DEPUTY_EXPERT_CHECK] => {
  const isApprove = selectedBtn === InvoiceButtonsType.ACCEPT;

  const approve = isApprove;

  return {
    ExpertApprove: approve,
    ExpertDescription: data.additionalDescription ?? "",
  };
};

const invoiceWarehousePayloadGenerator =
  (): InvoicePayloadTypes[InvoicePageTypes.WAREHOUSE_CHECK] => {
    return {};
  };

const invoiceFinancialPayloadGenerator = (
  data: InvoiceFormData,
  selectedBtn: InvoiceButtonsType,
): InvoicePayloadTypes[InvoicePageTypes.FINANCIAL_CHECK] => {
  const isAccept = selectedBtn === InvoiceButtonsType.ACCEPT;

  const approve = isAccept;

  return {
    FinancialApprove: approve,
    FinancialDescription: data.additionalDescription,
    NewInvoiceAmount: data.amount ?? 0,
    NewAmount: data.amountReason === 2 ? true : false,
    RejectionReasonId: data.amountReason ?? 0,
    RejectionDescription: data.additionalDescription,
    InvoiceId: data.invoiceId ?? 0,
  };
};

export const invoicePayloadGenerators = {
  [InvoicePageTypes.DEPUTY_CHECK]: invoiceDeputyPayloadGenerator,
  [InvoicePageTypes.DEPUTY_EXPERT_CHECK]: invoiceDeputyExpertPayloadGenerator,
  [InvoicePageTypes.WAREHOUSE_CHECK]: invoiceWarehousePayloadGenerator,
  [InvoicePageTypes.FINANCIAL_CHECK]: invoiceFinancialPayloadGenerator,
  [InvoicePageTypes.PROCUREMENT_CHECK]: invoiceProcurementPayloadGenerator,
};

export interface InvoiceAttachments {
  AttachmentId: number;
  AttachmentKey: string;
  AttachmentAddress: string;
  Title: string;
  PersonnelId: number;
  Assignee: string | null;
  AssigneeType: string | null;
}

export interface getInvoiceByRequestId {
  RequestId: number;
  InvoiceId: number;
  ProjectId: number;
  UserId: number;
  Title: string;
  InvoiceDate: string;
  FactorNumber: string;
  Amount: number;
  PaymentStatus: number;
  Description: string;
  ContractorName: string;
  Mobile: string;
  VatEndDate: string;
  ProvidedItemId: number;
  NewAmount: number;
  RejectionReasonId: number;
  ProvidedItemName: string | null;
  ProvidedItemDescription: string;
  RejectionReasonName: string;
  WarehouseFileAddress: string;
  WarehouseReceiptFileAddress: string;
  InvoiceAttachments: InvoiceAttachments[];
}

export interface getInvoiceApprover {
  GroupId: number;
  ParentId: number;
  GroupKey: string;
  Name: string;
}

// InvoiceModels.ts
export interface InvoiceApprover {
  GroupId: number;
  ParentId?: number | null;
  GroupKey?: string | null;
  Name?: string | null;
}

export interface InvoiceAttachmentDetails {
  AttachmentId: number;
  AttachmentKey?: string | null;
  AttachmentAddress?: string | null;
  Title?: string | null;
  PersonnelId: number;
  Assignee?: string | null;
  AssigneeType?: number | null;
}

export interface InvoiceDetails {
  RequestId: number;
  InvoiceId: number;
  ProjectId: number;
  UserId: number;
  Title?: string | null;
  InvoiceDate: string;
  FactorNumber?: string | null;
  Amount: number;
  PaymentStatus: number;
  Description?: string | null;
  ContractorName?: string | null;
  Mobile?: string | null;
  VatEndDate?: string;
  ProvidedItem?: string | null;
  InvoiceAttachments?: InvoiceAttachmentDetails[];
}

export interface GetAllInvoiceDetailsPagination {
  Items?: InvoiceDetails[];
  TotalCount: number;
  PageSize: number;
  CurrentPage: number;
  TotalPages: number;
  HasPrevious: boolean;
  HasNext: boolean;
}

export interface SaveInvoiceRequest {
  RequestId?: number;
  ProjectId?: number;
  Title: string;
  InvoiceDate: string;
  FactorNumber: string;
  Amount?: number;
  PaymentStatus?: number;
  Description?: string;
}

export interface UpdateInvoiceRequest {
  Title?: string | null;
  InvoiceDate?: string | null;
  FactorNumber?: string | null;
  Amount?: number | null;
  PaymentStatus?: number | null;
  Description?: string | null;
}

export interface UpdatePaymentStatusRequest {
  PaymentStatus: number;
}

export interface SaveInvoiceDetailRequest {
  InvoiceId: number;
  ApproverGroupKey: string;
  ProvidedItemId: number;
  Description?: string;
  WarehouseRequired?: boolean;
  FileName?: string;
  WarehouseFile?: File;
  ProvidedItemDescription: string;
}

export interface GetProvidedItems {
  ProvidedItemId: number;
  Name: string;
  CreatedDate: string;
}

export interface GetDeputyUsersModel {
  JobPositionId: number;
  Title: string;
  Parent: number;
  FullName: string;
  PersonnelId: number;
  UserId: number;
}

export interface GetRejectionReasons {
  RejectionReasonId: number;
  Name: string;
  CreatedDate: string;
}

export interface GetUserInGroup {
  UserId: number;
  PersonnelId: number;
  GroupId: number;
  FullName: string;
  Mobile: string;
}

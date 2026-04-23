import { GeneralResponse } from "@/services/commonApi/commonApi.type";

export interface AddContractorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editId: number | null;
  categories: GeneralResponse<CategoryDetails[]> | undefined;
}

export interface CategoryDetails {
  Name: string | null;
  CategoryId: number;
  CreatedDate: string; // ISO date-time
}

export interface ContractorDetails {
  ContractorId: number;
  CategoryId: number;
  UserId: number;
  Name: string | null;
  Address: string | null;
  Mobile: string | null;
  Phone: string | null;
  StartDate: string; // ISO date-time
  ContactPoint: string | null;
  LogoAddress: string | null;
  VatcertificateAddress: string | null;
  VatstartDate: string | null; // ISO date-time | null
  VatendDate: string | null; // ISO date-time | null
  CreatedDate: string; // ISO date-time
  LastCollabrationDate: string;
}

export interface GetContractorProjects {
  ProjectId: number;
  ContractorId: number;
  UserId: number;
  Name: string;
  BeneficiaryName: string;
  ContractNumber: string;
  ContractStartDate: string;
  ContractEndDate: string;
  ContractStatus: number;
  ContractAmount: number;
  IBAN: string;
  CreatedDate: string;
}

export interface GetContractorInfo {
  Name: string;
  Address: string;
  LogoAddress: string;
  VATCertificateAddress: string;
  TotalProjects: number;
  VATStartDate: string;
  VATEndDate: string;
  Phones: string;
  CategoryName: string;
  CategoryId: number;
  FirstCollabrationDate: string;
  LastCollabrationDate: string;
}

export interface ProjectDetails {
  ProjectId: number;
  ContractorId: number;
  UserId: number;
  Name: string | null;
  BeneficiaryName: string | null;
  ContractNumber: string | null;
  ContractStartDate: string | null;
  ContractEndDate: string | null;
  ContractStatus: number;
  ContractAmount: number | null;
  IBAN: string | null;
  CreatedDate: string;
  ProvidedItemId: number;
  ApproverUserId: number;
  ProvidedItemDescription: string | null;
  WarehouseRequired: boolean;
}

export interface CreateProjectRequest {
  ContractorId: number;
  Name: string;
  BeneficiaryName: string;
  ContractNumber?: string;
  ContractStartDate?: string;
  ContractEndDate?: string;
  ContractStatus: string;
  ContractAmount?: number;
  IBAN: string;
  ApproverGroupKey: string;
  ProvidedItemId: number;
  WarehouseRequired: boolean;
  WarehouseFile?: File | string;
  ProvidedItemDescription: string;
}
export interface UpdateProjectRequest {
  ApproverGroupKey?: string;
  Name?: string | null;
  WarehouseRequired?: boolean;
  BeneficiaryName?: string | null;
  ContractNumber?: string | null;
  ContractStartDate?: string | null;
  ContractEndDate?: string | null;
  ContractStatus?: number | null;
  ContractAmount?: number | null;
  IBAN?: string | null;
}

export interface GetProjectsQuery {
  SearchTerm?: string;
  PageNumber?: number;
  PageSize?: number;
  SortOrder?: string;
  Status?: number;
  StartDate?: string;
  EndDate?: string;
}

export interface UpdateVatRequest {
  vatcertificateFile?: File | null;
  vatstartDate?: string; // ISO date-time
  vatendDate?: string; // ISO date-time
}

export interface GetContractorsQuery {
  contractorId?: number;
  SearchTerm?: string;
  PageNumber?: number;
  PageSize?: number;
  SortOrder?: string;
}
export interface CreateContractorRequest {
  CategoryId: number;
  Name: string;
  Address: string;
  StartDate: string;
  Mobile: string;
  ContactPoint: string;
  Phone?: string;
  LogoFile?: File | string;
  VatcertificateFile?: File | string;
  VatstartDate?: string;
  VatendDate?: string;
}
export interface CreateInvoiceRequest {
  PersonnelId: string;
  Title: string;
  MobileNumber: string;
  Description: string;
  ProjectId: number;
  InvoiceTitle: string;
  InvoiceDate: string; // ISO date string
  FactorNumber: string;
  Amount: number;
  Destination: string;
  ApproverUserId: number;
  WarehouseRequired: boolean | null;
}

/**
 * Type definitions for contract PDF rendering API
 */

export interface ContractTerm {
  Title: string;
  InitialDescription?: string;
  FinalDescription?: string;
  SubClauses?: Array<{
    Title: string;
    Description: string;
  }>;
}

export interface ContractClause {
  ClauseId?: number;
  ClauseName: string;
  ClauseDescription?: string;
  Terms?: ContractTerm[];
}

export interface SignatureSettings {
  needsSignature?: boolean;
  signerCompanyName?: string;
  signerPerson?: string;
  signerOrganizationPosition?: string;
  signaturePlacement?: "endOfContract" | "endOfEachPage";
}

export interface ApprovalHistoryItem {
  FullName: string;
  JobTitle: string;
  ModifiedDate: string;
  CreatedDate: string;
  Message: string;
  Comment: string;
  Title?: string;
  EntityTypeId?: number; // 1 = ماده (Clause), 2 = بند (Term)
}

export interface RenderContractRequest {
  ContractTitle?: string;
  contractTitle?: string;
  ContractClauses?: ContractClause[];
  clauses?: ContractClause[];
  NeedsSignature?: boolean;
  needsSignature?: boolean;
  signatureSettings?: SignatureSettings;
  approvalHistory?: ApprovalHistoryItem[];
  ApprovalHistory?: ApprovalHistoryItem[];
}

export interface RenderContractError {
  error: string;
  details?: string;
}


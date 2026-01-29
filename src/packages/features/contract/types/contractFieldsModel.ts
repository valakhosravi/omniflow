export interface SaveContractFieldValues {
  ContractId: number;
  FieldValueDetails: FieldValueDetailsModel[];
}

export interface FieldValueDetailsModel {
  ContractFieldId: number;
  FieldValue: string;
}

export interface ContractSetting {
  Key: string;
  Value: string;
}

export interface SaveContractRequest {
  RequestId?: number | null;
  CategoryId: number;
  Title: string;
  FieldValueDetails: FieldValueDetailsModel[];
  Setting?: ContractSetting[];
}

export interface SaveContractResponse {
  ContractId: number;
}

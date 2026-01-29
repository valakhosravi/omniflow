export interface ContractFieldValue {
  ContractFieldId: number;
  FieldValue: string;
  FieldName: string;
  IsRequired: boolean;
  DisplayName: string;
}

export type NonTypeContractEntriesFormData = ContractFieldValue[];

export interface NonTypeContractEntriesForm {
  [key: string]: string;
}

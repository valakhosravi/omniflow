export interface Category {
  CategoryId: number;
  Name: string;
  CreatedDate: string;
}

export interface SubCategory {
  SubCategoryId: number;
  CategoryId: number;
  Name: string;
  Description: string;
  IsType: boolean;
  FilePath: string;
  CreatedDate: string;
  IsPersonal?: boolean;
}

export interface SubCategoryField {
  ContractFieldId: number;
  CreatedDate: string;
  DisplayName: string;
  FieldType: number;
  FieldTypeDescription: string;
  IsRequired: boolean;
  Name: string;
  SortOrder: number;
  SubCategoryId: number;
}

export interface Configuration {
  ConfigurationId: number;
  SubCategoryId: number;
  Title: string;
  Name: string;
  Type: number;
}

// Contract Field Types
export enum ContractFieldType {
  Text = 1,
  Checkbox = 2,
  Date = 3,
  Number = 4,
}

export interface ContractFieldDetails {
  FieldName: string;
  FieldValue: string;
  ContractFieldId: number;
  IsRequired: boolean;
  DisplayName: string;
  FieldType?: number;
}

export interface ContractFieldValuesInfo {
  ContractFieldValueId: number;
  ContractFieldId: number;
  ContractId: number;
  FieldValue: string;
  CreatedDate: string;
}

export interface ContractFieldValueDetails {
  ContractFieldDetails: ContractFieldValuesInfo[];
  ContractTitle: string;
}

// Contract Details Types
export interface ContractDetails {
  ContractId: number;
  SubCategoryId: number;
  CategoryId: number;
  RequestId: number;
  UserId: number;
  Title: string;
  CreatedDate: string;
  ContractFieldValues: ContractFieldValuesInfo[];
}

// Clause Types
export interface ClauseDetails {
  ClauseId: number;
  Name: string;
  SortOrder: number;
  CreatedDate: string;
  Terms: GetTermsRequestByClauseId[];
}

export interface ContractClauseDetails {
  ClauseId: number;
  ClauseName: string;
  ClauseDescription: string;
  SortOrder: number;
  Terms: TermDetails[];
}

// Term Types
export interface GetTermsRequestByClauseId {
  TermId: number;
  Title: string;
  InitialDescription: string;
  CreatedDate: string;
  FinalDescription: string;
  ModifiedDate?: string;
  ModifierUserId?: number;
  SortOrder: number;
  SubClauses: SubClauseDetails[];
}

export interface TermDetails {
  TermId: string;
  Title: string;
  InitialDescription: string;
  FinalDescription: string;
  SortOrder: number;
  SubClauses: SubClauseDetails[];
  readonly?: boolean;
  IsEditable?: boolean;
}

export interface SubClauseDetails {
  SubClauseId: number;
  Title: string;
  Description: string;
}

export interface GetSubClauses {
  SubClauseId: number;
  Title: string;
  Description: string;
  CreatedDate: string;
}

// Contract Info Types
export interface GetContractInfo {
  FilePath: string;
  ContractTitle: string;
  IsType: boolean;
  ContractFields: ContractFieldDetails[];
  ContractClauses: ContractClauseDetails[];
  Attachments: string[];
  ContractId: number;
  CategoryId: number;
  Settings?: ContractSetting[];
}

// Term Assignee Types
export interface GetTermAssigneeDetails {
  TermAssigneeId: number;
  TermId: number;
  UserId: number;
  AssignerUserId: number;
  StatusCode: number;
  Comment: string;
  CreatedDate: string;
}

// Contract Assignee Types
export interface GetContractAssigneeDetails {
  ContractAssigneeId: number;
  ContractId: number;
  EntityId: number;
  EntityTypeId: number;
  UserId: number;
  AssignerUserId: number;
  StatusCode: number;
  Message: string | null;
  Comment: string | null;
  CreatedDate: string;
  ModifiedDate: string | null;
  UserFullName: string;
  UserGroupKey: string;
  AssignerFullName: string;
  UserJobPosition: string;
  AssignerJobPosition: string;
  UserGroupName: string;
}

// Save/Update Request Types
export interface SaveContractDetail {
  ContractId: number;
}

export interface SaveContractFieldValueDetails {
  ContractFieldId: number;
  FieldValue: string;
}

export interface SaveClauseRequest {
  ContractId: number;
  Name: string;
  Description?: string;
  SortOrder: number;
}

export interface SaveTermRequest {
  ClauseId: number;
  Title: string;
  InitialDescription: string;
  SortOrder: number;
}

export interface SaveFinalTermRequest {
  TermId: number;
  FinalDescription: string;
}

export interface SaveSubClauseRequest {
  TermId: number;
  Title: string;
  Description: string;
}

export interface SaveTermAssigneeRequest {
  TermId: number;
  UserId: number;
  StatusCode: number;
}

export interface EditContractRequest {
  Title: string;
  FieldValueDetails: SaveContractFieldValueDetails[];
}

export interface UpdateRequestIdRequest {
  RequestId: number;
}

export interface UpdateClauseRequest {
  Name: string;
  Description?: string;
}

export interface UpdateTermRequest {
  Title?: string;
  InitialDescription?: string;
  SubClauses?: UpdateSubClauseDetails[];
}

export interface UpdateSubClauseDetails {
  Title?: string;
  Description?: string;
}

export interface UpdateSubClauseRequest {
  Title: string;
  Description: string;
}

export interface UpdateContractTermRequest {
  Title: string;
  InitialDescription: string;
  SubClauses: UpdateSubClauseRequest[];
}

export interface UpdateTermAssigneeRequest {
  StatusCode?: number;
  Comment?: string;
}

export interface UpdateTermSortRequest {
  TermId: number;
  SortOrder: number;
}

export interface UpdateClauseSortRequest {
  ClauseId: number;
  SortOrder: number;
}

export interface FullEditContractRequest {
  IsType: boolean;
  ContractTitle: string;
  PersonnelId: number;
  ContractFields: ContractFieldDetails[];
  ContractClauses: ContractClauseDetailsEdit[];
  Attachments: string[];
  Settings?: ContractSetting[];
}

export interface ContractClauseDetailsEdit {
  ClauseName: string;
  SortOrder: number;
  Terms: TermDetailsEdit[];
}

export interface TermDetailsEdit {
  Title: string;
  InitialDescription: string;
  FinalDescription: string;
  SortOrder: number;
  SubClauses: SubClauseDetailsEdit[];
}

export interface SubClauseDetailsEdit {
  Title: string;
  Description: string;
}

export interface FullSaveRequest {
  RequestId: number | null;
  CategoryId: number;
  Title: string;
  ContractFields: SaveContractFieldValueDetails[];
  ContractClauses: ContractClauses[];
  Setting?: ContractSetting[];
}

export interface ContractClauses {
  Name: string;
  Description: string;
  SortOrder: number;
  Terms: Term[];
}

export interface Term {
  Title: string;
  InitialDescription: string;
  SortOrder: number;
  SubClauses: SubClauses[];
}

export interface SubClauses {
  Title: string;
  Description: string;
}

export interface ContractDepartments {
  ParentId: number;
  GroupKey: string;
  Name: string;
}

export interface ContractSetting {
  Key: string;
  Value: string;
}

// Contract Template Types
export interface ContractTemplate {
  TemplateId: number;
  Name: string;
  Description: string;
  ClausesCount: number;
  TermsCount: number;
  SubClausesCount: number;
  CreatedDate: string;
  Clauses?: ContractClauseDetails[];
}

export interface saveTermAssigneeRequest {
  ContractId: number;
  RequestId: number;
  BusinessKey?: string;
  TermGroups?: TermGroup[];
}

export interface TermGroup {
  GroupKeys?: string[];
  TermId: number;
}

export interface EntityGroup {
  GroupKeys?: string[];
  EntityId: number;
  EntityTypeId: number;
  Message?: string;
}

export interface SaveContractAssigneeRequest {
  ContractId: number;
  RequestId: number;
  BusinessKey?: string;
  ProcessInstanceId?: string;
  EntityGroups?: EntityGroup[];
}

export interface UpdateContractAssigneeRequest {
  StatusCode?: number;
  Comment?: string;
}

export interface SaveSubCategoryTemplateRequest {
  CategoryId: number;
  Name: string;
  Description: string;
  Template: string;
  IsPersonal: boolean;
}

export interface SaveSubCategoryWithFieldsRequest {
  CategoryId: number;
  Name: string;
  Description: string;
  Template: string;
  IsPersonal: boolean;
  SubCategoryFields: SubCategoryField[];
}

export interface UpdateSubCategoryWithFieldsRequest {
  CategoryId: number;
  Name: string;
  Description: string;
  Template: string;
  IsPersonal: boolean;
  SubCategoryFields: SubCategoryField[];
}

export interface SubCategoryTemplate {
  SubCategoryId: number;
  CategoryId: number;
  Name: string;
  Description: string;
  IsPersonal: boolean;
  Template: string;
  CreatedDate: string;
  SubCategoryFields?: SubCategoryField[];
}

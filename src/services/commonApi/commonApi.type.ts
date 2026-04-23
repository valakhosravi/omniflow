export type SaveAndUploadRequestType = {
  InstanceId: string;
  ProcessName: string;
  IsStart: boolean;
  AttachmentDetails: AttachmentDetails[];
};

export interface AttachmentByRequestId {
  AttachmentId: number;
  RequestId: number;
  PersonnelId: number;
  Title: string;
  AttachmentAddress: string;
  Assignee: string | null;
  AssigneeType: number;
}

export interface SaveProcessAttachmentModel {
  InstanceId: string;
  ProcessName: string;
  IsStart: boolean;
  AttachmentDetails: AttachmentDetails[];
}

export interface AttachmentDetails {
  Title: string;
  AttachmentKey: string;
  AttachmentFile: File;
  Assignee?: string[];
  AssigneeType?: number;
}

export interface GetDeputyUsersModel {
  JobPositionId: number;
  Title: string;
  Parent: number;
  FullName: string;
  PersonnelId: number;
  UserId: number;
}

export interface StackHolder {
  StackHolderId: number;
  Description: string;
}

export interface StackHolderDirector {
  StackHolderDirectorId: number;
  Description: string;
}

export interface GroupUser {
  Self: string;
  MaxResults: number;
  StartAt: number;
  Total: number;
  IsLast: boolean;
  Values: value[];
}

interface value {
  PersonnelId: number;
  Self: string;
  Name: string;
  Key: string;
  EmailAddress: string;
  DisplayName: string;
  Active: boolean;
  TimeZone: string;
}
export enum GroupUsersPropertyEnum {
  DEVELOPMENT = "Departman",
  DEVELOPMENT_TERMINATE = "Development-Terminate-Request-Message",
  DEVELOPMENT_ASSIGN = "Development-Assign-Request-Message",
  REPORT = "DATA%20%28AI%20-%20BI%20-%20DINFRA%29",
  BUG_FIX_TLBO = "BACKOFFICE_DEVELOPMENT",
  BUG_FIX_TLP = "IPG_DEVELOPMENT",
}

export interface GetProcessByNameAndVersionResponse {
  CreatedDate: string;
  DefinitionId: string;
  IsDeprecated: boolean;
  Name: string;
  ProcessKey: string;
  ProcessTypeId: number;
  Version: number | string; // Can be number or string depending on API version
}

export interface GetProcessByNameAndVersionParams {
  processName: string;
  version: string;
}

export interface GetRequestTimelineModel {
  Fullname: string;
  StatusDate: string;
  StatusName: string;
  StatusDescription: string | null;
  personnelId: number;
  StateCode: number;
  StateName: string;
  StatusCode: number;
  JobPositionName: string;
}

export interface GetRequestById {
  ActionDate: string;
  BusinessKey: string;
  CreatedDate: string;
  Description: string;
  JiraIssueKey: string;
  FullName: string;
  InstanceId: string;
  PersonnelId: number;
  RequestId: number;
  StatusCode: number;
  StatusName: string;
  Title: string;
  TrackingCode: number;
  UserId: number;
}

export type UpdateBatchRequest = {
  requestId: string;
  groupKeys: string[];
};

// --- Jira types ---

export interface CreateRequest {
  Summary: string;
  Description: string;
  TrackingCode: number;
  StackHolder: string;
  Assignee: string;
}

export interface CreateReportRequest {
  Summary: string;
  Description: string;
  TrackingCode: number;
  StackHolder: string;
  Assignee: string;
  StackHolderContactPoint: string[];
  StackHolderContactDirector?: string | null;
}

export interface CreateJiraIssueRequest {
  Fields: {
    project: {
      key: string;
    };
    summary: string;
    description: string;
    issuetype: {
      name: string;
    };
    assignee: {
      name: string;
    };
    customfield_10204?: string;
    labels?: string[];
    priority: {
      name: string;
    };
    components?: Array<{ name: string }>;
  };
  FileAddress?: string;
  BucketName: string;
}

export interface GetUsernameByPersonnelId {
  Username?: string | null;
}

export interface GroupMemebers {
  Self?: string | null;
  MaxResults: number;
  StartAt: number;
  Total: number;
  IsLast: boolean;
  Values?: JiraUserGroupDetail[] | null;
}

export interface JiraUserGroupDetail {
  Self?: string | null;
  Name?: string | null;
  Key?: string | null;
  EmailAddress?: string | null;
  DisplayName?: string | null;
  Active: boolean;
  TimeZone?: string | null;
}

export interface PersonnelIdProperty {
  PersonnelId: number;
}

export interface EmployeeInfo {
  PersonnelId: string;
  FullName: string;
  Mobile: string;
  AddressName: string;
  Address: string;
  FatherName: string;
  FirstName: string;
  LastName: string;
  NationalCode: string;
  BookId: string;
  EmploymentDate: string;
  Title: string;
  IsActive: boolean;
  Status: number;
}
export interface GeneralResponse<T> {
  ResponseCode: number;
  ResponseMessage: string;
  Description: string;
  Data?: T;
}

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
  Dev_Ticket = "Departman",
  REPORT = "DATA%20%28AI%20-%20BI%20-%20DINFRA%29",
  BUG_FIX_TLBO = "BACKOFFICE_DEVELOPMENT",
  BUG_FIX_TLP = "IPG_DEVELOPMENT",
}

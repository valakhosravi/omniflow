import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface EmploymentCertificateRequest {
  RequestId: string;
  EmploymentRequestId: number;
  UserId: number;
  ReceiverOrganizationName: string;
  CreatedDate: string;
  FullName: string;
  JobPositionName: string;
  FatherName: string;
  NationalCode: string;
  StartDate: string;
  JobPosition: string;
  Mobile: string;
  PersonnelId?: string;
  ManagerName: string;
  OrganizationUnitName: string;
  ForReason: string;
  Language: string;
  IsNeedSalary: boolean;
  IsNeedJobPosition: boolean;
  IsNeedPhone: boolean;
  IsNeedStartDate: boolean;
  Status?: string;
}

export type VisibleItem = "jobPosition" | "phone" | "startDate" | "salary";

export interface EmploymentCertificateData {
  requestId: number;
  fullName: string;
  jobPositionName: string;
  personnelId: string;
  receiverOrganizationName: string;
  forReason: string;
  isNeedJobPosition: boolean;
  isNeedPhone: boolean;
  isNeedStartDate: boolean;
  isNeedSalary: boolean;
  visibleItems: VisibleItem[];
  trackingCode: string;
}

export interface EmploymentCertificateFormData {
  ReceiverOrganization: string;
  ForReason: string;
  Language: string;
  isNeedJobPosition: boolean;
  isNeedPhone: boolean;
  isNeedStartDate: boolean;
  isNeedSalary: boolean;
}

export type SwitchField = Extract<
  keyof EmploymentCertificateFormData,
  "isNeedJobPosition" | "isNeedPhone" | "isNeedStartDate" | "isNeedSalary"
>;

export type SwitchStates = Pick<EmploymentCertificateFormData, SwitchField>;

export interface AutoFilledData {
  fullName: string;
  fatherName: string;
  nationalCode: string;
  jobPosition: string;
  mobile: string;
  startDate: string;
}

export interface EmploymentCertificateForm {
  description: string;
}

export interface CertificateDisplayData {
  fullName: string;
  fatherName: string;
  nationalCode: string;
  startDate: string;
  phoneNumber: string;
  jobPosition: string;
  receiverOrganization: string;
  forReason: string;
  isNeedJobPosition: boolean;
  isNeedPhone: boolean;
  isNeedStartDate: boolean;
  isNeedSalary: boolean;
  agentName: string;
  agentRole: string;
  createdDate: string;
  trackingCode: string;
}

export interface CertificateDisplayState {
  data: CertificateDisplayData | null;
}

export interface RequestDescriptionSectionProps {
  register: UseFormRegister<EmploymentCertificateFormData>;
  errors: FieldErrors<EmploymentCertificateFormData>;
  autoFilledData: AutoFilledData;
}

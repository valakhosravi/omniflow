export interface EmploymentCertificateRequest {
    RequestId: string;
    EmploymentRequestId: number;
    UserId: number;
    ReceiverOrganizationName: string;
    CreatedDate: string;
    FullName: string;
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
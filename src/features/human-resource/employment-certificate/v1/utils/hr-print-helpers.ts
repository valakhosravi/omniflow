import type { EmploymentCertificateRequest } from "../employment-certificate.types";
import type { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import {
  EmployeeInfo,
  GetRequestById,
} from "@/services/commonApi/commonApi.type";
import { toPersianDateOnly } from "@/utils/dateFormatter";
import type { CertificateDisplayData } from "../employment-certificate.types";

/** Task completion payload for Camunda */
export type EmploymentCertificateTaskPayload = {
  ReceiverOrganization: string;
  JobPosition: string;
  FullName: string;
  NationalCode: string;
  StartDate: string;
  ForReason: string;
  FatherName: string;
  Salary: string;
  HrApprove: boolean;
  description: string;
  EmploymentCertificateId: number;
};

export function buildTaskPayload(
  employmentCertificate: EmploymentCertificateRequest | null | undefined,
  employeeInfo: EmployeeInfo | null | undefined,
  options: { hrApprove: boolean; description: string },
): EmploymentCertificateTaskPayload {
  return {
    ReceiverOrganization: employmentCertificate?.ReceiverOrganizationName ?? "",
    JobPosition: employeeInfo?.Title ?? "",
    FullName: employeeInfo?.FullName ?? "",
    NationalCode: employeeInfo?.NationalCode ?? "",
    StartDate: employeeInfo?.EmploymentDate ?? "",
    ForReason: employmentCertificate?.ForReason ?? "",
    FatherName: employeeInfo?.FatherName ?? "",
    Salary: "",
    HrApprove: options.hrApprove,
    description: options.description,
    EmploymentCertificateId: Number(employmentCertificate?.RequestId ?? 0),
  };
}

export function buildCertificateDisplayData(
  employeeInfo: EmployeeInfo,
  employmentCertificate: EmploymentCertificateRequest,
  lastStatus: GetLastRequestStatus | null | undefined,
  request: GetRequestById | null | undefined,
): CertificateDisplayData {
  return {
    fullName: employeeInfo.FullName || "",
    fatherName: employeeInfo.FatherName || "",
    nationalCode: employeeInfo.NationalCode || "",
    startDate: toPersianDateOnly(employeeInfo.EmploymentDate),
    phoneNumber: employeeInfo.Mobile || "",
    jobPosition: employeeInfo.Title || "",
    receiverOrganization: employmentCertificate.ReceiverOrganizationName || "",
    forReason: employmentCertificate.ForReason || "",
    isNeedJobPosition: employmentCertificate.IsNeedJobPosition ?? false,
    isNeedPhone: employmentCertificate.IsNeedPhone ?? false,
    isNeedStartDate: employmentCertificate.IsNeedStartDate ?? false,
    isNeedSalary: employmentCertificate.IsNeedSalary ?? false,
    agentName: lastStatus?.FullName || "",
    agentRole: lastStatus?.JobPositionName || "",
    createdDate: toPersianDateOnly(employmentCertificate.CreatedDate),
    trackingCode: request?.TrackingCode ? String(request.TrackingCode) : "",
  };
}

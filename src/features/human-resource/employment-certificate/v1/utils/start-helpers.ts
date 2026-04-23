import type { EmploymentCertificateFormData } from "../employment-certificate.types";
import { toPersianDateOnly } from "@/utils/dateFormatter";

export const PROCESS_NAME = "EmploymentCertificate";

export const DEFAULT_FORM_VALUES: EmploymentCertificateFormData = {
  ReceiverOrganization: "",
  ForReason: "",
  Language: "fa",
  isNeedJobPosition: true,
  isNeedPhone: true,
  isNeedStartDate: true,
  isNeedSalary: false,
};

 
export function buildStartPayload(
  data: EmploymentCertificateFormData,
  userDetail: any,
) {
  const user = userDetail?.UserDetail;

  return {
    ReceiverOrganization: data.ReceiverOrganization,
    PersonnelId: user?.PersonnelId || "",
    Title: "درخواست گواهی اشتغال به کار",
    JobPosition: data.isNeedJobPosition ? user?.Title || "" : "",
    FullName: user?.FullName || "",
    FatherName: user?.FatherName || "",
    NationalCode: user?.NationalCode || "",
    StartDate: data.isNeedStartDate
      ? toPersianDateOnly(user?.EmploymentDate)
      : "",
    EmployeeMobileNumber: data.isNeedPhone ? user?.Mobile || "" : "",
    ForReason: data.ForReason || "-",
    Language: data.Language,
    IsNeedSalary: data.isNeedSalary,
    IsNeedJobPosition: data.isNeedJobPosition,
    IsNeedPhone: data.isNeedPhone,
    IsNeedStartDate: data.isNeedStartDate,
  };
}

import { UserDetail } from "@/packages/auth/types/UserDetail";
import {
  DevelopmentPagesEnum,
  DevelopmentTicketFormData,
} from "./development.types";

export function createPayload(
  data: DevelopmentTicketFormData,
  userDetail: UserDetail | null,
  pageType: DevelopmentPagesEnum
) {
  const isEditMode = pageType === DevelopmentPagesEnum.EDIT;
  if (isEditMode) {
    return {
      Title: data.title,
      Priority: data.order,
      RequestType: data.requestType,
      ExtraDescription: data.extraDescription,
      Description: data.description,
      ApplicationId: null,
      DeputyName: data.deputyName,
      BeneficialCustomers: data.beneficialCustomers,
      CustomerUsageDescription: data.customerUsageDescription,
      RequestedFeatures: data.requestedFeatures,
      IsReportRequired: data.isReportRequired,
      ReportPath: data.reportPath,
      HasSimilarProcess: Number(data.hasSimilarProcess),
      SimilarProcessDescription: data.expectedOutput,
      IsRegulatoryCompliant: Number(data.isRegulatoryCompliant),
      RegulatoryCompliantDescription: data.regulatoryCompliantDescription,
      ExpectedOutput: data.expectedOutput,
      TechnicalDetails: data.technicalDetails,
      Kpi: data.kpi,
      LetterNumber: data.letterNumber,
    };
  } else {
    return {
      PersonnelId: String(userDetail?.UserDetail.PersonnelId) || "",
      Title: data.title,
      EmployeeMobileNumber: userDetail?.UserDetail.Mobile,
      Priority: Number(data.order) || 1,
      RequestType: String(data.requestType) || "",

      ExtraDescription: data.extraDescription || "",
      Description: data.description || "",
      ManagerPersonnelId: String(userDetail?.Parent.PersonnelId || ""),

      ApplicationId: null,
      ManagerUserId: userDetail?.Parent.UserId,
      PositionType: userDetail?.UserDetail.PositionType,
      DeputyName: data.deputyName || "",
      BeneficialCustomers: data.beneficialCustomers || "",

      CustomerUsageDescription: data.customerUsageDescription || "",
      RequestedFeatures: data.requestedFeatures || "",
      IsReportRequired: data.isReportRequired || false,
      ReportPath: data.reportPath || "",
      HasSimilarProcess: Number(data.hasSimilarProcess) || 0,
      SimilarProcessDescription: data.expectedOutput || "",
      IsRegulatoryCompliant: Number(data.isRegulatoryCompliant) || 0,
      RegulatoryCompliantDescription: data.regulatoryCompliantDescription || "",
      ExpectedOutput: data.expectedOutput || "",
      TechnicalDetails: data.technicalDetails || "",
      Kpi: data.kpi || "",
      LetterNumber: data.letterNumber || "",
      StackHolderContactDirector: data.stackHolderContactDirector || "",
      StackHolder: data.stackHolder || "",
    };
  }
}

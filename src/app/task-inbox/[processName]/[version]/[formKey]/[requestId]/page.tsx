"use client";
import EmploymentApplicationRequestPage from "@/packages/features/task-inbox/pages/requests/employment-application-request";
import EmploymentApplicationRequestFollowUpPage from "@/packages/features/task-inbox/pages/requests/employment-application-request-follow-up";
import SalaryAdvanceRequestPage from "@/packages/features/task-inbox/pages/requests/salary-advance-request/page";
import SalaryAdvanceRequestFollowUpPage from "@/packages/features/task-inbox/pages/requests/salary-advance-request/follow-up";
import { useParams } from "next/navigation";
import React from "react";
import DevelopmentRequestFollowUpPageV1 from "@/packages/features/task-inbox/pages/requests/development-request/follow-up-v1";
import DevelopmentRequestFollowUpPageV2 from "@/packages/features/task-inbox/pages/requests/development-request/follow-up-v2";
import DevelopmentRequestPage from "@/packages/features/task-inbox/pages/requests/development-request/page";
import ContractDeputyReviewPage from "@/packages/features/contract/pages/ContractDeputyReviewPage";
import ContractDeputyReviewAssignPage from "@/packages/features/contract/pages/ContractDeputyReviewAssignPage";
import ContractLmcReviewPage from "@/packages/features/contract/pages/ContractLmcReviewPage";
import ContractFollowUpPage from "@/packages/features/contract/pages/ContractFollowUpReviewPage";
import ContractEditReviewPage from "@/packages/features/contract/pages/ContractEditReviewPage";
import LmcApprovePreview from "@/packages/features/contract/components/lmc/LmcApprovePreview";
import ProcurementCheckIndex from "@/packages/features/logistics/invoice/pages/ProcurementCheckIndex";
import DeputyCheckIndex from "@/packages/features/logistics/invoice/pages/DeputyCheckIndex";
import ExpertCheckIndex from "@/packages/features/logistics/invoice/pages/ExpertCheckIndex";
import WarehouseCheckIndex from "@/packages/features/logistics/invoice/pages/WarehouseCheckIndex";
import FinancialCheckIndex from "@/packages/features/logistics/invoice/pages/FinancialCheckIndex";
import TreasuryCheckIndex from "@/packages/features/logistics/invoice/pages/TreasuryCheckIndex";
import ProcurementSecondCheckIndex from "@/packages/features/logistics/invoice/pages/ProcurementSecondCheckIndex";
import AuditCheckIndex from "@/packages/features/logistics/invoice/pages/AuditCheckIndex";
import SecondAuditCheckIndex from "@/packages/features/logistics/invoice/pages/SecondAuditCheckIndex";
import InvoiceFollowUpPage from "@/packages/features/logistics/invoice/pages/InvoiceFollowUpPage";
import ReportFollowUpPage from "@/packages/features/report/pages/ReportFollowUpPage";
import ReportManagerReviewPage from "@/packages/features/report/pages/ReportManagerReviewPage";
import ReportEdit from "@/packages/features/report/pages/ReportEdit";
import ReportDataGovernanceManagerReviewPage from "@/packages/features/report/pages/ReportDataGovernanceManagerReviewPage";
import ReportDatagovernanceSpecialistReview from "@/packages/features/report/pages/ReportDatagovernanceSpecialistReview";
import BugFixSupportManager from "@/packages/features/bug-fix/components/BugFixSupportManager";
import BugFixUserVerify from "@/packages/features/bug-fix/components/BugFixUserVerify";
import BugFixUserEdit from "@/packages/features/bug-fix/components/BugFixEdit";
import BugFixDevelopmentExpert from "@/packages/features/bug-fix/components/BugFixDevelopmentExpert";
import DevelopmentManagerIndexV1 from "@/packages/features/development-ticket/components/v1/DevelopmentManagerIndex";
import DevelopmentManagerIndexV2 from "@/packages/features/development-ticket/components/v2/DevelopmentManagerIndex";
import AppProcessNotImplementedPage from "@/components/common/AppProcessNotImplementedPage";
import BugFixDevelopmentManager from "@/packages/features/bug-fix/components/BugFixDevelopmentManager";
import BugFixSupportExpert from "@/packages/features/bug-fix/components/BugFixSupportExpert";
import BugFixUserReview from "@/packages/features/bug-fix/components/BugFixReview";

export default function RequestDetailPage() {
  const params = useParams();
  const processName = params?.processName as string;
  const version = params?.version as string;
  const formKey = params?.formKey as string;
  const requestId = params?.requestId as string;

  switch (processName) {
    case "EmpolymentCertificate":
      switch (formKey) {
        case "follow-up":
          return (
            <EmploymentApplicationRequestFollowUpPage
              requestId={requestId}
              formKey={formKey}
            />
          );
        default:
          return (
            <EmploymentApplicationRequestPage
              requestId={requestId}
              formKey={formKey}
            />
          );
      }
    case "SalaryAdvanceRequest":
      switch (formKey) {
        case "follow-up":
          return (
            <SalaryAdvanceRequestFollowUpPage
              requestId={requestId}
              formKey={formKey}
            />
          );
        default:
          return (
            <SalaryAdvanceRequestPage requestId={requestId} formKey={formKey} />
          );
      }
    case "Development":
      switch (formKey) {
        case "follow-up":
          switch (version) {
            case "V3":
              return (
                <DevelopmentRequestFollowUpPageV1
                  requestId={requestId}
                  formKey={formKey}
                />
              );
            case "V4":
              return (
                <DevelopmentRequestFollowUpPageV2
                  requestId={requestId}
                  formKey={formKey}
                />
              );

            default:
              break;
          }
          return (
            <DevelopmentRequestFollowUpPageV2
              formKey={formKey}
              requestId={requestId}
            />
          );
        default:
          switch (version) {
            case "V1":
            case "V2":
            case "V3":
              return (
                <DevelopmentManagerIndexV1
                  formKey={formKey}
                  requestId={requestId}
                />
              );

            case "V4":
              return (
                <DevelopmentManagerIndexV2
                  formKey={formKey}
                  requestId={requestId}
                />
              );

            default:
              <AppProcessNotImplementedPage
                formKey={formKey}
                processName={processName}
                requestId={requestId}
                version={version}
              />;
          }
      }
    case "Contract":
      switch (formKey) {
        case "follow-up":
          return (
            <ContractFollowUpPage formKey={formKey} requestId={requestId} />
          );
        case "contract-deputy-review":
          return (
            <ContractDeputyReviewPage formKey={formKey} requestId={requestId} />
          );
        case "contract-deputy-review-assign":
          return (
            <ContractDeputyReviewAssignPage
              formKey={formKey}
              requestId={requestId}
            />
          );
        case "contract-lmc-approve":
          return (
            <ContractLmcReviewPage formKey={formKey} requestId={requestId} />
          );
        case "contract-lmc-approve-preview":
          return <LmcApprovePreview formKey={formKey} requestId={requestId} />;
        case "contract-edit":
          return (
            <ContractEditReviewPage formKey={formKey} requestId={requestId} />
          );
        // case "contract-edit-complete":
        //   return <ContractNonTypeEditComplete />;
      }
    case "InvoicePayment":
      switch (formKey) {
        case "follow-up":
          return (
            <InvoiceFollowUpPage formKey={formKey} requestId={requestId} />
          );
        case "invoice-payment-procurement-check":
          return (
            <ProcurementCheckIndex formKey={formKey} requestId={requestId} />
          );
        case "invoice-payment-deputy-check":
          return <DeputyCheckIndex formKey={formKey} requestId={requestId} />;
        case "invoice-payment-expert-check":
          return <ExpertCheckIndex formKey={formKey} requestId={requestId} />;
        case "invoice-payment-warehouse-check":
          return (
            <WarehouseCheckIndex formKey={formKey} requestId={requestId} />
          );
        case "invoice-payment-procurement-second-check":
          return (
            <ProcurementSecondCheckIndex
              formKey={formKey}
              requestId={requestId}
            />
          );
        case "invoice-payment-financial-check":
          return (
            <FinancialCheckIndex formKey={formKey} requestId={requestId} />
          );
        case "invoice-payment-treasury-check":
          return <TreasuryCheckIndex formKey={formKey} requestId={requestId} />;
        case "invoice-payment-audit-check":
          return <AuditCheckIndex formKey={formKey} requestId={requestId} />;
        case "invoice-payment-second-audit-check":
          return (
            <SecondAuditCheckIndex formKey={formKey} requestId={requestId} />
          );
      }
    case "Report":
      switch (formKey) {
        case "report-manager-review":
          return (
            <ReportManagerReviewPage formKey={formKey} requestId={requestId} />
          );
        case "report-datagovernance-manager-review":
          return (
            <ReportDataGovernanceManagerReviewPage requestId={requestId} />
          );
        case "follow-up":
          return <ReportFollowUpPage requestId={requestId} />;
        case "report-edit":
          return <ReportEdit requestId={requestId} />;
        case "report-datagovernance-specialist-review":
          return <ReportDatagovernanceSpecialistReview requestId={requestId} />;
      }

    case "Bug":
      switch (formKey) {
        case "bug-supportexpert-review":
          return <BugFixSupportExpert requestId={requestId} />;
        case "bug-supportmanager-review":
          return <BugFixSupportManager requestId={requestId} />;
        case "follow-up":
          return <BugFixUserReview requestId={requestId} />;
        case "bug-edit":
          return <BugFixUserEdit requestId={requestId} />;
        case "bug-requesterverify":
          return <BugFixUserVerify requestId={requestId} />;
        case "bug-tlbo-review":
          return (
            <BugFixDevelopmentExpert unit={"infra"} requestId={requestId} />
          );
        case "bug-tlp-review":
          return (
            <BugFixDevelopmentExpert unit={"payment"} requestId={requestId} />
          );
        case "bug-mp-review":
          return <BugFixDevelopmentManager unit={"payment"} requestId={requestId} />;
        case "bug-mbo-review":
          return <BugFixDevelopmentManager unit={"infra"} requestId={requestId} />;
      }
    default:
      return (
        <AppProcessNotImplementedPage
          formKey={formKey}
          processName={processName}
          requestId={requestId}
          version={version}
        />
      );
  }
}

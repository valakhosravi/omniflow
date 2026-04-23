import withPermission, { PERMISSION } from "@/HOC/withPermission";
import ReportDataGovernanceSpecialistReviewComponent from "@/features/report/BI/v1/components/ReportDataGovernanceSpecialistReviewComponent";

async function ReportDataGovernanceSpecialistReviewPage() {
  return <ReportDataGovernanceSpecialistReviewComponent />;
}

export default withPermission(
  ReportDataGovernanceSpecialistReviewPage,
  PERMISSION.TASK,
);

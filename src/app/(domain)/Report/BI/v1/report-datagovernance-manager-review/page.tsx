import withPermission, { PERMISSION } from "@/HOC/withPermission";
import ReportDataGovernanceManagerReviewPageComponent from "@/features/report/BI/v1/components/ReportDataGovernanceManagerReviewPageComponent";

async function ReportDataGovernanceManagerReviewPage() {
  return <ReportDataGovernanceManagerReviewPageComponent />;
}

export default withPermission(
  ReportDataGovernanceManagerReviewPage,
  PERMISSION.TASK,
);

import withPermission, { PERMISSION } from "@/HOC/withPermission";
import ReportManagerReviewPageComponent from "@/features/report/BI/v1/components/ReportManagerReviewPageComponent";

async function ReportManagerReviewPage() {
  return <ReportManagerReviewPageComponent />;
}

export default withPermission(ReportManagerReviewPage, PERMISSION.TASK);

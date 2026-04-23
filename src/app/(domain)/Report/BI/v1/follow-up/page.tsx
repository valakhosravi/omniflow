import withPermission, { PERMISSION } from "@/HOC/withPermission";
import ReportFollowUpPageComponent from "@/features/report/BI/v1/components/ReportFollowUpPageComponent";

async function ReportFollowUpPage() {
  return <ReportFollowUpPageComponent />;
}

export default withPermission(ReportFollowUpPage, PERMISSION.REQUEST);

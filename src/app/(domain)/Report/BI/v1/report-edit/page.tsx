import ReportEditPageComponent from "@/features/report/BI/v1/components/ReportEditPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

async function ReportEditPage() {
  return <ReportEditPageComponent />;
}

export default withPermission(ReportEditPage, PERMISSION.TASK);

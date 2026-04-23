import BugSupportExpertPageComponent from "@/features/support/bug/v1/components/Support/BugSupportExpertPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function SupportExpertPageComponent() {
  return <BugSupportExpertPageComponent />;
}

export default withPermission(SupportExpertPageComponent, PERMISSION.TASK);

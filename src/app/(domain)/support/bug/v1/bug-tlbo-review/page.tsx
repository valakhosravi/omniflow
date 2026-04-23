import BugDevelopmentExpertPageComponent from "@/features/support/bug/v1/components/Development/BugDevelopmentExpertPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentExpertInfraPage() {
  return <BugDevelopmentExpertPageComponent unit="infra" />;
}
export default withPermission(DevelopmentExpertInfraPage, PERMISSION.TASK);

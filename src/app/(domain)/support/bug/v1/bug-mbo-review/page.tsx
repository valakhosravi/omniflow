import BugDevelopmentManagerPageComponent from "@/features/support/bug/v1/components/Development/BugDevelopmentManagerPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentManagerInfraPage() {
  return <BugDevelopmentManagerPageComponent unit="infra" />;
}

export default withPermission(DevelopmentManagerInfraPage, PERMISSION.TASK);

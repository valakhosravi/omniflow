import BugSupportManagerPageComponent from "@/features/support/bug/v1/components/Support/BugSupportManagerPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function SupportManagerPage() {
  return <BugSupportManagerPageComponent />;
}
export default withPermission(SupportManagerPage, PERMISSION.TASK);

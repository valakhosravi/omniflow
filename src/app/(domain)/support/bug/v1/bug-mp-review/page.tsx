import BugDevelopmentManagerPageComponent from "@/features/support/bug/v1/components/Development/BugDevelopmentManagerPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentManagerPaymentPage() {
  return <BugDevelopmentManagerPageComponent unit="payment" />;
}
export default withPermission(DevelopmentManagerPaymentPage, PERMISSION.TASK);

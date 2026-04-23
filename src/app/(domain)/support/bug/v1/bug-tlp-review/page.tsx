import BugDevelopmentExpertPageComponent from "@/features/support/bug/v1/components/Development/BugDevelopmentExpertPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function PaymentExpertInfraPage() {
  return <BugDevelopmentExpertPageComponent unit="payment" />;
}
export default withPermission(PaymentExpertInfraPage, PERMISSION.TASK);

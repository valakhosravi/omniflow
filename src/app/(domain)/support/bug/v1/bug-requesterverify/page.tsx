import BugUserVerifyPageComponent from "@/features/support/bug/v1/components/Verify/BugUserVerifyPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function UserVerifyPage() {
  return <BugUserVerifyPageComponent />;
}
export default withPermission(UserVerifyPage, PERMISSION.TASK);

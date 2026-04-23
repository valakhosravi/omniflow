import BugFollowUpPageComponent from "@/features/support/bug/v1/components/BugFollowUpPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function FollowUpPage() {
  return <BugFollowUpPageComponent />;
}

export default withPermission(FollowUpPage, PERMISSION.REQUEST);

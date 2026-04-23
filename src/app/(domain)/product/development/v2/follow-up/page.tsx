import DevelopmentFollowUpPageComponent from "@/features/product/development/v2/Components/DevelopmentFollowUpPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentFollowUpPage() {
  return <DevelopmentFollowUpPageComponent />;
}

export default withPermission(DevelopmentFollowUpPage, PERMISSION.REQUEST);

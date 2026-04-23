import DevelopmentFollowUpPageComponent from "@/features/product/development/v1/Components/DevelopmentFollowUpPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentFollowUpPage() {
  return <DevelopmentFollowUpPageComponent />;
}

export default withPermission(DevelopmentFollowUpPage, PERMISSION.REQUEST);

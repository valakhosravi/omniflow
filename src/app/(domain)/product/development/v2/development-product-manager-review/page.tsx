import DevelopmentProductManagerPageComponent from "@/features/product/development/v2/Components/DevelopmentProductManagerPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentManagerPage() {
  return <DevelopmentProductManagerPageComponent />;
}

export default withPermission(DevelopmentManagerPage, PERMISSION.TASK);

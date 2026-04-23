import DevelopmentProductManagerPageComponent from "@/features/product/development/v1/Components/DevelopmentProductManagerPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentProductManagerPage() {
  return <DevelopmentProductManagerPageComponent />;
}

export default withPermission(DevelopmentProductManagerPage, PERMISSION.TASK);

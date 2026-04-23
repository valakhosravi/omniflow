import DevelopmentManagerPageComponent from "@/features/product/development/v2/Components/DevelopmentManagerPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentManagerPage() {
  return <DevelopmentManagerPageComponent />;
}

export default withPermission(DevelopmentManagerPage, PERMISSION.TASK);

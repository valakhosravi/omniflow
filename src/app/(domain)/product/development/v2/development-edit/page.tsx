import DevelopmentEditPageComponent from "@/features/product/development/v2/Components/DevelopmentEditPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentEditPage() {
  return <DevelopmentEditPageComponent />;
}
export default withPermission(DevelopmentEditPage, PERMISSION.TASK);

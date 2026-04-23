import DevelopmentProductSecondSpecialistPageComponent from "@/features/product/development/v2/Components/DevelopmentProductSecondSpecialistPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentProductSecondSpecialistPage() {
  return <DevelopmentProductSecondSpecialistPageComponent />;
}

export default withPermission(
  DevelopmentProductSecondSpecialistPage,
  PERMISSION.TASK,
);

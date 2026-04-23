import DevelopmentProductSecondSpecialistPageComponent from "@/features/product/development/v1/Components/DevelopmentProductSecondSpecialistPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";

function DevelopmentProductSecondSpecialistPage() {
  return <DevelopmentProductSecondSpecialistPageComponent />;
}

export default withPermission(
  DevelopmentProductSecondSpecialistPage,
  PERMISSION.TASK,
);

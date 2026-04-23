import withPermission, { PERMISSION } from "@/HOC/withPermission";
import SalaryAdvanceFmCheckPageComponent from "@/features/loan/salary-advance/v1/components/SalaryAdvanceFmCheckPageComponent";

function SalaryAdvanceFmCheckPage() {
  return <SalaryAdvanceFmCheckPageComponent />;
}

export default withPermission(SalaryAdvanceFmCheckPage, PERMISSION.TASK);

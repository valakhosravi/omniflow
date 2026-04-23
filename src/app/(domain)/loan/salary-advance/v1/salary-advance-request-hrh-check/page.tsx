import withPermission, { PERMISSION } from "@/HOC/withPermission";
import SalaryAdvanceHrhCheckPageComponent from "@/features/loan/salary-advance/v1/components/SalaryAdvanceHrhCheckPageComponent";

function SalaryAdvanceHrhCheckPage() {
  return <SalaryAdvanceHrhCheckPageComponent />;
}

export default withPermission(SalaryAdvanceHrhCheckPage, PERMISSION.TASK);

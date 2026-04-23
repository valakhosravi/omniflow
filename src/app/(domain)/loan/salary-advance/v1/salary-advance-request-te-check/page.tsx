import withPermission, { PERMISSION } from "@/HOC/withPermission";
import SalaryAdvanceTeCheckPageComponent from "@/features/loan/salary-advance/v1/components/SalaryAdvanceTeCheckPageComponent";

function SalaryAdvanceTeCheckPage() {
  return <SalaryAdvanceTeCheckPageComponent />;
}

export default withPermission(SalaryAdvanceTeCheckPage, PERMISSION.TASK);

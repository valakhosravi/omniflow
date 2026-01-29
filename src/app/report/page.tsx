import ReportIndex from "@/packages/features/report/pages/ReportIndex";
import { ReportComponentType } from "@/packages/features/report/types/ReportModels";

export const metadata = {
  title: "PECCO | گزارش",
  description: "",
};

export default function ReportsPage() {
  return <ReportIndex type={ReportComponentType.CREATE} />;
}

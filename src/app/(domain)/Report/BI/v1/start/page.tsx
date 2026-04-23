import ReportStartPageComponent from "@/features/report/BI/v1/components/ReportStartPageComponent";
import { ReportComponentType } from "@/features/report/BI/v1/reportV1.types";

export const metadata = {
  title: "TIKA | گزارش",
  description: "",
};

export default function ReportStartPage() {
  return <ReportStartPageComponent type={ReportComponentType.CREATE} />;
}

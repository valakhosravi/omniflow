import ReportIndex from "@/packages/features/report/pages/ReportIndex";
import { ReportComponentType } from "../types/ReportModels";
import { useGetReportByRequestIdQuery } from "../api/ReportApi";
import TaskInboxLayout from "../../task-inbox/layouts";
import { Spinner } from "@heroui/react";

type ReportEditPropsType = {
  requestId: string;
};

export default function ReportsPage({ requestId }: ReportEditPropsType) {
  const {
    data: reportData,
    isLoading: isReportDataLoading,
    error: reportDataError,
  } = useGetReportByRequestIdQuery(Number(requestId), {
    skip: !requestId,
  });

  if (isReportDataLoading) {
    return (
      <TaskInboxLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </TaskInboxLayout>
    );
  }

  if (reportDataError || !reportData) {
    return (
      <TaskInboxLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">خطا در بارگذاری اطلاعات</div>
        </div>
      </TaskInboxLayout>
    );
  }

  return (
    <ReportIndex
      requestId={requestId}
      reportData={reportData}
      type={ReportComponentType.EDIT}
    />
  );
}

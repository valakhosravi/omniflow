"use client";

import AppTextArea from "@/components/common/AppTextArea";
import DetailsList from "@/components/common/AppWorkflowPage/components/DetailsList";
import type { SalaryAdvanceCheckDetailsProps } from "../salary-advance.types";

export default function SalaryAdvanceCheckDetails({
  detailsConfig,
  data,
  isLoading,
  isTaskClaimed,
  description,
  setDescription,
  descriptionError,
  children,
}: SalaryAdvanceCheckDetailsProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <DetailsList
        title="خلاصه درخواست مساعده"
        rows={detailsConfig}
        data={data}
        isLoading={isLoading}
      />

      {isTaskClaimed && (
        <div className="border border-[#D8D9DF] p-4 rounded-[20px]">
          {children}

          <AppTextArea
            label="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            errorMessage={descriptionError ?? undefined}
          />
        </div>
      )}
    </div>
  );
}

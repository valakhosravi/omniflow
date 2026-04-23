"use client";

import { useState } from "react";
import { Textarea } from "@heroui/react";
import DetailsList from "@/components/common/AppWorkflowPage/components/DetailsList";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import type { FileType } from "@/components/common/AppFile/AppFile.types";
import type { ReportReviewDetailsProps } from "../reportV1.types";

export default function ReportReviewDetails<TData>({
  detailsConfig,
  data,
  isLoading,
  requestId,
  managerDescription,
  setManagerDescription,
}: ReportReviewDetailsProps<TData>) {
  const [files, setFiles] = useState<FileType[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <DetailsList
        title="خلاصه درخواست"
        rows={detailsConfig}
        data={data}
        isLoading={isLoading}
      />

      {requestId && (
        <AppFile
          featureName={FeatureNamesEnum.REPORT}
          files={files}
          setFiles={setFiles}
          enableUpload={false}
          requestId={requestId}
        />
      )}

      {setManagerDescription !== undefined && (
        <div className="mb-6">
          <Textarea
            label="توضیحات"
            placeholder="در صورت نیاز توضیحات خود را وارد کنید"
            value={managerDescription ?? ""}
            onValueChange={setManagerDescription}
            classNames={{
              inputWrapper: "border border-secondary-950/[.2] rounded-[16px]",
              input:
                "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
              label: "font-medium text-[14px]/[23px] text-secondary-950",
            }}
          />
        </div>
      )}
    </div>
  );
}

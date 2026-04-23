"use client";

import { useState } from "react";
import { Textarea } from "@heroui/react";
import DetailsList from "@/components/common/AppWorkflowPage/components/DetailsList";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import type { FileType } from "@/components/common/AppFile/AppFile.types";
import type { DevelopmentReviewDetailsProps } from "../development.types";

export default function DevelopmentReviewDetails<TData>({
  detailsConfig,
  data,
  isLoading,
  requestId,
  managerDescription,
  setManagerDescription,
  descriptionError,
}: DevelopmentReviewDetailsProps<TData>) {
  const [files, setFiles] = useState<FileType[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <DetailsList
        title="خلاصه درخواست توسعه / تغییر"
        rows={detailsConfig}
        data={data}
        isLoading={isLoading}
      />

      {requestId && (
        <AppFile
          featureName={FeatureNamesEnum.DEVELOPMENT}
          files={files}
          setFiles={setFiles}
          enableUpload={false}
          requestId={requestId}
        />
      )}

      {setManagerDescription !== undefined && (
        <div className="border border-primary-950/[.1] rounded-[20px] px-[20px] py-[16px] mb-6">
          <h3 className="font-medium text-[14px]/[23px] text-primary-950">
            اطلاعات تکمیلی تیکت توسعه
          </h3>
          <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-4" />
          <Textarea
            label="توضیحات"
            placeholder="در صورت نیاز توضیحات خود را وارد کنید"
            value={managerDescription ?? ""}
            onValueChange={setManagerDescription}
            isInvalid={!!descriptionError}
            errorMessage={descriptionError}
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

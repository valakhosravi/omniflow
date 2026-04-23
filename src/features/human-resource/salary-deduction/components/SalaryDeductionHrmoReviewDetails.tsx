"use client";

import React, { useState } from "react";
import { Textarea } from "@heroui/react";
import DetailsList from "@/components/common/AppWorkflowPage/components/DetailsList";
import { salaryDeductionHrmoReviewDetailsConfig } from "../utils/hrmo-review-schema";

interface SalaryDeductionHrmoReviewDetailsProps {
  data: any;
  isLoading: boolean;
  isTaskApproved: boolean;
  descriptionRef: React.MutableRefObject<string>;
}

export default function SalaryDeductionHrmoReviewDetails({
  data,
  isLoading,
  isTaskApproved,
  descriptionRef,
}: SalaryDeductionHrmoReviewDetailsProps) {
  const [description, setDescription] = useState("");

  return (
    <>
      <DetailsList
        title="خلاصه درخواست صدور گواهی کسر از حقوق / ضمانت"
        rows={salaryDeductionHrmoReviewDetailsConfig}
        data={data}
        isLoading={isLoading}
      />

      {isTaskApproved && !isLoading && (
        <div className="mb-4">
          <Textarea
            label="توضیحات"
            placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
            value={description}
            onValueChange={(val) => {
              setDescription(val);
              descriptionRef.current = val;
            }}
            minRows={4}
            classNames={{
              inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
              input: "text-right dir-rtl",
            }}
          />
        </div>
      )}
    </>
  );
}

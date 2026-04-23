import React from "react";
import { CloseCircle } from "iconsax-reactjs";

interface AppDeprecatedProcessAlertProps {
  processDefinitionId?: string;
}

export default function AppDeprecatedProcessAlert({
  processDefinitionId,
}: AppDeprecatedProcessAlertProps) {
  return (
    <div className="flex justify-center mb-[80px]">
      <div className="text-red-500 rounded-2xl p-4 border border-red-200 bg-red-100 flex gap-3 items-center">
        <div>
          <CloseCircle size={32} />
        </div>
        <div>
          <div className="mb-2">این فرایند منسوخ شده است</div>
          <div className="text-xs text-red-500">
            شناسه فرایند: {processDefinitionId}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}

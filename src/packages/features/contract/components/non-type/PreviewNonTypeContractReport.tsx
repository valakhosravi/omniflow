"use client";

import { GetContractInfo } from "../../types/contractModel";

interface PreviewNonTypeContractReportProps {
  contractData: GetContractInfo;
}

export default function PreviewNonTypeContractReport({
  contractData,
}: PreviewNonTypeContractReportProps) {
  return (
    <div className="w-full h-full">
      <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg min-h-[600px] flex items-center justify-center">
        <p>پیش‌نمایش قرارداد در دسترس نیست</p>
      </div>
    </div>
  );
}


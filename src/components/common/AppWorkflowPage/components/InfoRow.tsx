// AppInfoRow.tsx
import React from "react";
import { InfoRowProps } from "../AppWorkflowPage.type";

function isEmptyValue(v: unknown) {
  if (v === null || v === undefined) return true;
  if (typeof v === "object") return false; // ReactNode (JSX) is never "empty"
  const s = String(v).trim();
  return s.length === 0;
}

export default function AppInfoRow({
  icon,
  title,
  value,
  type = "text",
}: InfoRowProps) {
  const empty = isEmptyValue(value);
  const isSeparateLines = type === "paragraph" || type === "file";

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center gap-2 text-[14px] font-[500]">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-white flex items-center justify-center text-[#1C3A63]">
            {icon}
          </div>

          <div className="text-[#1C3A6380] text-sm w-full">{title}</div>
        </div>

        {/* Inline value (text / badge) or empty placeholder for separate-line types */}
        {!isSeparateLines && (
          <div className="text-primary-950 font-medium w-full flex justify-end text-[14px]/[23px]">
            {empty ? "ندارد" : value}
          </div>
        )}

        {isSeparateLines && empty && (
          <div className="text-primary-950 font-medium w-full flex justify-end text-[14px]/[23px]">
            ندارد
          </div>
        )}
      </div>

      {/* Separate-line body for paragraph */}
      {type === "paragraph" && !empty && (
        <div className="flex mt-2 rounded-md">
          <p className="text-primary-950 font-medium text-[14px]/[23px] w-full p-2 break-words whitespace-pre-wrap rounded-lg border border-gray-200">
            {value}
          </p>
        </div>
      )}

      {/* Separate-line body for file */}
      {type === "file" && !empty && <div className="mt-3 w-full">{value}</div>}
    </div>
  );
}

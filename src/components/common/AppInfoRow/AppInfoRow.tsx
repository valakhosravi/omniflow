// AppInfoRow.tsx
import React from "react";
import { InfoRowProps } from "./AppInfoRows.types";

function isEmptyValue(v: unknown) {
  if (v === null || v === undefined) return true;
  const s = String(v).trim();
  return s.length === 0;
}

export default function AppInfoRow({
  icon,
  title,
  value,
  isTextArea,
}: InfoRowProps) {
  const empty = isEmptyValue(value);
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

        {/* For non-textarea we always show the value on the right */}
        {!isTextArea && (
          <div className="text-primary-950 font-medium w-full flex justify-end text-[14px]/[23px]">
            {empty ? "ندارد" : value}
          </div>
        )}

        {/* For textarea: if empty, show placeholder on the right */}
        {isTextArea && empty && (
          <div className="text-primary-950 font-medium w-full flex justify-end text-[14px]/[23px]">
            ندارد
          </div>
        )}
      </div>

      {/* Textarea body */}
      {isTextArea && !empty && (
        <div className="flex bg-secondary-0 mt-3 rounded-md">
          <p
            className="text-primary-950 font-medium text-[14px]/[23px] w-full p-2 break-words"
            // NOTE: Keep as-is if you intentionally render HTML from backend.
            // If not needed, replace with: {String(value)}
            dangerouslySetInnerHTML={{ __html: String(value) }}
          />
        </div>
      )}
    </div>
  );
}

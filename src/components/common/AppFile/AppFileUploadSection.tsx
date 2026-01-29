"use client";

import { CloudPlus } from "iconsax-reactjs";
import { ChangeEvent, useState } from "react";
import { AppFileUploadSectionPropsType, FileType } from "./AppFile.types";
import { isValidFileType } from "./AppFile.utils";
import { useUploadFileMutation } from "@/packages/features/file-manager";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { addToaster } from "@/ui/Toaster";

const AppFileUploadSection = ({ setFiles }: AppFileUploadSectionPropsType) => {
  const { userDetail } = useAuth();
  const [uploadFile] = useUploadFileMutation();
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert("فایل نباید بیشتر از ۱۰ مگابایت باشد");
      return;
    }
    const newFile: FileType = {
      url: "",
      type: file.type,
      name: file.name,
      size: file.size,
      file: file,
    };
    setFiles((prev) => {
      return [...prev, newFile];
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter((file) => isValidFileType(file));

    if (validFiles.length === 0) return;
    handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <label
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      htmlFor="file-upload"
      style={
        {
          "--dash-color": isDragging
            ? "rgba(28,58,99,0.5)"
            : "rgba(28,58,99,0.2)",
        } as React.CSSProperties
      }
      className={`cursor-pointer  dash-border w-full h-[120px] 
    transition-all duration-300 relative overflow-hidden flex items-center justify-center ${
      isDragging ? "bg-primary-50" : ""
    }`}
    >
      <div className="flex w-full h-full bg-primary-950/[.03] items-center gap-x-2 justify-center ">
        <div
          className={`p-2 bg-white rounded-[8px] border  border-primary-950/[.1] transition-all duration-300 ${
            isDragging ? "scale-110" : ""
          }`}
        >
          <CloudPlus className="size-[24px] text-primary-950" />
        </div>
        <div className="flex flex-col items-start gap-y-[4px] text-[12px]/[18px]">
          <span className="font-semibold text-secondary-950">
            {isDragging
              ? "فایل را رها کنید"
              : "فایل را رها کرده و یا بکشید و بارگذاری کنید"}
          </span>
          <span className="font-medium text-secondary-400">
            حداکثر حجم فایل ۱۰ مگابایت (PNG, JPEG, PDF, PPTX, Word, Zip, Rar)
          </span>
        </div>
      </div>

      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/zip,application/x-rar-compressed,.zip,.rar"
        className="sr-only hidden"
        onChange={handleFileChange}
      />
    </label>
  );
};

export default AppFileUploadSection;

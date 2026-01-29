"use client";

import { Icon } from "@/ui/Icon";
import Loading from "@/ui/Loading";
import { Button } from "@heroui/react";
import {
  CloudPlus,
  Document,
  Image as ImageIcon,
  ImportCurve,
} from "iconsax-reactjs";
import Image from "next/image";
import { useState } from "react";
import { FieldErrors } from "react-hook-form";
import { PiPresentation } from "react-icons/pi";
import { TbZip } from "react-icons/tb";
import { getFileTypeLabel } from "../../utils/getFileTypeLabel";
import { formatFileSize } from "../../utils/formatFileSize";

interface FilePreview {
  url: string;
  type: string;
  name: string;
  size: number;
}

interface FieldInputMultipleProps {
  previews?: FilePreview[];
  errors?: FieldErrors;
  hasSubmitted?: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dir?: "rtl" | "ltr";
  loading?: boolean;
  className?: string;
  onRemovePreview?: (index: number) => void;
  onDownloadPreview: (index: number) => void;
  [key: string]: any;
  canUpload: boolean;
}

export default function FieldInputMultiple({
  name,
  previews = [],
  errors,
  hasSubmitted,
  onChange,
  dir = "rtl",
  loading,
  className,
  onRemovePreview,
  onDownloadPreview,
  canUpload,
  ...rest
}: FieldInputMultipleProps) {
  const errorMessages = errors?.[name];
  const hasError = !!errorMessages;
  const showError = hasError && hasSubmitted;

  const [isDragging, setIsDragging] = useState(false);

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

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = {
        target: { name, files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const getFileIcon = (fileType: string, fileName: string) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    if (!fileType)
      return <Document className="size-[32px] text-primary-950/[.2]" />;
    if (fileType.includes("pdf"))
      return <Icon name="pdf" className="size-[32px]" />;
    if (fileType.includes("presentation") || fileType.includes("powerpoint"))
      return <PiPresentation className="size-[32px] text-orange-500" />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <Icon name="word" className="size-[32px]" />;
    if (
      fileType.includes("zip") ||
      fileType.includes("rar") ||
      ext === "zip" ||
      ext === "rar"
    )
      return <TbZip size={32} />;
    return <ImageIcon className="size-[32px] text-primary-950/[.2]" />;
  };

  return (
    <div className="flex flex-col gap-2 text-secondary-950">
      {canUpload && (
        <label
          tabIndex={0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          htmlFor="file-upload"
          style={
            {
              "--dash-color": showError
                ? "rgba(244,67,54,0.8)"
                : isDragging
                ? "rgba(28,58,99,0.5)"
                : "rgba(28,58,99,0.2)",
            } as React.CSSProperties
          }
          className={`cursor-pointer dash-border w-[944px] h-[100px]
              transition-all duration-300 relative overflow-hidden ${
                isDragging ? "bg-primary-50" : ""
              } ${className} p-1`}
        >
          <div className="w-full h-full bg-primary-950/[.03] rounded-[12px] flex items-center justify-center">
            <div className="flex items-center gap-x-2 justify-center">
              <div
                className={`p-2 bg-white rounded-[8px] border border-primary-950/[.1] transition-all duration-300 ${
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
                  حداکثر حجم فایل ۱۰ مگابایت (PNG, JPEG, PDF, PPTX, Word, Zip,
                  Rar)
                </span>
              </div>
            </div>

            <input
              id="file-upload"
              type="file"
              multiple
              accept="
                image/png,
                image/jpeg,
                image/jpg,
                application/pdf,
                application/vnd.openxmlformats-officedocument.presentationml.presentation,
                application/vnd.ms-powerpoint,
                application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                application/msword,
                application/zip,
                application/x-rar-compressed,
                .zip,
                .rar
              "
              className="sr-only hidden"
              name={name}
              dir={dir}
              onChange={onChange}
              {...rest}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 rounded">
                <Loading />
              </div>
            )}
          </div>
        </label>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-3" dir={dir}>
          {previews.map((file: any, index: number) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between border border-primary-950/[.2] rounded-[12px] p-[12px]"
              >
                <div className="flex gap-x-[10px] items-center">
                  <div className="relative w-[58px] h-[58px] flex items-center justify-center">
                    {file.url?.startsWith("blob:") ? (
                      <Image
                        src={file.url}
                        alt="Uploaded Preview"
                        fill
                        className="object-cover rounded-[6px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-pagination-dropdown rounded-[12px] flex items-center justify-center border border-primary-950/[.1]">
                        {getFileIcon(
                          file.type || file.AttachmentAddress || "",
                          file.name || file.Title || ""
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col font-medium text-[12px]/[18px] space-y-1">
                    <p className="text-secondary-950 truncate max-w-[150px]">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-x-2 text-secondary-400">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                        {getFileTypeLabel(file.type, file.name)}
                      </span>
                      <span>
                        {file.size !== 0 && formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                </div>

                {file.url?.startsWith("blob:") ? (
                  <Button
                    isIconOnly
                    onPress={() => onRemovePreview?.(index)}
                    className="group bg-transparent hover:bg-red-50"
                    size="sm"
                  >
                    <Icon
                      name="trash"
                      className="size-[20px] text-secondary-300 group-hover:text-red-500 transition-colors duration-200"
                    />
                  </Button>
                ) : (
                  <Button
                    isIconOnly
                    onPress={() => onDownloadPreview?.(index)}
                    className="group bg-transparent hover:bg-accent-600"
                    size="sm"
                  >
                    <ImportCurve className="size-[20px] text-secondary-300 group-hover:text-accent-700 transition-colors duration-200" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showError && (
        <span className="text-red-600 block text-xs mt-2 animate-fade-in">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
}

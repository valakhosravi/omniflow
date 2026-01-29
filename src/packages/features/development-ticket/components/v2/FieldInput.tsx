"use client";

import { Icon } from "@/ui/Icon";
import Loading from "@/ui/Loading";
import { Button } from "@heroui/react";
import { CloudPlus } from "iconsax-reactjs";
import Image from "next/image";
import { useState } from "react";
import { FieldErrors } from "react-hook-form";
import { PiPresentation } from "react-icons/pi";
import { TbZip } from "react-icons/tb";

interface FieldInputProps {
  preview?: string;
  errors?: FieldErrors;
  hasSubmitted?: boolean;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dir?: "rtl" | "ltr";
  loading?: boolean;
  className?: string;
  onRemovePreview?: () => void;
  onPress?: () => void;
  fileType?: string;
  fileName?: string;
  fileSize?: number;
  [key: string]: any;
}

export default function FieldInput({
  name,
  preview,
  errors,
  hasSubmitted,
  onChange,
  dir = "rtl",
  loading,
  className,
  onPress,
  fileType,
  fileName,
  fileSize,
  ...rest
}: FieldInputProps) {
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

    const file = e.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
      const event = {
        target: {
          name,
          files: e.dataTransfer.files,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      onChange(event);
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/zip",
      "application/x-rar-compressed",
    ];
    return validTypes.includes(file.type);
  };

  const getFileIcon = (fileType: string) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    if (fileType?.includes("pdf")) {
      return <Icon name="pdf" className="size-[32px]" />;
    }
    if (
      fileType?.includes("presentation") ||
      fileType?.includes("powerpoint")
    ) {
      return <PiPresentation className="size-[32px] text-orange-500" />;
    }
    if (fileType?.includes("word") || fileType?.includes("document")) {
      return <Icon name="word" className="size-[32px]" />;
    }
    if (
      fileType?.includes("zip") ||
      fileType?.includes("rar") ||
      ext === "zip" ||
      ext === "rar"
    ) {
      return <TbZip size={32} />;
    }
  };

  const getFileTypeLabel = (fileType: string) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    if (fileType?.includes("pdf")) return "PDF";
    if (fileType?.includes("presentation") || fileType?.includes("powerpoint"))
      return "PPTX";
    if (fileType?.includes("word") || fileType?.includes("document"))
      return "Word";
    if (fileType?.includes("image")) return "Image";
    if (
      fileType?.includes("zip") ||
      fileType?.includes("rar") ||
      ext === "zip" ||
      ext === "rar"
    )
      return ext?.toUpperCase() ?? "Archive";

    return "File";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["بیت", "کیلوبایت", "مگابایت", "گیگابایت"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImageFile = (fileType: string) => {
    return fileType?.startsWith("image/");
  };

  return (
    <div className="flex flex-col gap-2 text-secondary-950">
      {!preview && (
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

      {preview && (
        <div
          className="flex items-center justify-between w-full border border-primary-950/[.2] rounded-[12px]
            p-[12px] transition-all duration-300"
        >
          <div className="flex gap-x-[10px] items-center">
            <div className="relative w-[58px] h-[58px] flex items-center justify-center">
              {fileType && isImageFile(fileType) ? (
                <Image
                  src={preview}
                  alt="Uploaded Preview"
                  fill
                  className="object-cover object-center transition-all duration-300 ease-out rounded-[6px]"
                />
              ) : (
                <div
                  className="w-full h-full bg-pagination-dropdown rounded-[12px] 
                flex items-center justify-center border border-primary-950/[.1]"
                >
                  {fileType && getFileIcon(fileType)}
                </div>
              )}
            </div>
            <div className="flex flex-col font-medium text-[12px]/[18px] space-y-1">
              <p className="text-secondary-950">
                {fileName ? `${fileName}` : "فایل با موفقیت بارگذاری شد"}
              </p>
              <div className="flex items-center gap-x-2 text-secondary-400">
                {fileType && (
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                    {getFileTypeLabel(fileType)}
                  </span>
                )}
                {fileSize && <span>{formatFileSize(fileSize)}</span>}
              </div>
            </div>
          </div>
          <Button
            isIconOnly
            onPress={() => onPress?.()}
            className="bg-transparent hover:bg-red-50 transition-colors duration-200"
            size="sm"
          >
            <Icon
              name="trash"
              className="size-[20px] text-secondary-300 hover:text-red-500 transition-colors duration-200"
            />
          </Button>
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

"use client";

import { useState } from "react";
import { Document } from "iconsax-reactjs";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import http from "@/services/httpService";
import { addToaster } from "@/ui/Toaster";

interface ContractAttachmentsProps {
  attachments: string[];
}

export default function ContractAttachments({
  attachments,
}: ContractAttachmentsProps) {
  const [downloadingAttachments, setDownloadingAttachments] = useState<
    Record<string, boolean>
  >({});

  const handleDownloadAttachment = async (attachmentPath: string) => {
    if (!attachmentPath) return;

    // Parse attachment path: "contract/1890/file.pdf" -> bucketName: "contract", path: "1890/file.pdf"
    const parts = attachmentPath.split("/");
    if (parts.length < 2) {
      addToaster({
        title: "آدرس فایل نامعتبر است",
        color: "danger",
      });
      return;
    }

    const bucketName = "process";
    const path = attachmentPath;
    const fileName = parts[parts.length - 1];

    setDownloadingAttachments((prev) => ({ ...prev, [attachmentPath]: true }));

    try {
      const response = await http.get<ArrayBuffer>(
        `/api/v2/FileManager/DownloadFile`,
        {
          params: { bucketName, path },
          responseType: "arraybuffer",
        }
      );

      const contentType =
        response.headers["content-type"] || "application/octet-stream";
      const blob = new Blob([response.data], { type: contentType });

      // Download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      addToaster({
        title: "فایل با موفقیت دانلود شد",
        color: "success",
      });
    } catch (error: any) {
      console.error("Error downloading attachment:", error);
      addToaster({
        title: error?.response?.data?.ResponseMessage || "خطا در دانلود فایل",
        color: "danger",
      });
    } finally {
      setDownloadingAttachments((prev) => ({
        ...prev,
        [attachmentPath]: false,
      }));
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      return <Icon name="pdf" className="size-[24px]" />;
    }
    if (ext === "doc" || ext === "docx") {
      return <Icon name="word" className="size-[24px]" />;
    }
    return <Document size={24} className="text-primary-950/[.6]" />;
  };

  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="border border-[#D8D9DF] p-4 rounded-[20px] mb-4">
      <h3 className="text-lg font-semibold mb-4">پیوست‌ها</h3>
      <div className="space-y-2">
        {attachments.map((attachment, index) => {
          const fileName =
            attachment.split("/").pop() || `فایل ${index + 1}`;
          const isDownloading =
            downloadingAttachments[attachment] || false;

          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-[12px]"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(fileName)}
                <span className="text-[14px] text-primary-950 truncate">
                  فایل مصوبه هیئت مدیره
                </span>
              </div>
              <CustomButton
                buttonSize="sm"
                buttonVariant="outline"
                onPress={() => handleDownloadAttachment(attachment)}
                isLoading={isDownloading}
                className="flex-shrink-0"
              >
                دانلود
              </CustomButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}


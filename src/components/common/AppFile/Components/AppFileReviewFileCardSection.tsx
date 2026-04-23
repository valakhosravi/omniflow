/* eslint-disable @next/next/no-img-element */
"use client";
import { Icon } from "@/ui/Icon";
import { AppFileReviewFileCardSectionPropsType } from "../AppFile.types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ImportCurve } from "iconsax-reactjs";
import {
  formatFileSize,
  getFileIcon,
  getFileTypeLabel,
  handleDownloadImage,
  isImageFile,
} from "../AppFile.utils";
import { useDeleteAttachmentAndFileByAttachmentIdMutation } from "@/services/commonApi/commonApi";
import ConfirmDeleteFileModal from "./ConfirmDeleteFileModal";

const AppFileReviewFileCardSection = ({
  file,
  index,
  setFiles,
  enableUpload,
}: AppFileReviewFileCardSectionPropsType) => {
  const [deleteFile] = useDeleteAttachmentAndFileByAttachmentIdMutation();

  const fileType = file.type;
  const fileName = file.name;
  const fileSize = file.size;

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [openConfirmDeleteFile, setOPenConfirmDeleteFile] =
    useState<boolean>(false);

  const handleRemoveFile = () => {
    if (coverImageUrl && fileType?.startsWith("image/")) {
      URL.revokeObjectURL(coverImageUrl);
    }
    setCoverImageUrl("");
    setFiles((prev) => {
      const tempFileList = prev.filter(
        (file) => file.attachmentId !== file.attachmentId,
      );
      return tempFileList;
    });
    if (!file.attachmentId) return;
    deleteFile(file.attachmentId).then(() => {});
  };

  const handleMouseEnter = () => {
    setIsPreviewOpen(true);
  };

  const handleMouseLeave = () => {
    setIsPreviewOpen(false);
  };

  useEffect(() => {
    let previewUrl: string | null = null;

    const loadPreview = () => {
      if (file instanceof File) {
        if (file.type.startsWith("image/")) {
          previewUrl = URL.createObjectURL(file);
          setCoverImageUrl(previewUrl);
        } else {
          setCoverImageUrl(file.name);
        }

        return;
      }
    };

    loadPreview();
    return () => {
      if (previewUrl && fileType?.startsWith("image/")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleConfirmDeleteFile = () => {
    handleRemoveFile();
    setOPenConfirmDeleteFile(false);
  };
  const handleCloseConfirmModal = () => {
    setOPenConfirmDeleteFile(false);
  };

  return (
    <>
      <div
        key={`${file.name}-${file.size}-${index}`}
        className="flex items-center justify-between border border-neutral-200 rounded-[12px] p-[12px]"
      >
        <div className="flex gap-x-[10px] items-center min-w-0">
          <div className="relative w-[58px] h-[58px] flex items-center justify-center flex-shrink-0">
            {fileType && coverImageUrl && isImageFile(fileType) ? (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full cursor-pointer "
              >
                <Image
                  src={coverImageUrl}
                  alt={fileName?.slice(1, 10) || ""}
                  className="  object-contain object-center rounded-[12px] border border-primary-950/[.1]"
                />

                {isPreviewOpen && (
                  <div
                    className="absolute z-50 left-1/2 top-[-100px] -translate-x-1/2 -translate-y-1/2
                             w-[220px] h-[220px]
                             bg-white rounded-[16px] shadow-xl
                             pointer-events-none"
                  >
                    <img
                      src={file.url}
                      alt={fileName}
                      className="w-full h-full object-contain rounded-[16px]"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-pagination-dropdown rounded-[12px] flex items-center justify-center">
                {(fileName && fileType && getFileIcon(fileType, fileName)) || (
                  <div className="size-[32px] bg-primary-950/[.2] rounded" />
                )}
              </div>
            )}
          </div>

          <div className="  flex flex-col font-medium text-[12px]/[18px] space-y-1 flex-1 min-w-0">
            <p className="text-secondary-950 truncate flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {fileName && fileName.slice(0, 16)}...
            </p>
            <div className="flex items-center gap-x-2 text-secondary-400">
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                {fileType && fileName && getFileTypeLabel(fileType, fileName)}
              </span>
              <span>
                {(fileSize && fileSize > 0 && formatFileSize(fileSize)) || ""}
              </span>
            </div>
          </div>
          <div>
            {enableUpload && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOPenConfirmDeleteFile(true);
                }}
                className="flex-shrink-0 group hover:bg-red-50 p-2 rounded transition-colors"
              >
                <Icon
                  name="trash"
                  className="size-[20px] text-secondary-300 group-hover:text-red-500 transition-colors duration-200"
                />
              </button>
            )}
            {file.AttachmentAddress && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDownloadImage(file);
                }}
                className="flex-shrink-0 group cursor-pointer p-2 rounded transition-colors"
              >
                <ImportCurve className="size-[20px] text-secondary-300 group-hover:text-accent-700 transition-colors duration-200" />
              </button>
            )}
          </div>
        </div>
      </div>
      <ConfirmDeleteFileModal
        handleConfirm={handleConfirmDeleteFile}
        isConfirmModalOpen={openConfirmDeleteFile}
        onClose={handleCloseConfirmModal}
      />
    </>
  );
};

export default AppFileReviewFileCardSection;

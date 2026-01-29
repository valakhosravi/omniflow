import { ChangeEvent, useEffect, useState } from "react";
import FieldInputMultiple from "./FieldInputMultiple";
import { useUploadFileMutation } from "@/packages/features/file-manager/api/fileManagerApi";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import fetchImageFile from "@/components/food/FetchImageFile";
import { useGetAttachmentByRequestIdQuery } from "@/services/commonApi/commonApi";
import { getMimeTypeFromName } from "@/components/common/AppFile/AppFile.utils";
import { UploadedFile } from "@/components/common/AppFile/AppFile.types";

interface UploadFileProps {
  classNames?: string;
  title?: string;
  requestId: string;
  canUpload: boolean;
  dir?: "rtl" | "ltr" | undefined;
  onFilesSelected?: (files: File[]) => void;
  onFileRemoved?: (index: number) => void;
}

export default function UploadMultipleFile({
  classNames,
  title,
  requestId,
  canUpload,
  dir,
  onFilesSelected,
  onFileRemoved,
}: UploadFileProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { userDetail } = useAuth();
  const [uploadFile] = useUploadFileMutation();

  const { data: attachments, isLoading: isGetting } =
    useGetAttachmentByRequestIdQuery(Number(requestId));

  useEffect(() => {
    if (attachments?.Data?.length) {
      const serverFiles = attachments.Data.map((a) => ({
        url: `${window.location.origin}/uploads/${a.AttachmentAddress}`,
        type: getMimeTypeFromName(a.AttachmentAddress),
        name: a.AttachmentAddress,
        size: 0,
        isFromServer: true,
        attachmentId: a.AttachmentId,
      }));

      setFiles(serverFiles);
    }
  }, [attachments]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const maxSize = 10 * 1024 * 1024; // 10 MB
    setLoading(true);

    // Call callback with File objects before processing
    const fileArray = Array.from(selectedFiles);
    const validFiles = fileArray.filter((file) => file.size <= maxSize);
    if (onFilesSelected && validFiles.length > 0) {
      onFilesSelected(validFiles);
    }

    try {
      for (const file of fileArray) {
        if (file.size > maxSize) {
          alert(`فایل "${file.name}" نباید بیشتر از ۱۰ مگابایت باشد`);
          continue;
        }

        // Upload file to server
        const uploadResponse = await uploadFile({
          FileUpload: file,
          BucketName: "process",
          Path: `development/${userDetail?.UserDetail.PersonnelId}`,
          FileName: file.name,
        }).unwrap();

        if (uploadResponse.ResponseCode === 100 && uploadResponse.Data) {
          const uploadedFile: UploadedFile = {
            url: uploadResponse.Data.FileUrl,
            type: file.type,
            name: file.name,
            size: file.size,
            isFromServer: true,
          };

          setFiles((prev) => [...prev, uploadedFile]);
        } else {
          alert(
            `خطا در آپلود فایل "${file.name}": ${uploadResponse.ResponseMessage}`
          );
        }
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("خطا در آپلود فایل‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    const removedFile = files[index];
    if (removedFile.type.startsWith("image/") && !removedFile.isFromServer) {
      URL.revokeObjectURL(removedFile.url);
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
    // Notify parent component about file removal
    if (onFileRemoved) {
      onFileRemoved(index);
    }
  };

  const handleDownloadPreview = async (index: number) => {
    const file = files[index];
    const response = await fetchImageFile("process", file.name);
    if (response) {
      const url = URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col space-y-[16px]">
      {title && files.length > 0 && (
        <h2 className="font-medium text-[14px]/[27px] text-secondary-950">
          {canUpload ? title : "فایل ها"}
        </h2>
      )}
      {files.length > 0 ? (
        <FieldInputMultiple
          name="ImageFile"
          onChange={handleFileChange}
          previews={files}
          onRemovePreview={handleRemoveFile}
          onDownloadPreview={handleDownloadPreview}
          loading={loading}
          className={`mx-auto ${classNames}`}
          canUpload={canUpload}
          dir={dir}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import FieldInput from "./FieldInput";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useUploadFileMutation } from "@/packages/features/file-manager";
import { useDeleteFileMutation } from "@/packages/features/file-manager/api/fileManagerApi";
import { Icon } from "@/ui/Icon";
import { PiPresentation } from "react-icons/pi";
import { TbZip } from "react-icons/tb";
import { Image as ImageIcon } from "iconsax-reactjs";
import { getFileTypeLabel } from "@/packages/features/development-ticket/utils/getFileTypeLabel";
import { Button } from "@heroui/react";
import fetchImageFile from "@/components/food/FetchImageFile";
import { useGetAttachmentByRequestIdQuery } from "@/services/commonApi/commonApi";

interface UploadFileProps {
  classNames?: string;
  title?: string;
  setFileUrl: Dispatch<SetStateAction<string>>;
  requestId?: string | null;
  setAttachmentEdit?: Dispatch<SetStateAction<any[]>>;
  setFile?: Dispatch<SetStateAction<File | null>>;
  previews?: File | null | string;
  shouldUpload?: boolean;
  isRequired?: boolean;
}

export default function UploadFile({
  classNames,
  title,
  setFileUrl,
  requestId,
  setAttachmentEdit,
  setFile,
  previews,
  shouldUpload = true,
  isRequired = false,
}: UploadFileProps) {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const { userDetail } = useAuth();
  const [uploadFile] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();
  const { data: attachments } = useGetAttachmentByRequestIdQuery(
    Number(requestId),
    {
      skip: !requestId || isNaN(Number(requestId)) || Number(requestId) === 0,
    }
  );

  useEffect(() => {
    if (attachments?.Data && attachments.Data.length > 0 && setAttachmentEdit) {
      setAttachmentEdit(attachments.Data);
    } else if (setAttachmentEdit) {
      setAttachmentEdit([]);
    } else {
      return;
    }
  }, [attachments, setAttachmentEdit]);

  useEffect(() => {
    if (!previews) {
      setCoverImageUrl(null);
      setFileType("");
      setFileName("");
      setFileSize(0);
      return;
    }

    let previewUrl: string | null = null;

    const loadPreview = async () => {
      if (previews instanceof File) {
        // Local file
        setFileType(previews.type);
        setFileName(previews.name);
        setFileSize(previews.size);

        if (previews.type.startsWith("image/")) {
          previewUrl = URL.createObjectURL(previews);
          setCoverImageUrl(previewUrl);
        } else {
          setCoverImageUrl(previews.name);
        }

        if (setFile) setFile(previews);
        return;
      }

      if (typeof previews === "string" && previews.trim() !== "") {
        setLoading(true);
        try {
          const urlFileName = previews.split("/").pop() || "file";
          const ext = urlFileName.split(".").pop()?.toLowerCase() || "";

          const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
            ext
          );
          const detectedFileType = isImage
            ? `image/${ext}`
            : ext === "pdf"
            ? "application/pdf"
            : ["doc", "docx"].includes(ext)
            ? "application/msword"
            : ["ppt", "pptx"].includes(ext)
            ? "application/presentation"
            : ["zip", "rar"].includes(ext)
            ? "application/zip"
            : "application/octet-stream";

          setFileType(detectedFileType);
          setFileName(urlFileName);

          // Only fetch if setFile exists
          let fileBlob: Blob | null = null;
          if (setFile) {
            fileBlob = await fetchImageFile("invoice", previews);

            if (fileBlob) {
              setFileSize(fileBlob.size);
              const file = new File([fileBlob], urlFileName, {
                type: detectedFileType,
              });
              setFile(file);

              if (isImage) {
                previewUrl = URL.createObjectURL(fileBlob);
                setCoverImageUrl(previewUrl);
              } else {
                setCoverImageUrl(urlFileName);
              }
            }
          } else {
            // If we don't need File object, just show name
            setCoverImageUrl(urlFileName);
          }
        } catch (error) {
          console.error("Error loading file preview:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPreview();
    return () => {
      if (previewUrl && fileType?.startsWith("image/")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previews]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert("فایل نباید بیشتر از ۱۰ مگابایت باشد");
      return;
    }

    setLoading(true);

    try {
      // Store file information
      setFileType(file.type);
      setFileName(file.name);
      setFileSize(file.size);

      // Create preview URL
      let previewUrl = "";

      if (file.type.startsWith("image/")) {
        // For images, create object URL for preview

        previewUrl = URL.createObjectURL(file);
      } else {
        // For non-images, we'll use the file name as identifier
        previewUrl = file.name;
      }
      setCoverImageUrl(previewUrl);

      if (!shouldUpload) {
        if (setFile) setFile(file);
        setFileUrl("");
        setLoading(false);
        return;
      }

      // Upload file using file manager API
      if (userDetail?.UserDetail.PersonnelId) {
        const uploadResponse = await uploadFile({
          FileUpload: file,
          BucketName: "process",
          Path: `contract/${userDetail.UserDetail.PersonnelId}`,
          FileName: file.name,
        }).unwrap();

        if (uploadResponse.ResponseCode === 100 && uploadResponse.Data) {
          setFileUrl(uploadResponse.Data.FilePath);
          if (setFile) setFile(file);
        } else {
          throw new Error(uploadResponse.ResponseMessage || "Upload failed");
        }
      } else {
        throw new Error("User personal ID not available");
      }
    } catch (error) {
      console.error("Error handling file:", error);
      handleRemoveFile();
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = async (file?: any) => {
    try {
      setLoading(true);

      await deleteFile({
        BucketName: "process",
        Path: file?.AttachmentAddress,
      }).unwrap();
      if (coverImageUrl && fileType?.startsWith("image/")) {
        URL.revokeObjectURL(coverImageUrl);
      }

      // refetchAttachments();
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setLoading(false);
    }

    setCoverImageUrl("");
    setFileType("");
    setFileName("");
    setFileSize(0);
    setFileUrl("");
    if (setFile) setFile(null);
  };

  const getFileIcon = (fileType: string, fileName: string) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
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
    <div className="flex flex-col space-y-[16px]">
      {title && (
        <h2 className="font-medium text-[14px]/[27px] text-secondary-950">
          {title} {isRequired && <span className="text-accent-500">*</span>}
        </h2>
      )}
      <FieldInput
        name="ImageFile"
        onChange={handleFileChange}
        preview={coverImageUrl || undefined}
        fileType={fileType}
        fileName={fileName}
        fileSize={fileSize}
        onPress={handleRemoveFile}
        className={`mx-auto ${classNames}`}
      />
      {attachments?.Data && attachments?.Data?.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-3">
          {attachments.Data.map((file: any, index: number) => {
            const fileName = file.AttachmentAddress || file.Title;
            const ext = fileName.split(".").pop()?.toLowerCase() || "";
            const fileType = [
              "jpg",
              "jpeg",
              "png",
              "gif",
              "bmp",
              "webp",
            ].includes(ext)
              ? `image/${ext}`
              : ["pdf"].includes(ext)
              ? "application/pdf"
              : ["doc", "docx"].includes(ext)
              ? "application/msword"
              : ["ppt", "pptx"].includes(ext)
              ? "application/presentation"
              : ["zip", "rar"].includes(ext)
              ? "application/zip"
              : "application/octet-stream";

            return (
              <div
                key={file.AttachmentId || index}
                className="flex items-center justify-between border border-primary-950/[.2] rounded-[12px] p-[12px]"
              >
                <div className="flex gap-x-[10px] items-center">
                  <div className="relative w-[58px] h-[58px] flex items-center justify-center">
                    <div className="w-full h-full bg-pagination-dropdown rounded-[12px] flex items-center justify-center border border-primary-950/[.1]">
                      {getFileIcon(fileType, fileName)}{" "}
                      {/* Pass fileType and fileName instead */}
                    </div>
                  </div>

                  <div className="flex flex-col font-medium text-[12px]/[18px] space-y-1">
                    <p className="text-secondary-950 truncate max-w-[150px]">
                      {file.Title || file.AttachmentAddress}
                    </p>
                    <div className="flex items-center gap-x-2 text-secondary-400">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                        {getFileTypeLabel(fileType, fileName)}{" "}
                        {/* Pass fileName instead */}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  isIconOnly
                  onPress={() => handleRemoveFile(file)}
                  className="group bg-transparent hover:bg-red-50"
                  size="sm"
                >
                  <Icon
                    name="trash"
                    className="size-[20px] text-secondary-300 group-hover:text-red-500 transition-colors duration-200"
                  />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

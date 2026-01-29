import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import AdditionalInformation from "./AdditionalInformation";
import FieldInput from "./FieldInput";
import GeneralResponse from "@/models/general-response/general_response";
import { GetDevelopmentRequestDetailsModel } from "../../types/DevelopmentRequests";
import { Button } from "@heroui/react";
import { getFileTypeLabel } from "../../utils/getFileTypeLabel";
import { Icon } from "@/ui/Icon";
import { PiPresentation } from "react-icons/pi";
import { TbZip } from "react-icons/tb";
import { Image as ImageIcon } from "iconsax-reactjs";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import {
  useDeleteFileMutation,
  useUploadFileMutation,
} from "@/packages/features/file-manager/api/fileManagerApi";
import fetchImageFile from "@/components/food/FetchImageFile";
import { Import } from "iconsax-reactjs";
import {
  useDeleteAttachmentAndFileByAttachmentIdMutation,
  useGetAttachmentByRequestIdQuery,
} from "@/services/commonApi/commonApi";

interface UploadFileProps {
  setAdditionalDescription: Dispatch<SetStateAction<string>>;
  additionalDescription: string;
  setFileName: Dispatch<SetStateAction<string>>;
  setFileUrl: Dispatch<SetStateAction<string>>;
  fileName: string;
  developTicketDetail:
    | GeneralResponse<GetDevelopmentRequestDetailsModel>
    | undefined;
  requestId: string | null;
  setAttachmentEdit: Dispatch<SetStateAction<any[]>>;
  canUpload?: boolean;
  deleteProcess?: boolean;
}

export default function UploadFile({
  setAdditionalDescription,
  additionalDescription,
  setFileName,
  setFileUrl,
  fileName,
  developTicketDetail,
  requestId,
  setAttachmentEdit,
  canUpload = true,
  deleteProcess = false,
}: UploadFileProps) {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const {
    data: attachments,
    isLoading: isGetting,
    refetch: refetchAttachments,
  } = useGetAttachmentByRequestIdQuery(Number(requestId));
  const [deleteAttachment, { isLoading }] =
    useDeleteAttachmentAndFileByAttachmentIdMutation();
  useEffect(() => {
    if (developTicketDetail?.Data) {
      const data = developTicketDetail.Data;
      setAdditionalDescription(data.ExtraDescription || "");
    }
  }, [developTicketDetail, setAdditionalDescription]);

  useEffect(() => {
    if (attachments?.Data && attachments.Data.length > 0) {
      setAttachmentEdit(attachments.Data);
    } else {
      setAttachmentEdit([]);
    }
  }, [attachments, setAttachmentEdit]);

  const { userDetail } = useAuth();
  const [uploadFile] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

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

      // Upload file using file manager API
      if (userDetail?.UserDetail.PersonnelId) {
        const uploadResponse = await uploadFile({
          FileUpload: file,
          BucketName: "process",
          Path: `development/${userDetail.UserDetail.PersonnelId}`,
          FileName: file.name,
        }).unwrap();

        if (uploadResponse.ResponseCode === 100 && uploadResponse.Data) {
          setFileUrl(uploadResponse.Data.FilePath);
        } else {
          throw new Error(uploadResponse.ResponseMessage || "Upload failed");
        }
      } else {
        throw new Error("User personal ID not available");
      }
    } catch (error) {
      console.error("Error handling file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = async (file?: any) => {
    try {
      setLoading(true);
      if (deleteProcess) {
        await deleteAttachment(file.AttachmentId);
      } else {
        await deleteFile({
          BucketName: "process",
          Path: file?.AttachmentAddress,
        }).unwrap();
      }

      if (coverImageUrl && fileType?.startsWith("image/")) {
        URL.revokeObjectURL(coverImageUrl);
      }

      refetchAttachments();
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
  };

  const handleDownloadFile = async (file: any) => {
    try {
      const fileName = file.AttachmentAddress || file.Title;
      if (!fileName) return;

      const downloadedFile = await fetchImageFile("process", fileName);
      if (downloadedFile) {
        const url = URL.createObjectURL(downloadedFile);
        const link = document.createElement("a");
        link.href = url;
        link.download = downloadedFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
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
    <div className="border border-secondary-200 rounded-[20px] px-5 py-4 space-y-6">
      <div className="flex flex-col space-y-1 font-medium">
        <h4 className="text-[20px]/[28px] text-primary-950">
          بارگذاری فایل یا تصویر
        </h4>
        <p className="text-[14px]/[27px] text-secondary-400">
          لطفا برای رسیدگی سریع تر و بهتر حتما
          <span className="text-secondary-950">
            {" "}
            بنچ مارک٬ مدل درآمدی٬ نمونه‌های مشابه٬ سفر مشتری و دیاگرام و فایل
            راهنما{" "}
          </span>
          را بارگذاری کنید.
        </p>
      </div>
      {canUpload && (
        <FieldInput
          name="ImageFile"
          onChange={handleFileChange}
          preview={coverImageUrl || undefined}
          fileType={fileType}
          fileName={fileName}
          fileSize={fileSize}
          onPress={handleRemoveFile}
          className="mx-auto"
          loading={loading}
        />
      )}
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

                <div className="flex items-center gap-x-2">
                  <Button
                    isIconOnly
                    onPress={() => handleDownloadFile(file)}
                    className="group bg-transparent hover:bg-blue-50"
                    size="sm"
                  >
                    <Import
                      className="size-[20px] text-secondary-300 group-hover:text-blue-500 transition-colors duration-200"
                      variant="Bold"
                    />
                  </Button>
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
              </div>
            );
          })}
        </div>
      )}

      {fileName && (
        <div className="text-sm text-green-600">فایل با موفقیت بارگذاری شد</div>
      )}
      <AdditionalInformation
        additionalDescription={additionalDescription}
        setAdditionalDescription={setAdditionalDescription}
      />
    </div>
  );
}

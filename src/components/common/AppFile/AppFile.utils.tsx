import http from "@/services/httpService";
import { Document, Icon, Image as ImageIcon } from "iconsax-reactjs";
import { PiPresentation } from "react-icons/pi";
import { TbZip } from "react-icons/tb";
import { FileType } from "./AppFile.types";

export const isValidFileType = (file: File) => {
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

export default async function fetchImageFile(
  bucketName: string,
  path: string
): Promise<File | null> {
  try {
    const response = await http.get<ArrayBuffer>(
      `/api/v2/FileManager/DownloadFile`,
      {
        params: {
          bucketName,
          path,
        },
        responseType: "arraybuffer",
      }
    );

    const contentType = response.headers["content-type"] || "image/jpeg";
    const filename = path.split("/").pop() || "downloaded.jpg";
    const fileBlob = new Blob([response.data], { type: contentType });
    return new File([fileBlob], filename, { type: contentType });
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "";
  const k = 1024;
  const sizes = ["بیت", "کیلوبایت", "مگابایت", "گیگابایت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const getFileTypeLabel = (fileType: string, fileName: string) => {
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

export const getFileIcon = (fileType: string, fileName: string) => {
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

export const isImageFile = (fileType: string) => {
  return fileType?.startsWith("image/");
};
export function getMimeTypeFromName(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
      return "image/jpeg";
    case "pdf":
      return "application/pdf";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "doc":
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "zip":
      return "application/zip";
    case "rar":
      return "application/x-rar-compressed";
    default:
      return "application/octet-stream";
  }
}
export const handleDownloadImage = async (file: FileType) => {
  if (!file.AttachmentAddress) return;
  const response = await fetchImageFile("process", file.AttachmentAddress);

  if (response) {
    const url = URL.createObjectURL(response);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.AttachmentAddress;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};


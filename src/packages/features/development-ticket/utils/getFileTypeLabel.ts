export const getFileTypeLabel = (fileType: string, fileName: string) => {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  if (fileType.includes("pdf")) return "PDF";
  if (fileType.includes("presentation") || fileType.includes("powerpoint"))
    return "PPTX";
  if (fileType.includes("word") || fileType.includes("document")) return "Word";
  if (fileType.includes("image")) return "Image";
  if (
    fileType.includes("zip") ||
    fileType.includes("rar") ||
    ext === "zip" ||
    ext === "rar"
  )
    return ext?.toUpperCase() ?? "Archive";
  return "File";
};

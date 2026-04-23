import http from "@/services/httpService";

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

export function GetImageUrl({
  bucketName,
  path,
}: {
  bucketName: string;
  path: string;
}) {
  return `/api/v2/FileManager/DownloadFile?bucketName=${bucketName}&path=${path}`;
}

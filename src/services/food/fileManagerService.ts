import http from "@/services/httpService";

export default async function fetchImageFileService(
  bucketName: string,
  path: string
): Promise<string> {
  const response = await http.get<ArrayBuffer>(
    `/api/v2/FileManager/DownloadFile`,
    {
      params: { bucketName, path },
      responseType: "arraybuffer",
    }
  );

  const contentType = response.headers["content-type"] || "image/jpeg";
  const blob = new Blob([response.data], { type: contentType });
  return URL.createObjectURL(blob); 
}

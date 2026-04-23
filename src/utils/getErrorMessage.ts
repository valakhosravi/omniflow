import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  const err = error as any;

  // 1️⃣ Handle Axios errors first
  if (err.isAxiosError) {
    const axiosError = err as AxiosError;
    console.log(axiosError);
    
    // Don't show error toast for FileManager/DownloadFile errors
    const url = axiosError.config?.url || '';
    if (url.includes('/v2/FileManager/DownloadFile') || url.includes('/api/v2/FileManager/DownloadFile')) {
      return "";
    }

    if (axiosError.code === "ECONNABORTED" || !axiosError.code) {
      return "درخواست زمان‌بندی شده بود و پاسخ دریافت نشد. لطفا دوباره تلاش کنید";
    }

    // Check HTTP status code
    if (axiosError.response?.status) {
      switch (axiosError.response.status) {
        case 400:
          return "درخواست نامعتبر است";
        case 401:
          const url = axiosError.config?.url || '';
          if (url.includes('/v2/User/Authentication/Identity/RefreshToken')) {
            return "لطفا وارد حساب کاربری خود شوید";
          }
          // Don't show error for other 401 cases - return empty string
          return "";
        case 403:
          return "شما اجازه دسترسی به این بخش را ندارید";
        case 404:
          return "اطلاعات مورد نظر یافت نشد";
        case 500:
          return "خطای سرور - لطفا بعدا تلاش کنید";
        case 502:
          return "سرور در دسترس نیست";
        case 503:
          return "سرویس موقتا در دسترس نیست";
        default:
          return `خطا: ${axiosError.response.status}`;
      }
    }

    // Fallback to response data if available
    if (axiosError.response?.data) {
      if (typeof axiosError.response.data === "object") {
        const responseData = axiosError.response.data as any;
        // Don't show error toast for FileManager errors (ResponseCode 105)
        if (responseData.ResponseCode === 105 && (url.includes('/v2/FileManager/DownloadFile') || url.includes('/api/v2/FileManager/DownloadFile'))) {
          return "";
        }
        return (
          responseData.message ||
          responseData.error ||
          "خطای نامشخصی رخ داده است"
        );
      } else if (typeof axiosError.response.data === "string") {
        return axiosError.response.data;
      }
    }

    // Fallback to Axios error message
    return axiosError.message;
  }

  // 2️⃣ Handle generic JS Error
  if (error instanceof Error) {
    return error.message;
  }

  // 3️⃣ Unknown error type
  return "خطای نامشخصی رخ داده است";
};

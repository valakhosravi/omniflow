import useMoveBack from "@/hooks/useMoveBack";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";

const AppProcessNotImplementedPage = ({
  processName,
  version,
  formKey,
  requestId,
}: {
  processName: string;
  version: string | number;
  formKey: string;
  requestId?: string;
}) => {
  const moveBack = useMoveBack();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Icon name="warningToaster" className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-4">
          فرآیند پیاده‌سازی نشده
        </h1>

        <div className="text-gray-600 mb-6 space-y-2">
          <p className="pb-2">فرآیند درخواستی هنوز در سیستم موجود نیست.</p>
          <div className="bg-gray-100 rounded-lg p-3 text-sm text-justify">
            <p className="text-gray-600 flex justify-between pb-1">
              <span className="font-medium">فرآیند:</span>
              <span className="ml-2"> {processName}</span>
            </p>
            <p className="text-gray-600 flex justify-between pb-1">
              <span className="font-medium">نسخه:</span>
              <span className="ml-2"> {version}</span>
            </p>
            <p className="text-gray-600 flex justify-between pb-1">
              <span className="font-medium">فرم:</span>
              <span className="ml-2"> {formKey}</span>
            </p>
            {requestId && (
              <p className="text-gray-600 flex justify-between pb-1">
                <span className="font-medium">شناسه درخواست:</span>
                <span className="ml-2"> {requestId}</span>
              </p>
            )}
          </div>
        </div>
        <CustomButton
          buttonVariant="primary"
          buttonSize="md"
          onClick={moveBack}
          className="w-full flex items-center justify-center"
        >
          <div> </div>
          بازگشت
        </CustomButton>
      </div>
    </div>
  );
};

export default AppProcessNotImplementedPage;

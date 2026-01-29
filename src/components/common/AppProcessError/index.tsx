import useMoveBack from "@/hooks/useMoveBack";
import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";

const AppProcessError = ({
  processName = "",
  version = "",
  formKey = "",
  requestId = "",
}: {
  processName?: string;
  version?: string;
  formKey?: string;
  requestId?: string;
}) => {
  const moveBack = useMoveBack();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Icon name="dangerToaster" className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-4">
          خطا در سامانه
        </h1>

        <div className="text-gray-600 mb-6 space-y-2">
          <p className="pb-2">بارگذاری اطلاعات فرآیند با خطا مواجه شد</p>
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

export default AppProcessError;
